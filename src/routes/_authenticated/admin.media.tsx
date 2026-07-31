import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { deleteRow, mediaQuery, uploadMedia } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

function MediaAdmin() {
  const qc = useQueryClient();
  const { t } = useI18n();
  const { data } = useQuery(mediaQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) await uploadMedia(file);
      await qc.invalidateQueries({ queryKey: ["media_assets"] });
      toast.success(t("admin.media.uploaded"));
    } catch {
      toast.error(t("admin.media.uploadFail"));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{t("admin.media.title")}</h1>
          <p className="text-muted-foreground">{t("admin.media.subtitle")}</p>
        </div>
        <Button variant="hero" disabled={busy} onClick={() => inputRef.current?.click()}>
          <UploadCloud className="h-4 w-4" /> {busy ? t("admin.media.uploading") : t("admin.media.upload")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((asset) => (
          <div key={asset.id} className="glass-panel overflow-hidden rounded-3xl">
            <div className="aspect-video bg-secondary/60">
              {asset.media_type === "video" ? (
                <video src={asset.public_url} className="h-full w-full object-cover" muted playsInline />
              ) : (
                <img
                  src={asset.public_url}
                  alt={asset.file_name ?? "media"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-2 p-4">
              <p className="truncate text-xs text-muted-foreground">{asset.file_name}</p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(asset.public_url);
                    toast.success(t("admin.media.copied"));
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    await deleteRow("media_assets", asset.id);
                    await qc.invalidateQueries({ queryKey: ["media_assets"] });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">{t("admin.media.empty")}</p>
        )}
      </div>
    </div>
  );
}
