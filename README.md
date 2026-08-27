# Salon Bloom

Build a modern multilingual web app for a beauty salon with two tightly connected parts:

1) a public-facing animated salon website with a built-in chat and booking request flow,

2) a CMS-style admin panel powered by Supabase where the administrator can edit every public content block, manage services, manage media, manage navigation, and review incoming booking requests and chat leads.

Important execution mode:

- Use Plan Mode first.

- Do not immediately refactor everything.

- First analyze the current project structure and produce an implementation plan.

- Then implement in phases.

- Before each implementation phase, show what files will be created or modified.

- Prefer maintainable architecture over a quick hack.

Project name:

Beauty Salon Chat & Booking Platform

Primary goal:

Create a premium, modern, elegant salon website that helps visitors discover services, watch short service videos while scrolling, ask questions in chat, and submit booking requests. The admin must be able to edit all website blocks without touching code. The final system should be realistic for a production MVP.

Target audience:

- Women and men looking for beauty salon services

- Service categories may include hair, nails, kosmetologia / косметология, brows, lashes, skincare

- Salon staff need a simple but powerful admin panel to manage content and incoming requests

Core outcome:

A multilingual salon website that converts visitors into leads and booking requests, with a Supabase-backed admin panel that allows non-technical staff to update the site and manage submissions.

Languages:

The interface must support 4 languages:

- Polish (default)

- English

- Ukrainian

- Russian

Language requirements:

- Add a visible language switcher in the header and mobile menu

- All editable text content must use a multilingual structure

- Every editable section in admin must have separate fields for:

  - PL

  - EN

  - UK

  - RU

- Booking form labels, chat UI, buttons, validation messages, request statuses, and admin labels must also support all 4 languages

- Keep multilingual architecture clean and consistent

- Avoid translation-key leakage in UI

Brand and art direction:

- Premium, feminine, modern, elegant, interactive

- Purple and lilac palette with refined contrast

- Soft gradients are allowed, but should feel luxurious and restrained

- Subtle glassmorphism only where it feels tasteful

- Smooth scrolling, layered depth, polished hover states, premium cards

- Motion should feel editorial and cinematic, not gimmicky

- The result must not look like a generic SaaS template or a cheap beauty theme

- Mobile-first and highly polished on desktop

PUBLIC WEBSITE

Create these editable public website sections:

1. Hero section

- Large elegant headline

- Supporting text

- Primary CTA: Book Now

- Secondary CTA: Chat With Us

- Animated background or subtle motion

- Optional promo video or looping beauty reel

- Admin can edit headline, subheadline, CTA labels, badges, background media, and layout style

2. About salon

- Text block about the salon

- Trust indicators or stats

- Photo/video area

- Admin can edit all copy, media, and ordering

3. Services section

- Service categories with elegant cards

- Each card includes:

  - title

  - short description

  - duration

  - price from

  - image or video preview

- Click opens a detailed modal or detail panel

- Admin can create, edit, reorder, hide, feature, or delete categories and services

4. Scroll-triggered video showcase

- As the user scrolls, different service videos appear or animate into view

- Example categories: hair, nails, brows, lashes, skincare

- Use elegant scroll-based transitions and reveal animations

- Videos autoplay muted when visible and pause when out of view

- Mobile version must be performance-optimized

- Admin can upload/replace videos, posters, titles, and captions for each showcase item

5. Why choose us

- Benefits, hygiene, expertise, premium materials, experienced masters

- Animated cards or staggered reveal

- Fully admin editable

6. Gallery / portfolio

- Before/after or service inspiration grid

- Supports images and short videos

- Filter by category

- Admin editable and sortable

7. Testimonials

- Client reviews with optional avatar, rating, and service type

- Admin can add, edit, hide, pin, reorder featured reviews

8. Booking CTA section

- Strong conversion block before footer

- Quick booking form

- Editable text and style controls in admin

9. Footer

- Contact info

- Address

- Working hours

- Social links

- Map

- Messenger links

- Admin editable

BUILT-IN CHAT

Create a modern chat widget for client communication.

Chat requirements:

- Floating chat button

- Open/close animation

- Welcome message

- Quick reply chips such as:

  - Ask about services

  - Ask about prices

  - Book an appointment

  - Contact salon

- If no live chat integration is available, create a smart lead-capture assistant flow

- The chat should collect:

  - name

  - phone

  - preferred service

  - preferred date

  - preferred time

  - optional message

- The conversation should end with a clear confirmation that the request was sent

- Store captured chat leads in the admin panel

- Chat content must be multilingual

- Track source = chat

BOOKING FLOW

Create a booking request system, not just a contact form.

Fields:

- Name

- Phone

- Email (optional)

- Preferred service

- Preferred staff member (optional)

- Preferred date

- Preferred time

- Message / notes

- Consent checkbox

- Hidden source field:

  - website_form

  - chat

  - service_card_cta

Request workflow:

- New

- Contacted

- Confirmed

- Cancelled

- Completed

Add practical admin behavior:

- Search

- Filter by date, service, source, status, language

- Add internal notes

- Assign staff member

- View request details in drawer or modal

