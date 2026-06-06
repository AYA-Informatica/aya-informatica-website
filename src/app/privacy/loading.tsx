"use client"

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-brand-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5" aria-label="Loading" role="status">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-accent animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <p className="text-xs text-brand-gray uppercase tracking-widest">Loading</p>
      </div>
    </div>
  )
}
