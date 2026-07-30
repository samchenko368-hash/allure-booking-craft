import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Logowanie — panel LUXE" },
      { name: "description", content: "Panel administracyjny salonu LUXE Beauty Atelier." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Logowanie — panel LUXE" },
      { property: "og:description", content: "Panel administracyjny salonu LUXE Beauty Atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else toast.success("Sprawdź skrzynkę e-mail i potwierdź konto.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd logowania");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-5">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display text-3xl">
          <span className="text-gradient">Panel LUXE</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Zaloguj się, aby zarządzać treścią." : "Utwórz konto administratora."}
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={busy}>
            {mode === "signin" ? "Zaloguj" : "Zarejestruj"}
          </Button>
        </form>

        <button
          className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-primary"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
        </button>
      </div>
    </main>
  );
}
