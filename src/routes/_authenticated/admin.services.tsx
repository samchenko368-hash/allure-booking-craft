import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { categoriesQuery, deleteRow, insertRow, servicesQuery, updateRow } from "@/lib/cms";
import type { Localized, Service } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data: services } = useQuery(servicesQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  async function addService() {
    const created = await insertRow("services", {
      name: { pl: "Nowa usluga", en: "New service" },
      description: {},
      is_active: false,
      sort_order: (services?.length ?? 0) + 1,
    });
    await qc.invalidateQueries({ queryKey: ["services"] });
    setOpenId(created.id);
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Usługi</h1>
          <p className="text-muted-foreground">Cennik, opisy i zdjęcia zabiegów.</p>
        </div>
        <Button variant="hero" onClick={addService}>
          Dodaj usługę
        </Button>
      </header>

      <div className="grid gap-4">
        {(services ?? []).map((service) => (
          <div key={service.id} className="glass-panel rounded-3xl p-6">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpenId(openId === service.id ? null : service.id)}
            >
              <span className="font-display text-2xl">{service.name.pl ?? service.name.en}</span>
              <span className="text-xs text-muted-foreground">
                {service.is_active ? "aktywna" : "ukryta"} · {service.price_from ?? "—"} {service.currency}
              </span>
            </button>
            {openId === service.id && (
              <ServiceEditor
                service={service}
                categories={(categories ?? []).map((c) => ({ id: c.id, label: c.name.pl ?? c.slug }))}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceEditor({
  service,
  categories,
}: {
  service: Service;
  categories: { id: string; label: string }[];
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Service>(service);
  const [busy, setBusy] = useState(false);

  const patch = (p: Partial<Service>) => setDraft({ ...draft, ...p });

  async function save() {
    setBusy(true);
    try {
      await updateRow("services", service.id, {
        name: draft.name,
        description: draft.description,
        category_id: draft.category_id || null,
        price_from: draft.price_from,
        currency: draft.currency,
        duration_min: draft.duration_min,
        image_url: draft.image_url,
        is_active: draft.is_active,
        is_featured: draft.is_featured,
        sort_order: draft.sort_order,
      });
      await qc.invalidateQueries({ queryKey: ["services"] });
      toast.success("Zapisano");
    } catch {
      toast.error("Nie udało się zapisać");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    await deleteRow("services", service.id);
    await qc.invalidateQueries({ queryKey: ["services"] });
    toast.success("Usunięto");
  }

  return (
    <div className="mt-6 grid gap-5 border-t border-border/60 pt-6">
      <LocalizedField label="Nazwa" value={draft.name} onChange={(v: Localized) => patch({ name: v })} />
      <LocalizedField
        label="Opis"
        multiline
        value={draft.description}
        onChange={(v: Localized) => patch({ description: v })}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>Kategoria</Label>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={draft.category_id ?? ""}
            onChange={(e) => patch({ category_id: e.target.value || null })}
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label>Cena od</Label>
          <Input
            type="number"
            value={draft.price_from ?? ""}
            onChange={(e) => patch({ price_from: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
        <div className="grid gap-2">
          <Label>Czas (min)</Label>
          <Input
            type="number"
            value={draft.duration_min ?? ""}
            onChange={(e) => patch({ duration_min: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>URL zdjęcia</Label>
        <Input value={draft.image_url ?? ""} onChange={(e) => patch({ image_url: e.target.value })} />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Switch checked={draft.is_active} onCheckedChange={(v) => patch({ is_active: v })} />
          <Label>Aktywna</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={draft.is_featured} onCheckedChange={(v) => patch({ is_featured: v })} />
          <Label>Wyróżniona</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label>Kolejność</Label>
          <Input
            type="number"
            className="w-20"
            value={draft.sort_order}
            onChange={(e) => patch({ sort_order: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={remove}>
          Usuń
        </Button>
        <Button variant="hero" onClick={save} disabled={busy}>
          Zapisz
        </Button>
      </div>
    </div>
  );
}
