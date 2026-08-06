import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const t = useTranslations("common")

  return (
    <section
      className="min-h-[calc(100vh-var(--navbar-height))] bg-surface flex items-center justify-center"
      aria-label={t("notFoundTitle")}
    >
      <div className="container py-20 flex flex-col items-center text-center max-w-lg">
        <div
          className="font-display font-extrabold text-content-strong select-none pointer-events-none mb-[-1.5rem]"
          style={{ fontSize: "clamp(6rem, 20vw, 10rem)", opacity: 0.07, lineHeight: 1 }}
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="font-display font-bold text-3xl text-content-strong mb-4">{t("notFoundTitle")}</h1>
        <p className="text-content-muted leading-relaxed mb-10">
          {t("notFoundDesc")}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button asChild size="lg">
            <Link href="/">{t("goHome")}</Link>
          </Button>
          <Button asChild variant="outline-dark" size="lg">
            <Link href="/contact">{t("contactUs")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
