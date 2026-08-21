import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "manager" | "staff";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useRoles() {
  const { session, loading } = useSession();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      setRoles([]);
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const db = supabase as any;
      const { data } = await db.from("user_roles").select("role").eq("user_id", session.user.id);

      if (!cancelled) {
        setRoles(((data ?? []) as { role: AppRole }[]).map((r) => r.role));
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session, loading]);

  return {
    session,
    roles,
    ready: ready && !loading,
    isAdmin: roles.includes("admin"),
    isStaff: roles.includes("admin") || roles.includes("manager"),
  };
}
