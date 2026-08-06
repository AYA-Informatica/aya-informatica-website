import { useProducts } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * The right half of the hero.
 *
 * It exists for two reasons. The obvious one is that the hero was a two-column
 * space with content in one column, so half of the most valuable screen on the
 * site was an empty grid pattern. The other is that the page opened with copy
 * that could belong to any software company; this puts the actual products —
 * their real names, taglines and shipping status — above the fold, so the first
 * thing a visitor sees is what AYA has built rather than what it claims.
 *
 * Every string comes from the existing `content.products` catalogue, so this
 * adds no message keys and stays translated in all three locales.
 *
 * Hidden below `lg`. On a phone the hero is already a full screen of headline
 * and CTAs, and stacking this under it would push the buttons out of view.
 */
export function HeroVisual() {
  const products = useProducts()

  return (
    <div className="relative hidden lg:block" aria-hidden="true">
      {/* The spine the cards hang off. Reads as one system rather than two
          unrelated cards, which is the ecosystem claim the copy makes. It is
          kept tight against them — set further out it stops looking attached
          to anything and just reads as a stray rule. */}
      <div className="absolute left-[5px] top-8 bottom-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      <div className="flex flex-col gap-4">
        {products.map((product, i) => {
          const live = product.status === "active"
          return (
            <div key={product.id} className="flex items-start gap-5">
              {/* Node on the spine. The live product is marked with the accent
                  and a pulse; the upcoming one is a hollow ring. */}
              <div className="relative z-10 shrink-0 mt-8 flex items-center justify-center w-[11px]">
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full ring-4 ring-surface-inverse",
                    live ? "bg-accent-on-inverse animate-pulse-dot" : "border border-white/40"
                  )}
                />
              </div>

              <div
                className={cn(
                  "flex-1 rounded-2xl border p-5 backdrop-blur-sm",
                  // The shipping product carries more weight than the one that
                  // has not launched — the same hierarchy the copy implies.
                  live
                    ? "bg-white/8 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                    : "bg-white/4 border-white/10",
                  // A slight stagger, so it reads as a composition rather than
                  // a list. Small enough not to look accidental.
                  i % 2 === 1 && "ml-5"
                )}
              >
                {/* Eyebrow above the name rather than a pill beside it. As a
                    pill the status was as wide as the product name and won the
                    eye; this is also the eyebrow/title/description order the
                    section headers use everywhere else on the site. */}
                <span
                  className={cn(
                    "block text-[0.6rem] font-semibold uppercase tracking-[0.14em] mb-1.5",
                    live ? "text-accent-on-inverse" : "text-white/55"
                  )}
                >
                  {product.badge}
                </span>
                <span className="block font-display font-bold text-lg text-white mb-1">
                  {product.name}
                </span>
                <p className="text-sm text-white/65 leading-relaxed">{product.tagline}</p>
              </div>
            </div>
          )
        })}

        {/* The spine runs on past the last product. The ecosystem is described
            as unfinished on every other page; saying so here keeps them level. */}
        <div className="flex items-center gap-5">
          <div className="relative z-10 shrink-0 flex items-center justify-center w-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white/25 ring-4 ring-surface-inverse" />
          </div>
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
            {"— — —"}
          </span>
        </div>
      </div>
    </div>
  )
}