ADMIN PANEL

Create a modern admin dashboard with sidebar navigation and a clean CMS-style editing experience.

Admin sections must include:

1. Dashboard overview

- Today’s requests

- New leads

- Popular services

- Recent chat inquiries

- Upcoming bookings

- Quick stat cards

2. Booking requests management

- Table or kanban view

- Filtering, sorting, search

- Open detail drawer/modal

- Update status

- Add internal notes

- Assign staff member

3. Chat leads management

- View all chat-generated leads or conversations

- Mark as processed

- Convert lead into booking record if needed

4. Content management

- Every public block must be editable by admin

- Admin can edit:

  - titles

  - subtitles

  - paragraphs

  - buttons

  - badges

  - service cards

  - testimonials

  - gallery items

  - videos

  - contacts

  - SEO text

- Include section reorder

- Include visibility toggle

- Include draft/published state if possible

5. Media library

- Upload and manage images and videos

- Select media for sections

- Preview thumbnails

- Replace files without breaking layouts

6. Services management

- CRUD for service categories and services

- Fields:

  - multilingual name

  - multilingual description

  - price

  - duration

  - featured flag

  - active/inactive

  - image

  - video

  - order position

7. Salon settings

- Working hours

- Contacts

- Social links

- Address

- Map embed

- Messenger links

- Language defaults

- Theme accents if supported

- SEO settings

ROLES

Use role-based access:

- Admin: full access

- Manager: can view/update requests and leads, limited content editing

- Optional future role: Staff member with limited schedule visibility

- Build role logic using Supabase Auth + role table/policies

SUPABASE REQUIREMENTS

Use Supabase for:

- Postgres database

- Auth

- Storage

- Role-based access control

- CMS content storage

- Booking requests

- Chat leads

- Media management

Propose and implement a realistic production-friendly schema for:

- site_content

- navigation_items

- site_settings

- services

- service_categories

- booking_requests

- chat_leads

- testimonials

- gallery_items

- media_assets

- user_roles

Use JSONB where appropriate for flexible section content, but keep the schema maintainable.

Create realistic RLS policies.

Use Supabase Storage for uploaded images and videos.

Consider bucket separation for:

- images

- videos

- brand-assets

or propose a better structure.

CURRENT CODEBASE AUDIT PHASE

Before implementing the CMS, analyze the existing project.

Audit tasks:

1. CONTENT INVENTORY

- Go through all files inside /src/components/

- Find every component that renders content:

  - text

  - headings

  - paragraphs

  - buttons

  - links

  - images

  - cards

  - lists

  - badges

  - stats

  - testimonials

  - gallery items

  - videos

- For each component, list:

  - file path

  - component name

  - all hardcoded text values

  - all hardcoded links

  - all image src values

  - all video src values

  - arrays and object literals

  - props currently passed in

  - whether it should become CMS-driven

  - suggested CMS section id

2. DATA STRUCTURING

- Group found components into logical editable sections

- For each section define:

  - section id

  - admin label

  - complete JSONB structure for content

  - field names and types

  - multilingual field strategy

  - whether visibility toggle is needed

  - whether sort order is needed

  - whether media support is needed

3. NAVIGATION

- Find Header and Footer components

- Extract all menu items

- Define the structure for navigation_items table

4. MEDIA

- List all images and videos in the project

- Explain where each one is used

- Identify which must be migrated to Supabase Storage

5. SETTINGS

- Find global settings:

  - contacts

  - social links

  - meta tags

  - salon name

  - address

  - schedule

  - legal links

- Define what should go into site_settings

OUTPUT FORMAT FOR THE AUDIT

Return the audit in this exact structure:

# План реализации CMS-админки

## 1. Структура базы данных

### Таблица: site_content

```sql

-- full SQL create table

```

**Описание:**

- what it stores

- why JSONB is used

- how multilingual fields are stored

**Пример начального наполнения:**

```sql

INSERT INTO site_content (id, section_name, content, is_visible, sort_order) VALUES

(...real values extracted from current code...);

```

### Таблица: navigation_items

```sql

-- full SQL

```

### Таблица: site_settings

```sql

-- full SQL

```

### Таблица: booking_requests

```sql

-- full SQL

```

### Таблица: chat_leads

```sql

-- full SQL

```

### Таблица: user_roles

```sql

-- full SQL

```

### Storage buckets

- list buckets

- public/private recommendation

- purpose

## 2. Инвентаризация компонентов

For every relevant component from /src/components/ provide:

### Component: [ComponentName]

- File:

- Purpose:

- Hardcoded texts:

- Hardcoded links:

- Images:

- Videos:

- Arrays / objects:

- Props:

- CMS section id:

- Should become editable:

- Notes:

## 3. Структура секций CMS

For each section provide:

- section id

- admin name

- visibility toggle

- sortable

- content JSONB shape

- current values from code

- recommended editor UI

## 4. Редакторы для админки

For each section propose an editor component:

- fields

- field types

- validation

- media fields

- nested array support

- save behavior

## 5. Компоненты и хуки для создания

Components:

- ProtectedRoute.tsx

