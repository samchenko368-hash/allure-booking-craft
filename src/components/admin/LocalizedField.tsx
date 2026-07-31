import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LANGS, type Lang, type Localized } from "@/types/cms";
import { LANG_LABELS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: Localized | undefined;
  onChange: (next: Localized) => void;
  multiline?: boolean;
}) {
  const { t } = useI18n();
  const v = value ?? {};
  const [active, setActive] = useState<Lang>("pl");
  const filled = LANGS.filter((l) => (v[l] ?? "").trim().length > 0).length;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {label}
        </Label>
        <span className="text-[11px] text-muted-foreground">
          {filled}/{LANGS.length} {t("admin.lang.languages")}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {LANGS.map((lang) => {
          const has = (v[lang] ?? "").trim().length > 0;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setActive(lang)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                active === lang
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {LANG_LABELS[lang]}
              <span className={cn("ml-1", has ? "text-inherit" : "opacity-60")}>
                {has ? "•" : "○"}
              </span>
            </button>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto h-7 text-[11px]"
          onClick={() => {
            const src = v[active] ?? "";
            const next: Localized = { ...v };
            LANGS.forEach((l) => {
              next[l] = src;
            });
            onChange(next);
          }}
        >
          {t("admin.lang.copyAll")}
        </Button>
      </div>

      {multiline ? (
        <Textarea
          rows={4}
          value={v[active] ?? ""}
          placeholder={LANG_LABELS[active]}
          onChange={(e) => onChange({ ...v, [active]: e.target.value })}
        />
      ) : (
        <Input
          value={v[active] ?? ""}
          placeholder={LANG_LABELS[active]}
          onChange={(e) => onChange({ ...v, [active]: e.target.value })}
        />
      )}
    </div>
  );
}
