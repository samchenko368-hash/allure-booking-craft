import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { contentQuery, updateRow } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import type { Json, Localized, SiteContentRow } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentAdmin,
});

const isLocalized = (v: unknown) =>
  !!v && typeof v === "object" && !Array.isArray(v) &&
  Object.keys(v as object).every((k) => ["pl", "en", "uk", "ru"].includes(k));

/** Build an empty item that mirrors the shape of an existing one. */
function blankLike(sample: unknown): unknown {
  if (isLocalized(sample)) return { pl: "", en: "", uk: "", ru: "" };
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(sample as Record<string, unknown>)) out[k] = blankLike(v);
    return out;
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function ContentAdmin() {
  const { t } = useI18n();
  const { data } = useQuery(contentQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl">{t("admin.sections")}</h1>
        <p className="text-muted-foreground">{t("admin.content.subtitle")}</p>
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
                {row.is_visible ? t("admin.content.visible") : t("admin.content.hidden")}
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
  const { t } = useI18n();
  const qc = useQueryClient();
  const [content, setContent] = useState<Json>(row.content);
  const [visible, setVisible] = useState(row.is_visible);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await updateRow("site_content", row.id, { content, is_visible: visible });
      await qc.invalidateQueries({ queryKey: ["site_content"] });
      toast.success(t("common.saved"));
    } catch {
      toast.error(t("common.saveFail"));
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
          <Label htmlFor={`vis-${row.id}`}>{t("admin.content.sectionVisible")}</Label>
        </div>
        <Button variant="hero" onClick={save} disabled={busy}>
          {t("common.save")}
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
  const { t } = useI18n();

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
    const update = (next: unknown[]) => onChange(next);
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= value.length) return;
      const arr = [...value];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      update(arr);
    };

    return (
      <div className="grid gap-4 rounded-2xl border border-border/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            {label} ({value.length})
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => update([...value, blankLike(value[0] ?? { pl: "", en: "", uk: "", ru: "" })])}
          >
            <Plus className="h-3.5 w-3.5" /> {t("admin.content.addItem")}
          </Button>
        </div>

        {value.map((item, i) => (
          <div key={`${path}.${i}`} className="grid gap-4 rounded-xl bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={t("admin.content.moveUp")}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={t("admin.content.moveDown")}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={t("admin.content.duplicate")}
                  onClick={() => {
                    const arr = [...value];
                    arr.splice(i + 1, 0, clone(item));
                    update(arr);
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  title={t("common.delete")}
                  onClick={() => update(value.filter((_, k) => k !== i))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <FieldNode
              path={`${path}.${i}`}
              label=""
              value={item}
              onChange={(next) => {
                const arr = [...value];
                arr[i] = next;
                update(arr);
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
