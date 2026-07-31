import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { bookingsQuery, deleteRow, updateRow } from "@/lib/cms";
import type { BookingRequest } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsAdmin,
});

const STATUSES = ["new", "contacted", "confirmed", "done", "cancelled"] as const;

function BookingsAdmin() {
  const qc = useQueryClient();
  const { t } = useI18n();
  const { data } = useQuery(bookingsQuery);
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = (data ?? []).filter((b) => filter === "all" || b.status === filter);

  async function setStatus(row: BookingRequest, status: string) {
    await updateRow("booking_requests", row.id, { status, updated_at: new Date().toISOString() });
    await qc.invalidateQueries({ queryKey: ["booking_requests"] });
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl">{t("admin.bookings")}</h1>
        <p className="text-muted-foreground">{t("admin.bookings.subtitle")}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "glass-panel"
            }`}
          >
            {t(`status.${s}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {rows.map((b) => (
          <div key={b.id} className="glass-panel rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-xl">{b.name}</p>
                <p className="text-sm text-muted-foreground">
                  {b.phone} {b.email ? `· ${b.email}` : ""} · {b.source}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {b.service_label ?? "—"} · {b.preferred_date ?? "—"} {b.preferred_time ?? ""}
              </div>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={b.status}
                onChange={(e) => setStatus(b, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`status.${s}`)}
                  </option>
                ))}
              </select>
              <Button variant="ghost" size="sm" onClick={() => setOpenId(openId === b.id ? null : b.id)}>
                {t("common.details")}
              </Button>
            </div>
            {openId === b.id && <BookingDetails booking={b} />}
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.dash.none")}</p>}
      </div>
    </div>
  );
}

function BookingDetails({ booking }: { booking: BookingRequest }) {
  const qc = useQueryClient();
  const { t } = useI18n();
  const [notes, setNotes] = useState(booking.internal_notes ?? "");

  async function save() {
    await updateRow("booking_requests", booking.id, { internal_notes: notes });
    await qc.invalidateQueries({ queryKey: ["booking_requests"] });
    toast.success(t("common.saved"));
  }

  async function remove() {
    try {
      await deleteRow("booking_requests", booking.id);
      await qc.invalidateQueries({ queryKey: ["booking_requests"] });
      toast.success(t("common.deleted"));
    } catch {
      toast.error(t("admin.onlyAdminDelete"));
    }
  }

  return (
    <div className="mt-5 grid gap-4 border-t border-border/60 pt-5">
      {booking.message && <p className="text-sm">{booking.message}</p>}
      <p className="text-xs text-muted-foreground">
        {t("admin.language")}: {booking.language} · {t("admin.createdAt")}:{" "}
        {new Date(booking.created_at).toLocaleString()}
      </p>
      <Textarea
        rows={3}
        placeholder={t("admin.notes.placeholder")}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={remove}>
          {t("common.delete")}
        </Button>
        <Button variant="hero" size="sm" onClick={save}>
          {t("admin.notes.save")}
        </Button>
      </div>
    </div>
  );
}
