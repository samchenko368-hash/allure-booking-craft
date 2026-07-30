import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  BookingRequest,
  ChatLead,
  GalleryItem,
  Json,
  MediaAsset,
  NavItem,
  Service,
  ServiceCategory,
  ShowcaseItem,
  SiteContentRow,
  StaffMember,
  Testimonial,
} from "@/types/cms";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

async function fetchTable<T>(table: string, order?: string, extra?: (q: any) => any): Promise<T[]> {
  let query = db.from(table).select("*");
  if (order) query = query.order(order, { ascending: true });
  if (extra) query = extra(query);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as T[];
}

export const contentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: () => fetchTable<SiteContentRow>("site_content", "sort_order"),
  staleTime: 30_000,
});

export const navigationQuery = queryOptions({
  queryKey: ["navigation_items"],
  queryFn: () => fetchTable<NavItem>("navigation_items", "sort_order"),
  staleTime: 30_000,
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const rows = await fetchTable<{ key: string; value: Json }>("site_settings");
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, Json>;
  },
  staleTime: 30_000,
});

export const categoriesQuery = queryOptions({
  queryKey: ["service_categories"],
  queryFn: () => fetchTable<ServiceCategory>("service_categories", "sort_order"),
  staleTime: 30_000,
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => fetchTable<Service>("services", "sort_order"),
  staleTime: 30_000,
});

export const showcaseQuery = queryOptions({
  queryKey: ["showcase_items"],
  queryFn: () => fetchTable<ShowcaseItem>("showcase_items", "sort_order"),
  staleTime: 30_000,
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery_items"],
  queryFn: () => fetchTable<GalleryItem>("gallery_items", "sort_order"),
  staleTime: 30_000,
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () => fetchTable<Testimonial>("testimonials", "sort_order"),
  staleTime: 30_000,
});

export const staffQuery = queryOptions({
  queryKey: ["staff_members"],
  queryFn: () => fetchTable<StaffMember>("staff_members", "sort_order"),
  staleTime: 30_000,
});

export const bookingsQuery = queryOptions({
  queryKey: ["booking_requests"],
  queryFn: () =>
    fetchTable<BookingRequest>("booking_requests", undefined, (q) =>
      q.order("created_at", { ascending: false }),
    ),
});

export const chatLeadsQuery = queryOptions({
  queryKey: ["chat_leads"],
  queryFn: () =>
    fetchTable<ChatLead>("chat_leads", undefined, (q) => q.order("created_at", { ascending: false })),
});

export const mediaQuery = queryOptions({
  queryKey: ["media_assets"],
  queryFn: () =>
    fetchTable<MediaAsset>("media_assets", undefined, (q) =>
      q.order("created_at", { ascending: false }),
    ),
});

export async function updateRow(table: string, id: string, patch: Record<string, unknown>) {
  const { error } = await db.from(table).update(patch).eq("id", id);
  if (error) throw error;
}

export async function updateSetting(key: string, value: Json) {
  const { error } = await db.from("site_settings").upsert({ key, value });
  if (error) throw error;
}

export async function insertRow(table: string, values: Record<string, unknown>) {
  const { data, error } = await db.from(table).insert(values).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRow(table: string, id: string) {
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) throw error;
}

export function sectionOf(rows: SiteContentRow[] | undefined, sectionId: string) {
  return rows?.find((r) => r.section_id === sectionId);
}

export async function uploadMedia(file: File) {
  const bucket = file.type.startsWith("video") ? "videos" : "images";
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data: signed } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  const publicUrl = signed?.signedUrl ?? "";
  await insertRow("media_assets", {
    bucket,
    path,
    public_url: publicUrl,
    media_type: bucket === "videos" ? "video" : "image",
    file_name: file.name,
    size_bytes: file.size,
  });
  return publicUrl;
}
