import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contentQuery, sectionOf } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";
import { useBooking } from "./BookingProvider";

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
    <section className="relative z-10 flex min-h-[92vh] items-center px-5 pt-32 pb-20">
      <div className="mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs tracking-[0.2em] uppercase">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {tr(c.badge, "Beauty atelier")}
          </span>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-8 font-display text-5xl leading-[1.05] text-balance sm:text-6xl md:text-7xl">
            <span className="text-gradient">{tr(c.heading, "Beauty you will remember")}</span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            {tr(c.subheading)}
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
