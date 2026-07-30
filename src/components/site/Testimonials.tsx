import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { contentQuery, sectionOf, testimonialsQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const { tr } = useI18n();
  const { data: content } = useQuery(contentQuery);
  const { data: items } = useQuery(testimonialsQuery);
  const section = sectionOf(content, "testimonials_intro");
  if (section && !section.is_visible) return null;
  const c = (section?.content ?? {}) as { heading?: Localized; subheading?: Localized };
  const visible = (items ?? []).filter((i) => i.is_visible);

  return (
    <section id="testimonials" className="section-shell">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl">{tr(c.heading)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tr(c.subheading)}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {visible.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <blockquote className="glass-panel h-full rounded-3xl p-7">
                <div className="flex gap-1">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-pretty text-muted-foreground">“{tr(item.text)}”</p>
                <footer className="mt-6">
                  <p className="font-display text-lg">{item.author}</p>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">
                    {tr(item.service_type)}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
