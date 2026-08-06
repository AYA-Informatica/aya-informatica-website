"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, Loader2, Mail, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { contactSchema, type ContactSchema } from "@/lib/validations"
import {
  TurnstileWidget,
  readTurnstileToken,
  resetTurnstile,
} from "@/components/shared/turnstile"
import { CONTACT_SUBJECTS } from "@/lib/constants"
import { useContactSubjects } from "@/lib/content"
import { useToastStore } from "@/store/toast"
import {
  buildMailDraft,
  draftAsText,
  gmailUrl,
  isDraftTooLongForMailto,
  mailtoUrl,
  outlookUrl,
  type MailDraft,
} from "@/lib/compose-mail"
import { cn } from "@/lib/utils"

type SubmitStatus = "idle" | "loading" | "error"

export function ContactForm() {
  const t = useTranslations("contact")
  const { toast } = useToastStore()
  const searchParams = useSearchParams()
  const contactSubjects = useContactSubjects()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
    mode: "onTouched",
  })

  const selectedSubject = watch("subject")

  useEffect(() => {
    const param = searchParams.get("subject")
    // Validated against the structural allowlist rather than the translated
    // list: the values are locale-independent, and CONTACT_SUBJECTS is a module
    // constant, so the effect does not re-run on every render the way it would
    // with the freshly-built array returned by useContactSubjects().
    if (param && CONTACT_SUBJECTS.some((s) => s.value === param)) {
      setValue("subject", param, { shouldValidate: true })
    }
  }, [searchParams, setValue])

  useEffect(() => {
    const handler = (e: Event) => {
      const value = (e as CustomEvent<string>).detail
      if (value) setValue("subject", value, { shouldValidate: true })
    }
    window.addEventListener("select-subject", handler)
    return () => window.removeEventListener("select-subject", handler)
  }, [setValue])

  // When the server cannot take the message, the visitor should not have to
  // retype it. The draft below is handed to their own mail client instead.
  const [draft, setDraft] = useState<MailDraft | null>(null)
  const [copied, setCopied] = useState(false)

  const offerMailFallback = (data: ContactSchema) => {
    setDraft(
      buildMailDraft(
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subjectLabel:
            contactSubjects.find((s) => s.value === data.subject)?.label ?? data.subject,
          message: data.message,
        },
        {
          name: t("draftName"),
          email: t("draftEmail"),
          phone: t("draftPhone"),
          topic: t("draftTopic"),
          sentFrom: t("draftSentFrom"),
        }
      )
    )
    setCopied(false)
  }

  const copyDraft = async () => {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draftAsText(draft))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard access can be refused; the draft is still on screen to select.
    }
  }

  const onSubmit = async (data: ContactSchema) => {
    try {
      const honeyField = document.querySelector<HTMLInputElement>('input[name="_honey"]')
      const payload: Record<string, unknown> = { ...data }
      if (honeyField?.value) payload._honey = honeyField.value

      const turnstileToken = readTurnstileToken()
      if (turnstileToken) payload["cf-turnstile-response"] = turnstileToken

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      // Turnstile tokens are single-use — issue a fresh one for any
      // subsequent submission, whether this one succeeded or not.
      resetTurnstile()

      if (res.ok) {
        setDraft(null)
        reset()
        toast({
          title: t("successTitle"),
          description: t("successDesc"),
          variant: "success",
        })
      } else {
        // Deliberately no error toast. The panel below says the same thing and
        // carries the way out of it; a red "something went wrong" on top of it
        // is alarming about a problem the visitor can already solve. The server
        // reason (CORS, rate limit, SMTP) is for the logs, not for them.
        offerMailFallback(data)
      }
    } catch {
      offerMailFallback(data)
    }
  }

  return (
    <div id="contact-form" className="bg-surface-raised rounded-2xl border border-border-subtle p-5 sm:p-7 md:p-9 scroll-mt-28">
      <h3 className="font-display font-bold text-xl text-content-strong mb-1">{t("formTitle")}</h3>
      <p className="text-xs text-content-muted mb-7">
        <span className="text-accent">*</span> {t("requiredFields")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Row: Name + Email */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              {t("fullName")} <span className="text-accent">*</span>
            </Label>
            <Input
              id="name"
              placeholder={t("fullNamePlaceholder")}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              className={cn(errors.name && "border-red-400 focus-visible:ring-red-400/20")}
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-red-500" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">
              {t("email")} <span className="text-accent">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className={cn(errors.email && "border-red-400 focus-visible:ring-red-400/20")}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-500" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Row: Phone + Subject */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+250 ..."
              autoComplete="tel"
              {...register("phone")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject">
              {t("subject")} <span className="text-accent">*</span>
            </Label>
            <Select
              key={selectedSubject || "empty"}
              defaultValue={selectedSubject || undefined}
              onValueChange={(val) =>
                setValue("subject", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="subject"
                aria-invalid={!!errors.subject}
                className={cn(errors.subject && "border-red-400")}
              >
                <SelectValue placeholder={t("selectTopic")} />
              </SelectTrigger>
              <SelectContent>
                {contactSubjects.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-xs text-red-500" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="message">
            {t("message")} <span className="text-accent">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder={t("messagePlaceholder")}
            rows={6}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
            className={cn(errors.message && "border-red-400 focus-visible:ring-red-400/20")}
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-red-500" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Honeypot — hidden from real users, catches bots */}
        <input
          type="text"
          name="_honey"
          defaultValue=""
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
          autoComplete="off"
        />

        {/* Captcha — renders only when a Turnstile site key is configured */}
        <TurnstileWidget />

        {/* Submit */}
        <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-4 flex-wrap">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full min-[480px]:w-auto min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t("sending")}
              </>
            ) : (
              <>
                {t("send")}
                <Send size={15} />
              </>
            )}
          </Button>
          <p className="text-xs text-content-muted max-w-[220px] leading-relaxed">
            {t("responseTime")}
          </p>
        </div>

        {/* Mail-client hand-off.
            Appears only when the send failed. A toast would carry the apology
            and then vanish with the message still stranded in the form, so this
            is inline and stays until it is used or dismissed. */}
        <AnimatePresence>
          {draft && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                role="group"
                aria-labelledby="mail-fallback-title"
                className="rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p
                      id="mail-fallback-title"
                      className="text-sm font-semibold text-content-strong"
                    >
                      {t("fallbackTitle")}
                    </p>
                    <p className="text-xs text-content-muted leading-relaxed mt-1">
                      {t("fallbackDesc")}
                    </p>
                    {isDraftTooLongForMailto(draft) && (
                      <p className="text-xs text-content leading-relaxed mt-2 font-medium">
                        {t("fallbackTooLong")}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {/* Resolves to whatever the device already uses for mail —
                          Gmail on Android, Mail on iOS, Outlook on most desks. */}
                      <Button asChild size="sm">
                        <a href={mailtoUrl(draft)}>
                          <Mail size={14} />
                          {t("fallbackMailApp")}
                        </a>
                      </Button>
                      {/* Named providers, for a desktop with no mail app set up. */}
                      <Button asChild size="sm" variant="outline-dark">
                        <a href={gmailUrl(draft)} target="_blank" rel="noopener noreferrer">
                          {t("fallbackGmail")}
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="outline-dark">
                        <a href={outlookUrl(draft)} target="_blank" rel="noopener noreferrer">
                          {t("fallbackOutlook")}
                        </a>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-dark"
                        onClick={copyDraft}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? t("fallbackCopied") : t("fallbackCopy")}
                      </Button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDraft(null)}
                    aria-label={t("fallbackDismiss")}
                    className="shrink-0 rounded p-1 text-content-muted hover:text-content-strong
                      hover:bg-content/8 transition-colors"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
