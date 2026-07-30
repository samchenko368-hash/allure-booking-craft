import { useQuery } from "@tanstack/react-query";
import { Clock, Gem, Shield, Sparkles } from "lucide-react";
import { contentQuery, sectionOf } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";

const ICONS: Record<string, typeof Sparkles> = { sparkles: Sparkles, shield: Shield, gem: Gem, clock: Clock };

export function WhyUs() {
  const { tr } = useI18n();
  const { data } = useQuery(contentQuery);
  const section = sectionOf(data, "why_us");
  if (section && !section.is_visible) return null;

  const c = (section?.content ?? {}) as {
    heading?: Localized;
    items?: { icon: string; title: Localized; text: Localized }[];
  };

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-display text-4xl md:text-5xl">{tr(c.heading)}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(c.items ?? []).map((item, i) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <Reveal key={i} delay={i * 90}>
                <div className="glass-panel h-full rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                    <Icon className="h-6 w-6 text-primary" />
                  </span>
                  <h3 className="mt-5 font-display text-xl">{tr(item.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{tr(item.text)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
