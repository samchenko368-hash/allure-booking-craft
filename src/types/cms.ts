export const LANGS = ["pl", "en", "uk", "ru"] as const;
export type Lang = (typeof LANGS)[number];

export type Localized = Partial<Record<Lang, string>>;

export type Json = Record<string, unknown>;

export interface SiteContentRow {
  id: string;
  section_id: string;
  admin_label: string;
  content: Json;
  is_visible: boolean;
  status: string;
  sort_order: number;
}

export interface NavItem {
  id: string;
  location: string;
  label: Localized;
  href: string;
  sort_order: number;
  is_visible: boolean;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: Localized;
  description: Localized;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  category_id: string | null;
  name: Localized;
  description: Localized;
  price_from: number | null;
  currency: string;
  duration_min: number | null;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface ShowcaseItem {
  id: string;
  title: Localized;
  caption: Localized;
  video_url: string | null;
  poster_url: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  category_id: string | null;
  media_type: string;
  media_url: string;
  caption: Localized;
  is_visible: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author: string;
  avatar_url: string | null;
  rating: number;
  service_type: Localized;
  text: Localized;
  is_pinned: boolean;
  is_visible: boolean;
  sort_order: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role_label: Localized;
  bio: Localized;
  photo_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export type BookingStatus = "new" | "contacted" | "confirmed" | "cancelled" | "completed";
export type BookingSource = "website_form" | "chat" | "service_card_cta";

export interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service_id: string | null;
  service_label: string | null;
  staff_id: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  consent: boolean;
  source: BookingSource;
  status: BookingStatus;
  language: Lang;
  internal_notes: string | null;
  created_at: string;
}

export interface ChatLead {
  id: string;
  name: string | null;
  phone: string | null;
  preferred_service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  transcript: { role: string; text: string }[];
  language: Lang;
  is_processed: boolean;
  converted_booking_id: string | null;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  media_type: string;
  file_name: string | null;
  size_bytes: number | null;
  created_at: string;
}

export const BOOKING_STATUSES: BookingStatus[] = [
  "new",
  "contacted",
  "confirmed",
  "cancelled",
  "completed",
];
