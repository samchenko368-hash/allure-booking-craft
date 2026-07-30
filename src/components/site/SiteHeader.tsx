import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationQuery, settingsQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useBooking } from "./BookingProvider";

export function SiteHeader() {
  const { t, tr } = useI18n();
  const { data: nav } = useQuery(navigationQuery);
  const { data: settings } = useQuery(settingsQuery);
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const salonName = (settings?.general as { salon_name?: string })?.salon_name ?? "LUXE";
  const items = (nav ?? []).filter((i) => i.location === "header" && i.is_visible);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel py-2" : "py-5",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link to="/" className="font-display text-2xl tracking-[0.2em] uppercase">
          {salonName.split(" ")[0]}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="relative text-sm tracking-wide text-foreground/80 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              {tr(item.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="hero" size="lg" className="hidden md:inline-flex" onClick={() => open()}>
            {t("nav.book")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("nav.menu")}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass-panel mx-4 mt-3 rounded-2xl p-5 md:hidden">
          <div className="mb-3 flex justify-end">
            <Button variant="ghost" size="icon" aria-label={t("common.close")} onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="grid gap-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl"
              >
                {tr(item.label)}
              </a>
            ))}
          </nav>
          <Button
            variant="hero"
            size="lg"
            className="mt-5 w-full"
            onClick={() => {
              setMobileOpen(false);
              open();
            }}
          >
            {t("nav.book")}
          </Button>
        </div>
      )}
    </header>
  );
}
