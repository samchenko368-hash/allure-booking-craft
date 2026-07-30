import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insertRow, settingsQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Msg = { role: "bot" | "user"; text: string };
type Step = "idle" | "name" | "phone" | "service" | "date" | "time" | "message" | "done";

const FLOW: Step[] = ["name", "phone", "service", "date", "time", "message"];

export function ChatWidget({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { t, lang } = useI18n();
  const { data: settings } = useQuery(settingsQuery);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("idle");
  const [draft, setDraft] = useState("");
  const [lead, setLead] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: t("chat.welcome") }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const push = (msg: Msg) => setMessages((prev) => [...prev, msg]);

  async function saveLead(final: Record<string, string>, transcript: Msg[]) {
    try {
      await insertRow("chat_leads", {
        name: final.name ?? null,
        phone: final.phone ?? null,
        preferred_service: final.service ?? null,
        preferred_date: final.date ?? null,
        preferred_time: final.time ?? null,
        message: final.message && final.message !== "-" ? final.message : null,
        transcript: transcript.map((m) => ({ role: m.role, text: m.text })),
        language: lang,
      });
      if (final.name && final.phone) {
        await insertRow("booking_requests", {
          name: final.name,
          phone: final.phone,
          service_label: final.service ?? null,
          preferred_time: final.time ?? null,
          message: final.message && final.message !== "-" ? final.message : null,
          consent: true,
          source: "chat",
          language: lang,
        });
      }
    } catch {
      /* lead capture is best-effort */
    }
  }

  function advance(answer: string) {
    const idx = FLOW.indexOf(step as Step);
    const key = FLOW[idx];
    const nextLead = { ...lead, [key]: answer };
    setLead(nextLead);
    const next = FLOW[idx + 1];
    if (next) {
      setStep(next);
      push({ role: "bot", text: t(`chat.ask.${next}`) });
    } else {
      setStep("done");
      const done: Msg = { role: "bot", text: t("chat.done") };
      push(done);
      void saveLead(nextLead, [...messages, { role: "user", text: answer }, done]);
    }
  }

  function chip(kind: "services" | "prices" | "booking" | "contact") {
    push({ role: "user", text: t(`chat.chip.${kind}`) });
    if (kind === "booking") {
      setStep("name");
      push({ role: "bot", text: t("chat.ask.name") });
      return;
    }
    if (kind === "contact") {
      const contacts = (settings?.contacts ?? {}) as Record<string, string>;
      push({ role: "bot", text: `${t("chat.answer.contact")} ${contacts.phone ?? ""}` });
      return;
    }
    push({ role: "bot", text: t(`chat.answer.${kind}`) });
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    push({ role: "user", text: value });
    setDraft("");
    if (FLOW.includes(step as Step)) {
      advance(value);
    } else {
      setStep("name");
      setTimeout(() => push({ role: "bot", text: t("chat.ask.name") }), 300);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("chat.open")}
        className="fixed right-5 bottom-5 z-50 flex h-15 w-15 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow p-4 text-primary-foreground shadow-luxe transition-transform duration-300 hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="glass-panel fixed right-5 bottom-24 z-50 flex h-[520px] w-[min(92vw,380px)] animate-scale-in flex-col overflow-hidden rounded-3xl">
          <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/15 to-transparent p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="font-display text-lg leading-tight">{t("chat.title")}</p>
              <p className="text-xs text-muted-foreground">{t("chat.subtitle")}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "bot"
                    ? "bg-secondary text-secondary-foreground"
                    : "ml-auto bg-primary text-primary-foreground",
                )}
              >
                {m.text}
              </div>
            ))}

            {step === "idle" && (
              <div className="flex flex-wrap gap-2 pt-2">
                {(["services", "prices", "booking", "contact"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => chip(k)}
                    className="rounded-full border border-primary/40 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
                  >
                    {t(`chat.chip.${k}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border/60 p-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
            />
            <Button type="submit" size="icon" aria-label={t("chat.send")}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
