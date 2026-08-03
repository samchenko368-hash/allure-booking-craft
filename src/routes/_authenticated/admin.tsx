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
  Users,
  Settings,
  SquarePen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/useRoles";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV: { to: string; labelKey: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", labelKey: "admin.bookings", icon: CalendarCheck },
  { to: "/admin/leads", labelKey: "admin.chatLeads", icon: MessageSquare },
  { to: "/admin/content", labelKey: "admin.sections", icon: SquarePen },
  { to: "/admin/services", labelKey: "admin.services", icon: Scissors },
  { to: "/admin/staff", labelKey: "admin.staff", icon: Users },
  { to: "/admin/media", labelKey: "admin.media", icon: Images },
  { to: "/admin/navigation", labelKey: "admin.navigation", icon: Navigation },
  { to: "/admin/settings", labelKey: "admin.settings", icon: Settings },
];

function AdminLayout() {
  const { session, ready, isStaff } = useRoles();
  const { t } = useI18n();
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
        {t("common.loading")}
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
        <div className="glass-panel max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl">{t("admin.noAccess")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {session?.user.email} — {t("admin.noAccessDesc")}
          </p>
          <Button variant="outline" className="mt-5" onClick={signOut}>
            <LogOut className="h-4 w-4" /> {t("admin.signOut")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="glass-panel h-fit rounded-3xl p-4 lg:sticky lg:top-6 lg:w-64">
          <div className="flex items-center justify-between gap-2 px-3 pb-3">
            <p className="font-display text-xl tracking-[0.2em] uppercase">LUXE</p>
            <LanguageSwitcher variant="outline" />
          </div>
          <nav className="grid gap-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to as never}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 grid gap-1 border-t border-border/60 pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" /> {t("admin.viewSite")}
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> {t("admin.signOut")}
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