- AdminLayout.tsx

- AdminSidebar.tsx

- AdminHeader.tsx

- SectionList.tsx

- SectionEditorRenderer.tsx

- TextField.tsx

- TextAreaField.tsx

- MultilangField.tsx

- LinkField.tsx

- ToggleField.tsx

- ArrayFieldEditor.tsx

- ReorderableList.tsx

- ImageUploader.tsx

- VideoUploader.tsx

- MediaPicker.tsx

- NavigationEditor.tsx

- SettingsEditor.tsx

- HeroEditor.tsx

- ServicesEditor.tsx

- AboutEditor.tsx

- GalleryEditor.tsx

- TestimonialsEditor.tsx

- FooterEditor.tsx

- BookingRequestsTable.tsx

- ChatLeadsTable.tsx

Hooks:

- useAuth()

- useRole()

- useContent(sectionId)

- useUpdateContent(sectionId)

- useNavigation(location)

- useSettings()

- useBookings()

- useChatLeads()

- useImageUpload()

- useVideoUpload()

## 6. Страницы админки

Describe each route:

- /admin/login

- /admin/dashboard

- /admin/sections

- /admin/sections/:id

- /admin/navigation

- /admin/media

- /admin/settings

- /admin/bookings

- /admin/chat-leads

For each route include:

- purpose

- main UI blocks

- data dependencies

- access roles

## 7. Миграция текущих компонентов сайта

For every public component that should become CMS-driven, provide:

- current hardcoded behavior

- migration steps

- target hook usage

- fallback pattern

Use this migration pattern:

```tsx

const { content, loading, isVisible } = useContent('hero');

if (!isVisible) return null;

const heading = content?.heading ?? "existing fallback";

```

## 8. RLS и роли доступа

Provide concrete access policy plan:

- public read rules

- admin write rules

- manager permissions

- media upload permissions

- settings permissions

- booking/chat restrictions

## 9. Порядок реализации

Create a realistic phased roadmap:

1. audit

2. schema

3. auth and roles

4. admin shell

5. content editors

6. public component migration

7. media migration

8. booking/chat management

9. QA and hardening

## 10. Потенциальные риски и решения

List practical issues such as:

- large JSONB structures

- multilingual validation

- storage path consistency

- migration without breaking public UI

- role complexity

- editor UX complexity

- video performance

- fallback content strategy

## 11. Чеклист готовности

Create a final checkbox checklist.

IMPLEMENTATION CONSTRAINTS

- Use the real current codebase, not guesses

- Mention exact file names where possible

- Extract actual current values wherever possible

- If some files are unclear, explicitly mark them for manual verification

- Keep existing design quality and animation style where possible

- Do not remove premium motion unless necessary

- Keep all public-facing content editable by admin

- Use reusable components

- Prefer small focused components

- Use TypeScript-friendly content types

- Keep fallback content during migration

- Do not break the current website while migrating

- Build with clean scalable structure

PROJECT CONVENTIONS

Use this file organization if needed:

- src/pages/

- src/components/

- src/components/admin/editors/

- src/hooks/

- src/types/

- src/lib/

- src/integrations/supabase/

Create and use:

- src/types/cms.ts for CMS section types

- src/lib/cms.ts for content fetching/updating helpers

- AGENTS.md or similar project conventions file if helpful

DESIGN SYSTEM REQUIREMENTS

- Use premium sans-serif typography with elegant headings

- Purple/lilac palette with refined contrast

- Sticky header

- Smooth transitions

- Scroll reveal animations

- Beautiful loading, empty, and hover states

- Light mode first, dark mode optional

- No generic corporate template look

UX REQUIREMENTS

- Fast

- Intuitive

- Conversion-focused

- Mobile-first

- Touch-friendly

- Accessible labels and focus states

- Booking in 2–3 steps max

DATA MODEL ENTITIES

Create or plan entities for:

- languages

- pages

- content blocks

- services

- service categories

- booking requests

- chat leads

- testimonials

- gallery items

- media assets

- settings

- users / roles

ACCEPTANCE CRITERIA

- Admin can edit every visible public website block

- Admin can manage services and media

- Visitors can submit booking requests from forms and chat

- All requests appear in admin with statuses

- The site works in Polish, English, Ukrainian, and Russian

- Purple/lilac premium visual design is consistent

- Scroll-based service video section looks polished

- Mobile version is strong and usable

- Supabase schema is ready for production MVP

- CMS migration plan is concrete and based on actual code

Important exclusions:

- Do not make this look like a basic corporate template

- Do not use dull colors

- Do not create a complicated booking flow

- Do not hardcode content in one language only

- Do not leave public content static or non-editable

Generate the app and the plan with realistic sample salon content in all 4 languages so the interface looks complete from the start.

At the end:

- First show the audit and architecture plan

- Then propose implementation phases

- Then wait for confirmation before making large structural changes

Ask me any questions you need in order to fully understand what I want from this feature and how I envision it.  Добавь видео общее за текстом, оно будет повторятся а текст просто прокручивается

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://allure-booking-craft.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/99188036-5961-4097-8f2d-4aabc1c8ac4b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
