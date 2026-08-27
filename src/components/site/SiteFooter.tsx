import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { contentQuery, sectionOf, settingsQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Localized } from "@/types/cms";

export function SiteFooter() {
  const { t, tr } = useI18n();
  const { data: content } = useQuery(contentQuery);
  const { data: settings } = useQuery(settingsQuery);

  const section = sectionOf(content, "footer");
  if (section && !section.is_visible) return null;

  const data = (section?.content ?? {}) as { about?: Localized; copyright?: Localized };
  const contacts = (settings?.contacts ?? {}) as Record<string, string>;
  const social = (settings?.social ?? {}) as Record<string, string>;
  const hours = (settings?.hours ?? {}) as Record<string, string>;
  const general = (settings?.general ?? {}) as Record<string, string>;

  return (
    <footer id="contact" className="relative z-10 border-t border-border/60 bg-card/80 text-white backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl tracking-[0.2em] uppercase">
            {(general.salon_name ?? "LUXE").split(" ")[0]}
          </p>
          <p className="mt-3 text-sm text-white/90">{tr(data.about)}</p>
          <div className="mt-4 flex gap-3">
            {social.instagram && (
              <a href={social.instagram} aria-label="Instagram" className="text-white/90 transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} aria-label="Facebook" className="text-white/90 transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase">{t("footer.contact")}</h3>
          <ul className="grid gap-3 text-sm text-white/90">
            {contacts.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${contacts.phone.replace(/\s/g, "")}`}>{contacts.phone}</a>
              </li>
            )}
            {contacts.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </li>
            )}
            {contacts.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{contacts.address}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase">{t("footer.hours")}</h3>
          <ul className="grid gap-3 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {t("footer.monfri")}: {hours.mon_fri}
            </li>
            <li>{t("footer.sat")}: {hours.sat}</li>
            <li>{t("footer.sun")}: {hours.sun}</li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60">
          {contacts.map_embed && (
            <iframe
              title="map"
              src={contacts.map_embed}
              className="h-48 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>

      <div className="border-t border-border/60 px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-white/90">
          <span>
            © {new Date().getFullYear()} {general.salon_name}. {tr(data.copyright)}
          </span>
          <Link to="/admin" className="transition-colors hover:text-primary">
            {t("nav.admin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
