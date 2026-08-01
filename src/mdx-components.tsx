import type { MDXComponents } from "mdx/types"

/**
 * Styling for MDX content (the legal pages).
 *
 * Required by @next/mdx in the App Router. Mapping the elements here means the
 * .mdx files stay plain prose — no classNames, no JSX — so they can be edited
 * by someone who does not write React.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="font-display font-bold text-xl text-navy mt-10 mb-3 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-semibold text-base text-navy mt-6 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-sm text-brand-gray leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="flex flex-col gap-2 mb-4 pl-5 list-disc marker:text-accent">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="flex flex-col gap-2 mb-4 pl-5 list-decimal marker:text-accent">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-sm text-brand-gray leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-dark">{children}</strong>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-accent hover:underline">
        {children}
      </a>
    ),
    hr: () => <hr className="my-8 border-brand-gray-light" />,
    ...components,
  }
}
