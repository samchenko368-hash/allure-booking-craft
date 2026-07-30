import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categoriesQuery, contentQuery, sectionOf, servicesQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Localized, Service } from "@/types/cms";
import { Reveal } from "./Reveal";
import { useBooking } from "./BookingProvider";

export function Services() {
  const { t, tr } = useI18n();
  const { data: content } = useQuery(contentQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: services } = useQuery(servicesQuery);
  const { open } = useBooking();
  const [active, setActive] = useState<string>("all");
  const [detail, setDetail] = useState<Service | null>(null);

  const section = sectionOf(content, "services_intro");
  if (section && !section.is_visible) return null;
  const c = (section?.content ?? {}) as { heading?: Localized; subheading?: Localized };

  const visible = (services ?? []).filter(
    (s) => s.is_active && (active === "all" || s.category_id === active),
  );

  return (
    <section id="services" className="section-shell">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl">{tr(c.heading)}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tr(c.subheading)}</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActive("all")}
              className={cn(
                "rounded-full border border-border px-5 py-2 text-sm transition-all",
                active === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent",
              )}
            >
              {t("common.all")}
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={cn(
                  "rounded-full border border-border px-5 py-2 text-sm transition-all",
                  active === cat.id ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                )}
              >
                {tr(cat.name)}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service, i) => (
            <Reveal key={service.id} delay={i * 70}>
              <article className="group glass-panel h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe">
                {service.image_url && (
                  <div className="h-52 overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={tr(service.name)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-2xl">{tr(service.name)}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {tr(service.description)}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    {service.duration_min && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        {service.duration_min} {t("common.min")}
                      </span>
                    )}
                    {service.price_from && (
                      <span className="inline-flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-primary" />
                        {t("common.from")} {Number(service.price_from)} {service.currency}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button variant="hero" className="flex-1" onClick={() => open({ serviceLabel: tr(service.name), source: "service_card_cta" })}>
                      {t("nav.book")}
                    </Button>
                    <Button variant="outline" onClick={() => setDetail(service)}>
                      {t("common.details")}
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">{detail && tr(detail.name)}</DialogTitle>
          </DialogHeader>
          {detail?.image_url && (
            <img
              src={detail.image_url}
              alt={tr(detail.name)}
              className="h-56 w-full rounded-2xl object-cover"
            />
          )}
          <p className="text-muted-foreground">{detail && tr(detail.description)}</p>
          <div className="flex gap-4 text-sm">
            {detail?.duration_min && (
              <span>
                {detail.duration_min} {t("common.min")}
              </span>
            )}
            {detail?.price_from && (
              <span>
                {t("common.from")} {Number(detail.price_from)} {detail.currency}
              </span>
            )}
          </div>
          <Button
            variant="hero"
            size="lg"
            onClick={() => {
              open({ serviceLabel: detail ? tr(detail.name) : undefined, source: "service_card_cta" });
              setDetail(null);
            }}
          >
            {t("nav.book")}
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
