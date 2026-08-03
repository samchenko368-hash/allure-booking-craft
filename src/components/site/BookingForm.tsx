import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { insertRow, servicesQuery, staffQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import { CONTACT_METHODS, type BookingSource, type ContactMethod } from "@/types/cms";

export function BookingForm({
  source = "website_form",
  defaultService,
  onDone,
}: {
  source?: BookingSource;
  defaultService?: string;
  onDone?: () => void;
}) {
  const { t, tr, lang } = useI18n();
  const { data: services } = useQuery(servicesQuery);
  const { data: staff } = useQuery(staffQuery);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: defaultService ?? "",
    staffId: "",
    date: "",
    time: "",
    message: "",
    contactMethod: "call" as ContactMethod,
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const schema = z.object({
    name: z.string().trim().min(2, t("validation.name")).max(80),
    phone: z.string().trim().min(7, t("validation.phone")).max(30),
    email: z.union([z.string().trim().email(t("validation.email")).max(160), z.literal("")]),
    consent: z.literal(true, { errorMap: () => ({ message: t("validation.consent") }) }),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[String(i.path[0])] = i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      await insertRow("booking_requests", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        service_label: form.service || null,
        staff_id: form.staffId || null,
        preferred_date: form.date || null,
        preferred_time: form.time || null,
        message: form.message.trim() || null,
        contact_method: form.contactMethod,
        consent: true,
        source,
        language: lang,
      });
      setState("done");
      onDone?.();
    } catch {
      setState("idle");
      setErrors({ form: t("common.error") });
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary/60 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <p className="font-display text-xl">{t("booking.success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="bf-name">{t("booking.name")}</Label>
        <Input
          id="bf-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="bf-phone">{t("booking.phone")}</Label>
          <Input
            id="bf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bf-email">{t("booking.email")}</Label>
          <Input
            id="bf-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="bf-service">{t("booking.service")}</Label>
          <select
            id="bf-service"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          >
            <option value="">—</option>
            {services?.map((s) => (
              <option key={s.id} value={tr(s.name)}>
                {tr(s.name)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bf-staff">{t("booking.staff")}</Label>
          <select
            id="bf-staff"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={form.staffId}
            onChange={(e) => setForm({ ...form, staffId: e.target.value })}
          >
            <option value="">{t("booking.anySpecialist")}</option>
            {staff?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {tr(s.role_label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="bf-date">{t("booking.date")}</Label>
          <Input
            id="bf-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bf-time">{t("booking.time")}</Label>
          <Input
            id="bf-time"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{t("booking.contactMethod")}</Label>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setForm({ ...form, contactMethod: m })}
              className={
                "rounded-full border px-4 py-2 text-sm transition-all " +
                (form.contactMethod === m
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent")
              }
            >
              {t(`contact.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bf-message">{t("booking.message")}</Label>
        <Textarea
          id="bf-message"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="bf-consent"
          checked={form.consent}
          onCheckedChange={(v) => setForm({ ...form, consent: v === true })}
        />
        <Label htmlFor="bf-consent" className="text-sm leading-snug font-normal">
          {t("booking.consent")}
        </Label>
      </div>
      {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
      {errors.form && <p className="text-xs text-destructive">{errors.form}</p>}

      <Button type="submit" size="lg" disabled={state === "sending"} className="mt-1 w-full">
        {state === "sending" ? t("booking.sending") : t("booking.submit")}
      </Button>
    </form>
  );
}
