import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LANGS, type Localized } from "@/types/cms";
import { LANG_LABELS } from "@/lib/i18n";

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
  const v = value ?? {};
  return (
    <div className="grid gap-2">
      <Label className="text-xs tracking-widest uppercase text-muted-foreground">{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {LANGS.map((lang) => (
          <div key={lang} className="grid gap-1">
            <span className="text-[11px] text-muted-foreground">{LANG_LABELS[lang]}</span>
            {multiline ? (
              <Textarea
                rows={3}
                value={v[lang] ?? ""}
                onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
              />
            ) : (
              <Input
                value={v[lang] ?? ""}
                onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
