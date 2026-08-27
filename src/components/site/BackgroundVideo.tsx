import { useEffect, useRef, useState } from "react";

const PLAYBACK_RATE = 0.86;
const CROSSFADE_MS = 1100;

/**
 * A single fixed, muted background video for the entire page.
 * Two synchronized elements cross-fade at the end of the clip, keeping the
 * transition unobtrusive while visitors scroll the site content above it.
 */
export function BackgroundVideo({ src, poster }: { src?: string; poster?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const firstVideo = useRef<HTMLVideoElement>(null);
  const secondVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    setEnabled(!reducedMotion && !connection?.saveData && Boolean(src));
  }, [src]);

  useEffect(() => {
    if (!enabled) return;

    const videos = [firstVideo.current, secondVideo.current].filter(
      (video): video is HTMLVideoElement => Boolean(video),
    );
    if (videos.length !== 2) return;

    let currentVideo = 0;
    let isCrossfading = false;
    let resetTimer: ReturnType<typeof window.setTimeout> | undefined;

    const play = (video: HTMLVideoElement) => {
      video.muted = true;
      video.playbackRate = PLAYBACK_RATE;
      void video.play().catch(() => undefined);
    };

    const beginCrossfade = (from: HTMLVideoElement) => {
      if (isCrossfading || from !== videos[currentVideo]) return;
      if (!Number.isFinite(from.duration) || from.duration - from.currentTime > 1.25) return;

      isCrossfading = true;
      const nextVideo = 1 - currentVideo;
      const to = videos[nextVideo];
      to.currentTime = 0;
      play(to);
      currentVideo = nextVideo;
      setActiveVideo(nextVideo);

      resetTimer = window.setTimeout(() => {
        from.pause();
        from.currentTime = 0;
        isCrossfading = false;
      }, CROSSFADE_MS);
    };

    const onTimeUpdate = (event: Event) => beginCrossfade(event.currentTarget as HTMLVideoElement);
    videos.forEach((video) => video.addEventListener("timeupdate", onTimeUpdate));
    play(videos[0]);

    return () => {
      if (resetTimer) window.clearTimeout(resetTimer);
      videos.forEach((video) => {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.pause();
      });
    };
  }, [enabled]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b0612]" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-[position:65%_center]"
        style={{
          backgroundImage: poster
            ? `url(${poster})`
            : "linear-gradient(140deg, oklch(0.18 0.05 300), oklch(0.08 0.025 300))",
        }}
      />
      {enabled && src && [firstVideo, secondVideo].map((reference, index) => (
        <video
          key={index}
          ref={reference}
          className={`absolute inset-0 h-full w-full object-cover object-[65%_center] transition-opacity duration-1000 ease-in-out ${
            activeVideo === index ? "opacity-100" : "opacity-0"
          }`}
          poster={poster}
          muted
          playsInline
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
      <div className="absolute inset-0 bg-[#0b0612]/55" />
    </div>
  );
}
