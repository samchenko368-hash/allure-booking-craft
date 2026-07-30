import { useQuery } from "@tanstack/react-query";
import { contentQuery, galleryQuery, sectionOf } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";

export function Gallery() {
  const { tr } = useI18n();
  const { data: content } = useQuery(contentQuery);
  const { data: items } = useQuery(galleryQuery);
  const section = sectionOf(content, "gallery_intro");
  if (section && !section.is_visible) return null;
  const c = (section?.content ?? {}) as { heading?: Localized; subheading?: Localized };
  const visible = (items ?? []).filter((i) => i.is_visible);

  return (
    <section id="gallery" className="section-shell">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl">{tr(c.heading)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tr(c.subheading)}</p>
          </div>
        </Reveal>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {visible.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 90}>
              <figure className="group relative overflow-hidden rounded-3xl">
                <img
                  src={item.media_url}
                  alt={tr(item.caption, "Gallery")}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-5 text-sm transition-transform duration-500 group-hover:translate-y-0">
                  {tr(item.caption)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
