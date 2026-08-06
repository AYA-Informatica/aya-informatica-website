"use client"

import { useTranslations } from "next-intl"
import { useContactSubjects } from "@/lib/content"

export function TopicTags() {
  const t = useTranslations("contact")
  const contactSubjects = useContactSubjects()

  const handleClick = (value: string) => {
    const form = document.getElementById("contact-form")
    if (form) form.scrollIntoView({ behavior: "smooth" })

    window.dispatchEvent(
      new CustomEvent("select-subject", { detail: value })
    )
  }

  return (
    <div>
      <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-content-muted mb-3">
        {t("topicTagsTitle")}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {contactSubjects.map((subject) => (
          <button
            key={subject.value}
            type="button"
            onClick={() => handleClick(subject.value)}
            className="text-[0.75rem] font-medium text-content-strong bg-surface-raised border border-border-subtle px-3 py-1 rounded-full hover:border-accent hover:bg-accent/5 hover:text-accent transition-colors cursor-pointer"
          >
            {subject.label}
          </button>
        ))}
      </div>
    </div>
  )
}
