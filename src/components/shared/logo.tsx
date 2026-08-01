import Image from "next/image"
import logoNavy from "../../../public/logo.png"
import logoWhite from "../../../public/logo-white.png"
import { cn } from "@/lib/utils"

/**
 * The company wordmark.
 *
 * The site previously drew an approximation of the logo in CSS text — "AYA"
 * over "Informatica" in the display face — which meant the real mark was only
 * ever seen as a browser tab icon. This renders the actual artwork.
 *
 * Two variants exist because the artwork is navy on transparent, which would be
 * invisible on the navy surfaces: `logo-white.png` is a white silhouette built
 * from the same alpha mask. Both are trimmed of their padding so they read at
 * navbar sizes (472x296, a 1.6:1 lockup).
 *
 * These are NOT derived from the current favicon and should not be regenerated
 * from it. The app icons are a circular badge — an off-white disc with the mark
 * inside — which suits a home-screen icon but is the wrong shape for a header,
 * and whose alpha mask covers the whole disc, so the white-silhouette technique
 * would produce a solid circle. Regenerate these from a bare-wordmark export
 * only.
 *
 * Statically imported so Next supplies the intrinsic dimensions and reserves
 * layout space, avoiding a shift while the image loads.
 */
export function Logo({
  variant = "navy",
  className,
  priority = false,
  alt = "AYA Informatica RW",
}: {
  /** `white` for navy surfaces, `navy` for light ones. */
  variant?: "navy" | "white"
  className?: string
  /** Set on the header instance — it is usually the LCP element. */
  priority?: boolean
  alt?: string
}) {
  return (
    <Image
      src={variant === "white" ? logoWhite : logoNavy}
      alt={alt}
      priority={priority}
      // Width is derived from the intrinsic aspect ratio; only height is set.
      className={cn("w-auto object-contain", className)}
      // No `sizes`: this renders at a fixed height, so Next's default 1x/2x
      // srcset is correct. A `sizes` value larger than the real display width
      // would make the browser fetch a bigger candidate than it needs.
    />
  )
}
