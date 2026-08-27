import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contentQuery, sectionOf } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";
import { useBooking } from "./BookingProvider";

const HERO_VIDEO = "/media/orchid-petals-hero.mp4";
const HERO_POSTER = "/media/orchid-petals-hero-poster.jpg";
const CROSSFADE_MS = 1100;

function HeroVideoBackground() {
  const firstVideo = useRef<HTMLVideoElement>(null);
  const secondVideo = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const videos = [firstVideo.current, secondVideo.current].filter(
      (video): video is HTMLVideoElement => Boolean(video),
    );
    if (videos.length !== 2) return;

    let currentVideo = 0;
    let isCrossfading = false;
    let resetTimer: ReturnType<typeof window.setTimeout> | undefined;

    const play = (video: HTMLVideoElement) => {
      video.muted = true;
      video.playbackRate = 0.86;
      void video.play().catch(() => undefined);
    };

    const startCrossfade = (from: HTMLVideoElement) => {
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

    const onTimeUpdate = (event: Event) => startCrossfade(event.currentTarget as HTMLVideoElement);
    videos.forEach((video) => video.addEventListener("timeupdate", onTimeUpdate));
    play(videos[0]);

    return () => {
      if (resetTimer) window.clearTimeout(resetTimer);
      videos.forEach((video) => {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.pause();
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#120c19]" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-[position:65%_center] motion-reduce:bg-[position:65%_center]"
        style={{ backgroundImage: `url(${HERO_POSTER})` }}
      />
      {[firstVideo, secondVideo].map((reference, index) => (
        <video
          key={index}
          ref={reference}
          className={`absolute inset-0 h-full w-full object-cover object-[65%_center] transition-opacity duration-1000 ease-in-out motion-reduce:hidden ${
            activeVideo === index ? "opacity-100" : "opacity-0"
          }`}
          poster={HERO_POSTER}
          muted
          playsInline
          preload="metadata"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ))}
      <div className="absolute inset-0 bg-black/55 md:bg-[linear-gradient(90deg,rgba(13,8,19,0.9)_0%,rgba(13,8,19,0.76)_40%,rgba(13,8,19,0.36)_66%,rgba(13,8,19,0.2)_100%)]" />
    </div>
  );
}

export function Hero({ onChat }: { onChat: () => void }) {
  const { tr } = useI18n();
  const { data } = useQuery(contentQuery);
  const { open } = useBooking();
  const section = sectionOf(data, "hero");
  if (section && !section.is_visible) return null;

  const c = (section?.content ?? {}) as {
    badge?: Localized;
    heading?: Localized;
    subheading?: Localized;
    primary_cta?: Localized;
    secondary_cta?: Localized;
  };

  return (
    <section className="relative isolate z-10 flex min-h-[92vh] items-center overflow-hidden px-5 pb-20 pt-32">
      <HeroVideoBackground />
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center md:mx-0 md:max-w-2xl md:text-left lg:ml-[max(2rem,calc((100vw-80rem)/2))]">
        <Reveal>
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs tracking-[0.2em] uppercase text-foreground shadow-lg shadow-black/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {tr(c.badge, "Beauty atelier")}
          </span>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-8 font-display text-5xl leading-[1.05] text-balance drop-shadow-[0_3px_16px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl">
            <span className="text-gradient">{tr(c.heading, "Beauty you will remember")}</span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/95 text-pretty drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] md:mx-0">
            {tr(c.subheading)}
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
            <Button variant="hero" size="xl" onClick={() => open()}>
              {tr(c.primary_cta, "Book now")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="xl" onClick={onChat}>
              <MessageCircle className="h-4 w-4" />
              {tr(c.secondary_cta, "Chat with us")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
