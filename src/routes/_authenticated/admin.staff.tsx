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
import { deleteRow, insertRow, staffQuery, updateRow, uploadMedia } from "@/lib/cms";
import type { Localized, StaffMember } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/admin/staff")({
  component: StaffAdmin,
});

function StaffAdmin() {
  const qc = useQueryClient();
  const { t } = useI18n();
  const { data: staff } = useQuery(staffQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  async function addMember() {
    const created = await insertRow("staff_members", {
      name: "Nowy mistrz",
      role_label: {},
      bio: {},
      is_active: false,
      sort_order: (staff?.length ?? 0) + 1,
    });
    await qc.invalidateQueries({ queryKey: ["staff_members"] });
    setOpenId(created.id);
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{t("admin.staff")}</h1>
          <p className="text-muted-foreground">{t("admin.staff.subtitle")}</p>
        </div>
        <Button variant="hero" onClick={addMember}>
          {t("admin.staff.add")}
        </Button>
      </header>

      <div className="grid gap-4">
        {(staff ?? []).map((member) => (
          <div key={member.id} className="glass-panel rounded-3xl p-6">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpenId(openId === member.id ? null : member.id)}
            >
              <span className="flex items-center gap-3">
                {member.photo_url && (
                  <img src={member.photo_url} alt={member.name} className="h-12 w-12 rounded-full object-cover" />
                )}
                <span className="font-display text-2xl">{member.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {member.is_active ? t("admin.services.active") : t("admin.services.hidden")}
              </span>
            </button>
            {openId === member.id && <StaffEditor member={member} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffEditor({ member }: { member: StaffMember }) {
  const qc = useQueryClient();
  const { t } = useI18n();
  const [draft, setDraft] = useState<StaffMember>({ ...member, bio: member.bio ?? {} });
  const [busy, setBusy] = useState(false);

  const patch = (p: Partial<StaffMember>) => setDraft({ ...draft, ...p });

  async function save() {
    setBusy(true);
    try {
      await updateRow("staff_members", member.id, {
        name: draft.name,
        role_label: draft.role_label,
        bio: draft.bio,
        photo_url: draft.photo_url,
        is_active: draft.is_active,
        sort_order: draft.sort_order,
      });
      await qc.invalidateQueries({ queryKey: ["staff_members"] });
      toast.success(t("common.saved"));
    } catch {
      toast.error(t("common.saveFail"));
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file);
      patch({ photo_url: url });
      toast.success(t("common.saved"));
    } catch {
      toast.error(t("common.saveFail"));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    await deleteRow("staff_members", member.id);
    await qc.invalidateQueries({ queryKey: ["staff_members"] });
    toast.success(t("common.deleted"));
  }

  return (
    <div className="mt-6 grid gap-5 border-t border-border/60 pt-6">
      <div className="grid gap-2">
        <Label>{t("admin.f.name")}</Label>
        <Input value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
      </div>

      <LocalizedField
        label={t("admin.f.role")}
        value={draft.role_label}
        onChange={(v: Localized) => patch({ role_label: v })}
      />
      <LocalizedField
        label={t("admin.f.bio")}
        multiline
        value={draft.bio}
        onChange={(v: Localized) => patch({ bio: v })}
      />

      <div className="grid gap-2">
        <Label>{t("admin.f.photo")}</Label>
        <div className="flex flex-wrap items-center gap-3">
          {draft.photo_url && (
            <img src={draft.photo_url} alt={draft.name} className="h-20 w-20 rounded-2xl object-cover" />
          )}
          <Input type="file" accept="image/*" className="max-w-xs" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
        <Input
          value={draft.photo_url ?? ""}
          placeholder="https://"
          onChange={(e) => patch({ photo_url: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Switch checked={draft.is_active} onCheckedChange={(v) => patch({ is_active: v })} />
          <Label>{t("admin.f.active")}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label>{t("admin.f.order")}</Label>
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
          {t("common.delete")}
        </Button>
        <Button variant="hero" onClick={save} disabled={busy}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
