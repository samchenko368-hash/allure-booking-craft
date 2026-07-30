# План реализации CMS-админки

## 0. Аудит текущего кода (факт, не догадки)

Проект — чистый шаблон TanStack Start. Проверено:

- `src/components/` содержит **только `ui/`** (shadcn). Собственных контентных компонентов **нет**.
- `src/routes/` — `__root.tsx` (мета «Lovable App», без хедера/футера) и `index.tsx` — заглушка `blank-app-v1.svg`.
- `src/styles.css` — дефолтные нейтральные oklch-токены, ни фиолетового, ни шрифтов.
- Медиа в проекте: `public/favicon.ico` + загруженное видео `orchid-petals.mp4` (1280×720, 8 c, h264/aac), уже вынесено в CDN: `src/assets/orchid-petals.mp4.asset.json`.
- Supabase/Lovable Cloud **не подключён** (`src/integrations/` отсутствует).

**Вывод:** разделы «инвентаризация компонентов», «миграция хардкода», «извлечение текущих значений» неприменимы — мигрировать нечего. Поэтому строим **CMS-first**: каждый публичный блок сразу читается из БД с типизированным fallback-контентом в коде (на 4 языках), т.е. «миграция» выполняется по факту создания.

## 1. Структура базы данных

Все текстовые поля мультиязычны как JSONB: `{"pl":"...","en":"...","uk":"...","ru":"..."}` (тип `LocalizedText`).

Таблицы:

- `site_content` — `id`, `section_id` (hero/about/services_intro/showcase/why_us/gallery_intro/testimonials_intro/booking_cta/footer/seo), `content jsonb`, `is_visible`, `sort_order`, `status` (draft/published), `updated_at/by`. JSONB — потому что форма блока разная; редактор рендерится по схеме секции из `src/types/cms.ts`.
- `navigation_items` — `location` (header/footer/mobile), `label jsonb`, `href`, `sort_order`, `is_visible`, `parent_id`.
- `site_settings` — key-value JSONB: контакты, адрес, часы работы, соцсети, мессенджеры, карта, язык по умолчанию, SEO.
- `service_categories` / `services` — `name/description jsonb`, `price_from`, `duration_min`, `image_url`, `video_url`, `is_featured`, `is_active`, `sort_order`.
- `showcase_items` — скролл-видео: `video_url`, `poster_url`, `title/caption jsonb`, `sort_order`.
- `gallery_items` — `media_url`, `type` (image/video), `category_id`, `caption jsonb`, `sort_order`.
- `testimonials` — `author`, `avatar_url`, `rating`, `service_type`, `text jsonb`, `is_pinned`, `is_visible`, `sort_order`.
- `media_assets` — реестр загрузок: `bucket`, `path`, `public_url`, `type`, `width/height`, `size`, `alt jsonb`.
- `booking_requests` — имя, телефон, email, `service_id`, `staff_id`, дата, время, сообщение, `consent`, `source` (website_form/chat/service_card_cta), `status` (new/contacted/confirmed/cancelled/completed), `language`, `internal_notes`.
- `chat_leads` — те же контактные поля + `transcript jsonb`, `is_processed`, `converted_booking_id`.
- `staff_members` — имя, роль, фото, активность.
- `user_roles` + enum `app_role` (admin/manager/staff) + SECURITY DEFINER `has_role()`.

Каждая `CREATE TABLE` сопровождается GRANT-ами, `ENABLE ROW LEVEL SECURITY` и политиками. Начальное наполнение — реальный демо-контент салона на PL/EN/UK/RU прямо в миграции (INSERT), чтобы сайт был «полным» с первого рендера.

### Storage buckets

- `images` — публичный (фото услуг, галерея, аватары).
- `videos` — публичный (showcase-ролики, hero-фон).
- `brand-assets` — публичный (логотип, og-изображения).
Загрузка — только для authenticated с ролью admin/manager (политики на `storage.objects`).

## 2. RLS и роли

- Публичное чтение (`TO anon`): контент/навигация/настройки/услуги/галерея/отзывы/showcase — только `is_visible = true` и `status='published'`.
- Запись контента: `has_role(auth.uid(),'admin')`; manager — ограниченно (тексты и заявки, без удаления структур).
- `booking_requests` / `chat_leads`: INSERT доступен всем (публичная форма) через серверную функцию с валидацией; SELECT/UPDATE — только admin/manager. Никакого публичного чтения заявок.
- `user_roles`: чтение — authenticated, изменение — только admin.

