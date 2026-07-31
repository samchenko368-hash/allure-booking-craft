import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { settingsQuery, updateSetting } from "@/lib/cms";
import type { Json } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { t } = useI18n();
  const { data } = useQuery(settingsQuery);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl">{t("admin.settings.title")}</h1>
        <p className="text-muted-foreground">
          {t("admin.settings.subtitle")}
        </p>
      </header>

      <div className="grid gap-4">
        {Object.entries(data ?? {}).map(([key, value]) => (
          <SettingEditor key={key} settingKey={key} value={value} />
        ))}
        {Object.keys(data ?? {}).length === 0 && (
          <p className="text-sm text-muted-foreground">{t("admin.settings.empty")}</p>
        )}
      </div>
    </div>
  );
}

function SettingEditor({ settingKey, value }: { settingKey: string; value: Json }) {
  const qc = useQueryClient();
  const { t } = useI18n();
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      const parsed = JSON.parse(text) as Json;
      await updateSetting(settingKey, parsed);
      await qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success(t("common.saved"));
    } catch (e) {
      toast.error(e instanceof SyntaxError ? t("admin.settings.invalidJson") : t("common.saveFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel grid gap-3 rounded-3xl p-6">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{settingKey}</Label>
      <Textarea
        rows={10}
        className="font-mono text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button variant="hero" onClick={save} disabled={busy}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
