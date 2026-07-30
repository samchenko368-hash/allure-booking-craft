
-- ===== roles =====
CREATE TYPE public.app_role AS ENUM ('admin','manager','staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff_member(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','manager'));
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- first registered user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_role AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== site_content =====
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL UNIQUE,
  admin_label text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published sections" ON public.site_content FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "staff reads all sections" ON public.site_content FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()) OR status = 'published');
CREATE POLICY "staff edits sections" ON public.site_content FOR UPDATE TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));
CREATE POLICY "admins insert sections" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete sections" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===== navigation_items =====
CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL DEFAULT 'header',
  label jsonb NOT NULL DEFAULT '{}'::jsonb,
  href text NOT NULL DEFAULT '/',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.navigation_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navigation_items TO authenticated;
GRANT ALL ON public.navigation_items TO service_role;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads nav" ON public.navigation_items FOR SELECT TO anon USING (is_visible);
CREATE POLICY "auth reads nav" ON public.navigation_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage nav" ON public.navigation_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===== site_settings =====
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads settings" ON public.site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "auth reads settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===== service categories & services =====
CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_categories TO authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads categories" ON public.service_categories FOR SELECT TO anon USING (is_active);
CREATE POLICY "auth reads categories" ON public.service_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage categories" ON public.service_categories FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  name jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_from numeric(10,2),
  currency text NOT NULL DEFAULT 'PLN',
  duration_min integer,
  image_url text,
  video_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads services" ON public.services FOR SELECT TO anon USING (is_active);
CREATE POLICY "auth reads services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage services" ON public.services FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

-- ===== showcase items =====
CREATE TABLE public.showcase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{}'::jsonb,
  caption jsonb NOT NULL DEFAULT '{}'::jsonb,
  video_url text,
  poster_url text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.showcase_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.showcase_items TO authenticated;
GRANT ALL ON public.showcase_items TO service_role;
ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads showcase" ON public.showcase_items FOR SELECT TO anon USING (is_visible);
CREATE POLICY "auth reads showcase" ON public.showcase_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage showcase" ON public.showcase_items FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

-- ===== gallery =====
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  media_type text NOT NULL DEFAULT 'image',
  media_url text NOT NULL,
  caption jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads gallery" ON public.gallery_items FOR SELECT TO anon USING (is_visible);
CREATE POLICY "auth reads gallery" ON public.gallery_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

-- ===== testimonials =====
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  avatar_url text,
  rating smallint NOT NULL DEFAULT 5,
  service_type jsonb NOT NULL DEFAULT '{}'::jsonb,
  text jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_pinned boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads testimonials" ON public.testimonials FOR SELECT TO anon USING (is_visible);
CREATE POLICY "auth reads testimonials" ON public.testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

-- ===== staff members =====
CREATE TABLE public.staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_label jsonb NOT NULL DEFAULT '{}'::jsonb,
  photo_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.staff_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_members TO authenticated;
GRANT ALL ON public.staff_members TO service_role;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads staff" ON public.staff_members FOR SELECT TO anon USING (is_active);
CREATE POLICY "auth reads staff" ON public.staff_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage staff" ON public.staff_members FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

-- ===== media assets =====
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  path text NOT NULL,
  public_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  file_name text,
  size_bytes bigint,
  alt jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage media" ON public.media_assets FOR ALL TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));

-- ===== booking requests =====
CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_label text,
  staff_id uuid REFERENCES public.staff_members(id) ON DELETE SET NULL,
  preferred_date date,
  preferred_time text,
  message text,
  consent boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'website_form',
  status text NOT NULL DEFAULT 'new',
  language text NOT NULL DEFAULT 'pl',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.booking_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit booking" ON public.booking_requests FOR INSERT TO anon WITH CHECK (consent = true);
CREATE POLICY "auth can submit booking" ON public.booking_requests FOR INSERT TO authenticated WITH CHECK (consent = true);
CREATE POLICY "staff read bookings" ON public.booking_requests FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "staff update bookings" ON public.booking_requests FOR UPDATE TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));
CREATE POLICY "admins delete bookings" ON public.booking_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_bookings_updated BEFORE UPDATE ON public.booking_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===== chat leads =====
CREATE TABLE public.chat_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  phone text,
  preferred_service text,
  preferred_date text,
  preferred_time text,
  message text,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,
  language text NOT NULL DEFAULT 'pl',
  is_processed boolean NOT NULL DEFAULT false,
  converted_booking_id uuid REFERENCES public.booking_requests(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.chat_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_leads TO authenticated;
GRANT ALL ON public.chat_leads TO service_role;
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit chat lead" ON public.chat_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth can submit chat lead" ON public.chat_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "staff read chat leads" ON public.chat_leads FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "staff update chat leads" ON public.chat_leads FOR UPDATE TO authenticated USING (public.is_staff_member(auth.uid())) WITH CHECK (public.is_staff_member(auth.uid()));
CREATE POLICY "admins delete chat leads" ON public.chat_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER t_chat_leads_updated BEFORE UPDATE ON public.chat_leads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
