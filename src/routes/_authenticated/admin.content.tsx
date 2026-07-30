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
      {Object.entries(content).map(([key, value]) => (
        <FieldNode
          key={key}
          path={key}
          label={key}
          value={value}
          onChange={(next) => setContent({ ...content, [key]: next })}
        />
      ))}

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

function FieldNode({
  path,
  label,
  value,
  onChange,
}: {
  path: string;
  label: string;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (isLocalized(value)) {
    const localized = value as Localized;
    const long = Object.values(localized).some((s) => (s ?? "").length > 70);
    return (
      <LocalizedField
        label={label}
        value={localized}
        multiline={long}
        onChange={(next) => onChange(next)}
      />
    );
  }

  if (typeof value === "string") {
    return (
      <div className="grid gap-2">
        <Label className="text-xs tracking-widest uppercase text-muted-foreground">{label}</Label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return (
      <div className="grid gap-2">
        <Label className="text-xs tracking-widest uppercase text-muted-foreground">{label}</Label>
        <Input
          value={String(value ?? "")}
          onChange={(e) => {
            const raw = e.target.value;
            if (typeof value === "number") onChange(raw === "" ? 0 : Number(raw));
            else if (typeof value === "boolean") onChange(raw === "true");
            else onChange(raw);
          }}
        />
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="grid gap-4 rounded-2xl border border-border/60 p-4">
        <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {label} ({value.length})
        </Label>
        {value.map((item, i) => (
          <div key={`${path}.${i}`} className="grid gap-4 rounded-xl bg-muted/30 p-3">
            <span className="text-[11px] text-muted-foreground">#{i + 1}</span>
            <FieldNode
              path={`${path}.${i}`}
              label=""
              value={item}
              onChange={(next) => {
                const arr = [...value];
                arr[i] = next;
                onChange(arr);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  const obj = value as Record<string, unknown>;
  return (
    <div className="grid gap-4 rounded-2xl border border-border/60 p-4">
      {label && (
        <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {label}
        </Label>
      )}
      {Object.entries(obj).map(([k, v]) => (
        <FieldNode
          key={k}
          path={`${path}.${k}`}
          label={k}
          value={v}
          onChange={(next) => onChange({ ...obj, [k]: next })}
        />
      ))}
    </div>
  );
}

