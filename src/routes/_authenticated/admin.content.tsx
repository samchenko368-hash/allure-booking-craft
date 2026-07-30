import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { contentQuery, updateRow } from "@/lib/cms";
import type { Json, Localized, SiteContentRow } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentAdmin,
});

const isLocalized = (v: unknown) =>
  !!v && typeof v === "object" && !Array.isArray(v) &&
  Object.keys(v as object).every((k) => ["pl", "en", "uk", "ru"].includes(k));

function ContentAdmin() {
  const { data } = useQuery(contentQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl">Sekcje strony</h1>
        <p className="text-muted-foreground">Edytuj wszystkie teksty w czterech językach.</p>
      </header>

      <div className="grid gap-4">
        {(data ?? []).map((row) => (
          <div key={row.id} className="glass-panel rounded-3xl p-6">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpenId(openId === row.id ? null : row.id)}
            >
              <span>
                <span className="font-display text-2xl">{row.admin_label}</span>
                <span className="ml-3 text-xs text-muted-foreground">{row.section_id}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {row.is_visible ? "widoczna" : "ukryta"}
              </span>
            </button>
            {openId === row.id && <SectionEditor row={row} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionEditor({ row }: { row: SiteContentRow }) {
  const qc = useQueryClient();
  const [content, setContent] = useState<Json>(row.content);
  const [visible, setVisible] = useState(row.is_visible);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await updateRow("site_content", row.id, { content, is_visible: visible });
      await qc.invalidateQueries({ queryKey: ["site_content"] });
      toast.success("Zapisano");
    } catch {
      toast.error("Nie udało się zapisać");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 grid gap-5 border-t border-border/60 pt-6">
      {Object.entries(content).map(([key, value]) => {
        if (isLocalized(value)) {
          const localized = value as Localized;
          const long = Object.values(localized).some((s) => (s ?? "").length > 70);
          return (
            <LocalizedField
              key={key}
              label={key}
              value={localized}
              multiline={long}
              onChange={(next) => setContent({ ...content, [key]: next })}
            />
          );
        }
        if (typeof value === "string") {
          return (
            <div key={key} className="grid gap-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">{key}</Label>
              <Input
                value={value}
                onChange={(e) => setContent({ ...content, [key]: e.target.value })}
              />
            </div>
          );
        }
        return (
          <div key={key} className="grid gap-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              {key} (JSON)
            </Label>
            <Textarea
              rows={8}
              className="font-mono text-xs"
              defaultValue={JSON.stringify(value, null, 2)}
              onBlur={(e) => {
                try {
                  setContent({ ...content, [key]: JSON.parse(e.target.value) });
                } catch {
                  toast.error(`Niepoprawny JSON w polu ${key}`);
                }
              }}
            />
          </div>
        );
      })}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Switch id={`vis-${row.id}`} checked={visible} onCheckedChange={setVisible} />
          <Label htmlFor={`vis-${row.id}`}>Sekcja widoczna na stronie</Label>
        </div>
        <Button variant="hero" onClick={save} disabled={busy}>
          Zapisz
        </Button>
      </div>
    </div>
  );
}