## 3. Публичный сайт

Роуты: `/` (лендинг), `/services`, `/gallery`, `/contact`, `/auth`, `/admin/*`.
Секции: Hero → About → Services → Scroll-video showcase → Why us → Gallery → Testimonials → Booking CTA → Footer.

**Общий фон-видео:** ваше видео с падающими лепестками орхидеи ставится как зафиксированный (`fixed`) зацикленный, приглушённый фоновый слой за контентом — текст просто прокручивается поверх, с мягким лилово-градиентным затемнением для читабельности. На мобильных — постер-кадр вместо видео при `prefers-reduced-motion`/слабой сети.

Дизайн-система в `src/styles.css`: фиолетово-лиловая oklch-палитра, премиальная типографика (elegant display + чистый sans), стеклянные карточки, cinematic scroll-reveal, sticky-хедер, переключатель языков PL/EN/UK/RU (PL по умолчанию, хранится в localStorage + URL-параметр).

Чат-виджет: плавающая кнопка, квик-чипы, пошаговый сбор лида → запись в `chat_leads` (source=chat), мультиязычный, с подтверждением.

## 4. Админка

`/admin/login`, `/admin` (дашборд), `/admin/sections`, `/admin/sections/$id`, `/admin/services`, `/admin/navigation`, `/admin/media`, `/admin/settings`, `/admin/bookings`, `/admin/chat-leads` — под защищённым layout-ом.

Переиспользуемые редакторы: `MultilangField`, `TextField/TextAreaField`, `LinkField`, `ToggleField`, `ArrayFieldEditor`, `ReorderableList`, `ImageUploader/VideoUploader`, `MediaPicker`, плюс секционные редакторы (Hero/About/Services/Showcase/Gallery/Testimonials/Footer/Settings/Navigation).
Хуки: `useAuth`, `useRole`, `useContent`, `useUpdateContent`, `useNavigation`, `useSettings`, `useBookings`, `useChatLeads`, `useMediaUpload`.
Типы — `src/types/cms.ts`, доступ к данным — `src/lib/cms.ts` + серверные функции TanStack (`*.functions.ts`).

## 5. Фазы реализации

1. **Фаза 1 — фундамент:** включение Lovable Cloud, полная схема + RLS + демо-контент на 4 языках, buckets, дизайн-система (фиолетовая палитра, шрифты, анимации), i18n-слой, фоновое видео-полотно.
2. **Фаза 2 — публичный сайт:** все 9 секций из БД с fallback, scroll-video showcase, галерея с фильтрами, отзывы, форма бронирования (source=website_form / service_card_cta).
3. **Фаза 3 — чат-виджет:** лид-флоу, запись в `chat_leads`, мультиязычность.
4. **Фаза 4 — auth и роли:** страница входа, `_authenticated` gate, `user_roles`, `has_role`.
5. **Фаза 5 — админ-оболочка и дашборд:** сайдбар, статистика, последние заявки.
6. **Фаза 6 — CMS-редакторы:** секции, услуги, навигация, отзывы, галерея, настройки, медиатека.
7. **Фаза 7 — заявки и лиды:** таблица, фильтры, поиск, drawer, статусы, внутренние заметки, назначение мастера, конвертация лида в заявку.
8. **Фаза 8 — QA:** SEO/head на каждом роуте, мобильная производительность видео, доступность, security-скан.

Перед каждой фазой показываю список создаваемых/изменяемых файлов.

## 6. Риски

Большие JSONB (решение — схемы секций + zod-валидация), консистентность путей в Storage (реестр `media_assets`), производительность видео на мобильных (poster + lazy + IntersectionObserver + reduced-motion), сложность редактора (единый schema-driven рендерер), утечка ключей переводов (типизированный словарь + fallback на PL).

## 7. Вопросы перед стартом

1. Реальные данные салона (название, город, адрес, телефон, соцсети) — или сгенерировать правдоподобные демо-данные?
2. Первый администратор: создать регистрацию на `/admin/login` с автоподтверждением email и назначить роль admin первому зарегистрированному?
3. Фоновое видео с лепестками — на весь сайт (за всеми секциями) или только за hero-блоком?
4. Уведомления о новых заявках на email — нужны в MVP или позже?
