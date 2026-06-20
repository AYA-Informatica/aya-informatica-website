"use client"

import { CONTACT_SUBJECTS } from "@/lib/constants"

export function TopicTags() {
  const handleClick = (value: string) => {
    const form = document.getElementById("contact-form")
    if (form) form.scrollIntoView({ behavior: "smooth" })

    window.dispatchEvent(
      new CustomEvent("select-subject", { detail: value })
    )
  }

  return (
    <div>
      <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-brand-gray mb-3">
        What can we help with?
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {CONTACT_SUBJECTS.map((subject) => (
          <button
            key={subject.value}
            type="button"
            onClick={() => handleClick(subject.value)}
            className="text-[0.75rem] font-medium text-navy bg-white border border-brand-gray-light px-3 py-1 rounded-full hover:border-accent hover:bg-accent/5 hover:text-accent transition-colors cursor-pointer"
          >
            {subject.label}
          </button>
        ))}
      </div>
    </div>
  )
}
