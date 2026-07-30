import { useEffect, useState } from "react";

/**
 * Fixed, looping, muted background video that sits behind the whole page.
 * Content scrolls over it. Falls back to a static gradient when the user
 * prefers reduced motion or the video cannot play.
 */
export function BackgroundVideo({ src, poster }: { src?: string; poster?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    setEnabled(!reduced && !connection?.saveData && Boolean(src));
  }, [src]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {enabled && src ? (
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: poster
              ? `url(${poster})`
              : "linear-gradient(140deg, oklch(0.9 0.06 315), oklch(0.96 0.02 300))",
          }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-veil)" }}
      />
    </div>
  );
}
