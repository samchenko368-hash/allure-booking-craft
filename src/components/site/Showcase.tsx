import { useQuery } from "@tanstack/react-query";
import { contentQuery, sectionOf, showcaseQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";

export function Showcase() {
  const { tr } = useI18n();
  const { data: content } = useQuery(contentQuery);
  const { data: items } = useQuery(showcaseQuery);
  const section = sectionOf(content, "showcase_intro");
  if (section && !section.is_visible) return null;
  const c = (section?.content ?? {}) as { heading?: Localized; subheading?: Localized };
  const visible = (items ?? []).filter((i) => i.is_visible);
  if (visible.length === 0) return null;

  return (
    <section id="showcase" className="section-shell">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl">{tr(c.heading)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tr(c.subheading)}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {visible.map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <figure className="group relative overflow-hidden rounded-3xl shadow-luxe">
                {item.video_url ? (
                  <video
                    src={item.video_url}
                    poster={item.poster_url ?? undefined}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  item.poster_url && (
                    <img
                      src={item.poster_url}
                      alt={tr(item.title, "Showcase")}
                      loading="lazy"
                      className="h-80 w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                  )
                )}
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                  <p className="font-display text-2xl">{tr(item.title)}</p>
                  <p className="text-sm text-muted-foreground">{tr(item.caption)}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
