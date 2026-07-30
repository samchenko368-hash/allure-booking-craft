import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, MessageSquare, Scissors, SquarePen } from "lucide-react";
import { bookingsQuery, chatLeadsQuery, contentQuery, servicesQuery } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: bookings } = useQuery(bookingsQuery);
  const { data: leads } = useQuery(chatLeadsQuery);
  const { data: services } = useQuery(servicesQuery);
  const { data: content } = useQuery(contentQuery);

  const newBookings = (bookings ?? []).filter((b) => b.status === "new").length;
  const cards = [
    { label: "Nowe rezerwacje", value: newBookings, icon: CalendarCheck, to: "/admin/bookings" },
    { label: "Rezerwacje razem", value: bookings?.length ?? 0, icon: CalendarCheck, to: "/admin/bookings" },
    { label: "Leady z czatu", value: leads?.length ?? 0, icon: MessageSquare, to: "/admin/leads" },
    { label: "Aktywne usługi", value: (services ?? []).filter((s) => s.is_active).length, icon: Scissors, to: "/admin/services" },
    { label: "Sekcje strony", value: content?.length ?? 0, icon: SquarePen, to: "/admin/content" },
  ] as const;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl">Pulpit</h1>
        <p className="text-muted-foreground">Przegląd salonu i najnowsze zgłoszenia.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="glass-panel rounded-3xl p-6 transition-transform hover:-translate-y-1">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 font-display text-4xl text-gradient">{c.value}</p>
            <p className="text-xs tracking-widest uppercase text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-2xl">Ostatnie rezerwacje</h2>
        <ul className="mt-4 grid gap-3">
          {(bookings ?? []).slice(0, 6).map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/60 px-4 py-3 text-sm">
              <span className="font-medium">{b.name}</span>
              <span className="text-muted-foreground">{b.phone}</span>
              <span className="text-muted-foreground">{b.service_label ?? "—"}</span>
              <span className="text-muted-foreground">{b.preferred_date ?? "—"} {b.preferred_time ?? ""}</span>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">{b.status}</span>
            </li>
          ))}
          {(bookings ?? []).length === 0 && <li className="text-sm text-muted-foreground">Brak zgłoszeń.</li>}
        </ul>
      </section>
    </div>
  );
}
