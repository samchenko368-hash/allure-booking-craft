import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { useI18n } from "@/lib/i18n";
import { deleteRow, insertRow, navigationQuery, updateRow } from "@/lib/cms";
import type { NavItem } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/navigation")({
  component: NavigationAdmin,
});

function NavigationAdmin() {
  const qc = useQueryClient();
  const { t } = useI18n();
  const { data } = useQuery(navigationQuery);

  async function add() {
    await insertRow("navigation_items", {
      location: "header",
      label: { pl: "Nowy link", en: "New link", uk: "Нове посилання", ru: "Новая ссылка" },
      href: "/",
      sort_order: (data?.length ?? 0) + 1,
    });
    await qc.invalidateQueries({ queryKey: ["navigation_items"] });
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{t("admin.navigation")}</h1>
          <p className="text-muted-foreground">{t("admin.nav.subtitle")}</p>
        </div>
        <Button variant="hero" onClick={add}>
          {t("admin.nav.add")}
        </Button>
      </header>

      <div className="grid gap-4">
        {(data ?? []).map((item) => (
          <NavEditor key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function NavEditor({ item }: { item: NavItem }) {
  const qc = useQueryClient();
  const { t } = useI18n();
  const [draft, setDraft] = useState<NavItem>(item);

  async function save() {
    await updateRow("navigation_items", item.id, {
      label: draft.label,
      href: draft.href,
      location: draft.location,
      sort_order: draft.sort_order,
      is_visible: draft.is_visible,
    });
    await qc.invalidateQueries({ queryKey: ["navigation_items"] });
    toast.success(t("common.saved"));
  }

  async function remove() {
    await deleteRow("navigation_items", item.id);
    await qc.invalidateQueries({ queryKey: ["navigation_items"] });
  }

  return (
    <div className="glass-panel grid gap-5 rounded-3xl p-6">
      <LocalizedField
        label={t("admin.f.label")}
        value={draft.label}
        onChange={(label) => setDraft({ ...draft, label })}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>{t("admin.f.href")}</Label>
          <Input value={draft.href} onChange={(e) => setDraft({ ...draft, href: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>{t("admin.f.location")}</Label>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          >
            <option value="header">header</option>
            <option value="footer">footer</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label>{t("admin.f.order")}</Label>
          <Input
            type="number"
            value={draft.sort_order}
            onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Switch
            checked={draft.is_visible}
            onCheckedChange={(v) => setDraft({ ...draft, is_visible: v })}
          />
          <Label>{t("admin.f.visible")}</Label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={remove}>
            {t("common.delete")}
          </Button>
          <Button variant="hero" onClick={save}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
