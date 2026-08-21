CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION private.is_staff_member(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','manager'));
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM public;
REVOKE ALL ON FUNCTION private.is_staff_member(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff_member(uuid) TO authenticated, service_role;

DROP POLICY "own roles readable" ON public.user_roles;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'));
DROP POLICY "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "staff reads all sections" ON public.site_content;
CREATE POLICY "staff reads all sections" ON public.site_content FOR SELECT TO authenticated
  USING (private.is_staff_member(auth.uid()) OR status = 'published');
DROP POLICY "staff edits sections" ON public.site_content;
CREATE POLICY "staff edits sections" ON public.site_content FOR UPDATE TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "admins insert sections" ON public.site_content;
CREATE POLICY "admins insert sections" ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
DROP POLICY "admins delete sections" ON public.site_content;
CREATE POLICY "admins delete sections" ON public.site_content FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "admins manage nav" ON public.navigation_items;
CREATE POLICY "admins manage nav" ON public.navigation_items FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "admins manage settings" ON public.site_settings;
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "staff manage categories" ON public.service_categories;
CREATE POLICY "staff manage categories" ON public.service_categories FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "staff manage services" ON public.services;
CREATE POLICY "staff manage services" ON public.services FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "staff manage showcase" ON public.showcase_items;
CREATE POLICY "staff manage showcase" ON public.showcase_items FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "staff manage gallery" ON public.gallery_items;
CREATE POLICY "staff manage gallery" ON public.gallery_items FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "staff manage testimonials" ON public.testimonials;
CREATE POLICY "staff manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "staff manage staff" ON public.staff_members;
CREATE POLICY "staff manage staff" ON public.staff_members FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "staff manage media" ON public.media_assets;
CREATE POLICY "staff manage media" ON public.media_assets FOR ALL TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));

DROP POLICY "staff read bookings" ON public.booking_requests;
CREATE POLICY "staff read bookings" ON public.booking_requests FOR SELECT TO authenticated
  USING (private.is_staff_member(auth.uid()));
DROP POLICY "staff update bookings" ON public.booking_requests;
CREATE POLICY "staff update bookings" ON public.booking_requests FOR UPDATE TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "admins delete bookings" ON public.booking_requests;
CREATE POLICY "admins delete bookings" ON public.booking_requests FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "staff read chat leads" ON public.chat_leads;
CREATE POLICY "staff read chat leads" ON public.chat_leads FOR SELECT TO authenticated
  USING (private.is_staff_member(auth.uid()));
DROP POLICY "staff update chat leads" ON public.chat_leads;
CREATE POLICY "staff update chat leads" ON public.chat_leads FOR UPDATE TO authenticated
  USING (private.is_staff_member(auth.uid())) WITH CHECK (private.is_staff_member(auth.uid()));
DROP POLICY "admins delete chat leads" ON public.chat_leads;
CREATE POLICY "admins delete chat leads" ON public.chat_leads FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "staff upload salon media" ON storage.objects;
CREATE POLICY "staff upload salon media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = ANY (ARRAY['images','videos','brand-assets']) AND private.is_staff_member(auth.uid()));
DROP POLICY IF EXISTS "staff update salon media" ON storage.objects;
CREATE POLICY "staff update salon media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = ANY (ARRAY['images','videos','brand-assets']) AND private.is_staff_member(auth.uid()));
DROP POLICY IF EXISTS "staff delete salon media" ON storage.objects;
CREATE POLICY "staff delete salon media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = ANY (ARRAY['images','videos','brand-assets']) AND private.is_staff_member(auth.uid()));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff_member(uuid);