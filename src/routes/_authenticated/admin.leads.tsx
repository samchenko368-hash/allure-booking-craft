import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { chatLeadsQuery, deleteRow, insertRow, updateRow } from "@/lib/cms";
import type { ChatLead } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsAdmin,
});

function LeadsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery(chatLeadsQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  async function toggleProcessed(lead: ChatLead) {
    await updateRow("chat_leads", lead.id, { is_processed: !lead.is_processed });
    await qc.invalidateQueries({ queryKey: ["chat_leads"] });
  }

  async function convert(lead: ChatLead) {
    try {
      const booking = await insertRow("booking_requests", {
        name: lead.name ?? "Lead z czatu",
        phone: lead.phone ?? "—",
        service_label: lead.preferred_service,
        preferred_date: /^\d{4}-\d{2}-\d{2}$/.test(lead.preferred_date ?? "") ? lead.preferred_date : null,
        preferred_time: lead.preferred_time,
        message: lead.message,
        consent: true,
        source: "chat_widget",
        language: lead.language,
      });
      await updateRow("chat_leads", lead.id, { is_processed: true, converted_booking_id: booking.id });
      await qc.invalidateQueries({ queryKey: ["chat_leads"] });
      await qc.invalidateQueries({ queryKey: ["booking_requests"] });
      toast.success("Utworzono rezerwację");
    } catch {
      toast.error("Nie udało się przekształcić leada");
    }
  }

  async function remove(lead: ChatLead) {
    try {
      await deleteRow("chat_leads", lead.id);
      await qc.invalidateQueries({ queryKey: ["chat_leads"] });
    } catch {
      toast.error("Tylko administrator może usuwać leady");
    }
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl">Leady z czatu</h1>
        <p className="text-muted-foreground">Rozmowy z asystentem i dane kontaktowe.</p>
      </header>

      <div className="grid gap-3">
        {(data ?? []).map((lead) => (
          <div key={lead.id} className="glass-panel rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-xl">{lead.name ?? "Bez imienia"}</p>
                <p className="text-sm text-muted-foreground">
                  {lead.phone ?? "—"} · {lead.preferred_service ?? "—"} · {lead.preferred_date ?? "—"}{" "}
                  {lead.preferred_time ?? ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={() => setOpenId(openId === lead.id ? null : lead.id)}>
                  Transkrypcja
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleProcessed(lead)}>
                  {lead.is_processed ? "Oznacz jako nowy" : "Oznacz jako obsłużony"}
                </Button>
                {!lead.converted_booking_id && (
                  <Button variant="hero" size="sm" onClick={() => convert(lead)}>
                    Utwórz rezerwację
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => remove(lead)}>
                  Usuń
                </Button>
              </div>
            </div>
            {openId === lead.id && (
              <ul className="mt-5 grid gap-2 border-t border-border/60 pt-5 text-sm">
                {(lead.transcript ?? []).map((m, i) => (
                  <li key={i} className="rounded-2xl bg-secondary/60 px-4 py-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {m.role}
                    </span>
                    <p>{m.text}</p>
                  </li>
                ))}
                {(lead.transcript ?? []).length === 0 && (
                  <li className="text-muted-foreground">Brak transkrypcji.</li>
                )}
              </ul>
            )}
          </div>
        ))}
        {(data ?? []).length === 0 && <p className="text-sm text-muted-foreground">Brak leadów.</p>}
      </div>
    </div>
  );
}
