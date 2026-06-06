import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "404 – Page Not Found",
}

export default function NotFound() {
  return (
    <section
      className="min-h-[calc(100vh-72px)] bg-brand-bg flex items-center justify-center"
      aria-label="Page not found"
    >
      <div className="container py-20 flex flex-col items-center text-center max-w-lg">
        <div
          className="font-display font-extrabold text-navy select-none pointer-events-none mb-[-1.5rem]"
          style={{ fontSize: "clamp(6rem, 20vw, 10rem)", opacity: 0.07, lineHeight: 1 }}
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="font-display font-bold text-3xl text-navy mb-4">Page Not Found</h1>
        <p className="text-brand-gray leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline-dark" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
