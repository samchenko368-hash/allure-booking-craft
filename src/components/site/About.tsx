import { useQuery } from "@tanstack/react-query";
import { contentQuery, sectionOf } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";

interface Stat {
  value: string;
  label: Localized;
}

export function About() {
  const { tr } = useI18n();
  const { data } = useQuery(contentQuery);
  const section = sectionOf(data, "about");
  if (section && !section.is_visible) return null;

  const c = (section?.content ?? {}) as {
    heading?: Localized;
    body?: Localized;
    image?: string;
    stats?: Stat[];
  };

  return (
    <section id="about" className="section-shell">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden rounded-3xl shadow-luxe">
            {c.image && (
              <img
                src={c.image}
                alt={tr(c.heading, "Salon interior")}
                loading="lazy"
                width={1536}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
              />
            )}
          </div>
        </Reveal>

        <div>
          <Reveal delay={100}>
            <h2 className="font-display text-4xl md:text-5xl">{tr(c.heading)}</h2>
            <p className="mt-5 text-lg text-muted-foreground text-pretty">{tr(c.body)}</p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {(c.stats ?? []).map((stat, i) => (
              <Reveal key={stat.value + i} delay={200 + i * 90}>
                <div className="glass-panel rounded-2xl p-5">
                  <p className="font-display text-4xl text-gradient">{stat.value}</p>
                  <p className="mt-1 text-xs tracking-widest uppercase text-muted-foreground">
                    {tr(stat.label)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
