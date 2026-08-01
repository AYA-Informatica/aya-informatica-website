"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Send } from "lucide-react"
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
        reset()
        toast({
          title: t("successTitle"),
          description: t("successDesc"),
          variant: "success",
        })
      } else {
        const body = await res.json().catch(() => ({}))
        toast({
          title: t("errorTitle"),
          description: body?.error ?? t("errorFallbackDesc"),
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: t("networkErrorTitle"),
        description: t("networkErrorDesc"),
        variant: "destructive",
      })
    }
  }

  return (
    <div id="contact-form" className="bg-white rounded-2xl border border-brand-gray-light p-5 sm:p-7 md:p-9 scroll-mt-28">
      <h3 className="font-display font-bold text-xl text-navy mb-1">{t("formTitle")}</h3>
      <p className="text-xs text-brand-gray mb-7">
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
          <p className="text-xs text-brand-gray max-w-[220px] leading-relaxed">
            {t("responseTime")}
          </p>
        </div>
      </form>
    </div>
  )
}
