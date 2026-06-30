"use client"

import { useEffect } from "react"
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
import { CONTACT_SUBJECTS } from "@/lib/constants"
import { useToastStore } from "@/store/toast"
import { cn } from "@/lib/utils"

type SubmitStatus = "idle" | "loading" | "error"

export function ContactForm() {
  const { toast } = useToastStore()
  const searchParams = useSearchParams()

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

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        reset()
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible. Let's build together.",
          variant: "success",
        })
      } else {
        const body = await res.json().catch(() => ({}))
        toast({
          title: "Something went wrong",
          description: body?.error ?? "Please email us directly at ay.company.andy@gmail.com",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection or email us directly.",
        variant: "destructive",
      })
    }
  }

  return (
    <div id="contact-form" className="bg-white rounded-2xl border border-brand-gray-light p-5 sm:p-7 md:p-9 scroll-mt-28">
      <h3 className="font-display font-bold text-xl text-navy mb-1">Send Us a Message</h3>
      <p className="text-xs text-brand-gray mb-7">
        <span className="text-accent">*</span> Required fields
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Row: Name + Email */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Full Name <span className="text-accent">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Your full name"
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
              Email Address <span className="text-accent">*</span>
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
            <Label htmlFor="phone">Phone (Optional)</Label>
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
              Subject <span className="text-accent">*</span>
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
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_SUBJECTS.map((s) => (
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
            Message <span className="text-accent">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about yourself and how we can help…"
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
                Sending…
              </>
            ) : (
              <>
                Send Message
                <Send size={15} />
              </>
            )}
          </Button>
          <p className="text-xs text-brand-gray max-w-[220px] leading-relaxed">
            We typically respond within 24 hours.
          </p>
        </div>
      </form>
    </div>
  )
}
