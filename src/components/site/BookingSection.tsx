import { useQuery } from "@tanstack/react-query";
import { contentQuery, sectionOf } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";
import { Reveal } from "./Reveal";
import { BookingForm } from "./BookingForm";

export function BookingSection() {
  const { tr } = useI18n();
  const { data } = useQuery(contentQuery);
  const section = sectionOf(data, "booking_cta");
  if (section && !section.is_visible) return null;
  const c = (section?.content ?? {}) as { heading?: Localized; subheading?: Localized };

  return (
    <section id="booking" className="section-shell">
      <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-2">
        <Reveal>
          <div className="md:sticky md:top-32">
            <h2 className="font-display text-4xl md:text-5xl">
              <span className="text-gradient">{tr(c.heading)}</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">{tr(c.subheading)}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <BookingForm source="website_form" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
