import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Navigation,
  Scissors,
  Settings,
  SquarePen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/useRoles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Pulpit", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Rezerwacje", icon: CalendarCheck },
  { to: "/admin/leads", label: "Leady z czatu", icon: MessageSquare },
  { to: "/admin/content", label: "Sekcje strony", icon: SquarePen },
  { to: "/admin/services", label: "Usługi", icon: Scissors },
  { to: "/admin/media", label: "Media", icon: Images },
  { to: "/admin/navigation", label: "Nawigacja", icon: Navigation },
  { to: "/admin/settings", label: "Ustawienia", icon: Settings },
] as const;

function AdminLayout() {
  const { session, ready, isStaff } = useRoles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!ready) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center text-muted-foreground">
        Ładowanie…
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
        <div className="glass-panel max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl">Brak uprawnień</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Konto {session?.user.email} nie ma dostępu do panelu. Poproś administratora o nadanie roli.
          </p>
          <Button variant="outline" className="mt-5" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Wyloguj
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="glass-panel h-fit rounded-3xl p-4 lg:sticky lg:top-6 lg:w-64">
          <p className="px-3 pb-3 font-display text-xl tracking-[0.2em] uppercase">LUXE</p>
          <nav className="grid gap-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 grid gap-1 border-t border-border/60 pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" /> Zobacz stronę
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> Wyloguj
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
