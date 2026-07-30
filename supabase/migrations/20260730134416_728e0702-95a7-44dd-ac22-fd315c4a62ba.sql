
-- storage policies
CREATE POLICY "public can read salon media" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id IN ('images','videos','brand-assets'));
CREATE POLICY "staff upload salon media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('images','videos','brand-assets') AND public.is_staff_member(auth.uid()));
CREATE POLICY "staff update salon media" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('images','videos','brand-assets') AND public.is_staff_member(auth.uid()));
CREATE POLICY "staff delete salon media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('images','videos','brand-assets') AND public.is_staff_member(auth.uid()));

-- ===== site content =====
INSERT INTO public.site_content (section_id, admin_label, sort_order, content) VALUES
('hero','Hero',10,'{
 "badge":{"pl":"Salon piekna w centrum Warszawy","en":"Beauty atelier in the heart of Warsaw","uk":"Салон краси в центрі Варшави","ru":"Салон красоты в центре Варшавы"},
 "heading":{"pl":"Piekno, ktore zapamietasz","en":"Beauty you will remember","uk":"Краса, яку ти запамятаєш","ru":"Красота, которую ты запомнишь"},
 "subheading":{"pl":"Wlosy, paznokcie, brwi, rzesy i kosmetologia w jednym miejscu. Autorskie zabiegi, premium kosmetyki i mistrzowie z pasja.","en":"Hair, nails, brows, lashes and skincare in one place. Signature treatments, premium products and masters with passion.","uk":"Волосся, нігті, брови, вії та косметологія в одному місці. Авторські процедури, преміальна косметика та майстри з пристрастю.","ru":"Волосы, ногти, брови, ресницы и косметология в одном месте. Авторские процедуры, премиальная косметика и мастера с душой."},
 "primary_cta":{"pl":"Umow wizyte","en":"Book now","uk":"Записатися","ru":"Записаться"},
 "secondary_cta":{"pl":"Napisz do nas","en":"Chat with us","uk":"Написати нам","ru":"Написать нам"}
}'::jsonb),
('about','O salonie',20,'{
 "heading":{"pl":"Atelier piekna LUXE","en":"LUXE beauty atelier","uk":"Ательє краси LUXE","ru":"Ателье красоты LUXE"},
 "body":{"pl":"Od 2014 roku tworzymy przestrzen, w ktorej dbalosc o detal spotyka sie z komfortem. Kazda wizyta zaczyna sie od konsultacji, a konczy efektem, ktory chce sie pokazywac.","en":"Since 2014 we have been creating a space where attention to detail meets true comfort. Every visit starts with a consultation and ends with a result worth showing.","uk":"З 2014 року ми створюємо простір, де увага до деталей поєднується з комфортом. Кожен візит починається з консультації і завершується результатом, який хочеться показувати.","ru":"С 2014 года мы создаем пространство, где внимание к деталям встречается с комфортом. Каждый визит начинается с консультации и заканчивается результатом, который хочется показывать."},
 "image":"/media/salon-interior.jpg",
 "stats":[
  {"value":"11","label":{"pl":"lat doswiadczenia","en":"years of experience","uk":"років досвіду","ru":"лет опыта"}},
  {"value":"14","label":{"pl":"mistrzow","en":"masters","uk":"майстрів","ru":"мастеров"}},
  {"value":"32k","label":{"pl":"wizyt","en":"visits","uk":"візитів","ru":"визитов"}},
  {"value":"4.9","label":{"pl":"ocena klientow","en":"client rating","uk":"оцінка клієнтів","ru":"оценка клиентов"}}
 ]
}'::jsonb),
('services_intro','Uslugi - naglowek',30,'{
 "heading":{"pl":"Nasze uslugi","en":"Our services","uk":"Наші послуги","ru":"Наши услуги"},
 "subheading":{"pl":"Wybierz kategorie i zobacz szczegoly zabiegu.","en":"Choose a category and see the treatment details.","uk":"Оберіть категорію та подивіться деталі процедури.","ru":"Выберите категорию и посмотрите детали процедуры."}
}'::jsonb),
('showcase_intro','Wideo showcase - naglowek',40,'{
 "heading":{"pl":"Zobacz nas w akcji","en":"See us in motion","uk":"Побачте нас у дії","ru":"Посмотрите нас в действии"},
 "subheading":{"pl":"Krotkie kadry z naszych zabiegow.","en":"Short frames from our treatments.","uk":"Короткі кадри з наших процедур.","ru":"Короткие кадры наших процедур."}
}'::jsonb),
('why_us','Dlaczego my',50,'{
 "heading":{"pl":"Dlaczego LUXE","en":"Why LUXE","uk":"Чому LUXE","ru":"Почему LUXE"},
 "items":[
  {"icon":"sparkles","title":{"pl":"Mistrzowie z pasja","en":"Masters with passion","uk":"Майстри з пристрастю","ru":"Мастера с душой"},"text":{"pl":"Kazdy specjalista szkoli sie minimum cztery razy w roku.","en":"Every specialist trains at least four times a year.","uk":"Кожен спеціаліст навчається щонайменше чотири рази на рік.","ru":"Каждый специалист учится минимум четыре раза в год."}},
  {"icon":"shield","title":{"pl":"Sterylnosc","en":"Sterility","uk":"Стерильність","ru":"Стерильность"},"text":{"pl":"Autoklaw klasy B i jednorazowe akcesoria przy kazdym zabiegu.","en":"Class B autoclave and single-use accessories for every treatment.","uk":"Автоклав класу B та одноразові аксесуари для кожної процедури.","ru":"Автоклав класса B и одноразовые аксессуары для каждой процедуры."}},
  {"icon":"gem","title":{"pl":"Kosmetyki premium","en":"Premium products","uk":"Преміальна косметика","ru":"Премиальная косметика"},"text":{"pl":"Pracujemy wylacznie na profesjonalnych markach.","en":"We work exclusively with professional brands.","uk":"Працюємо виключно з професійними брендами.","ru":"Работаем только с профессиональными брендами."}},
  {"icon":"clock","title":{"pl":"Szacunek do czasu","en":"Respect for your time","uk":"Повага до часу","ru":"Уважение ко времени"},"text":{"pl":"Zaczynamy punktualnie, bez pospiechu i bez czekania.","en":"We start on time, without rushing and without waiting.","uk":"Починаємо вчасно, без поспіху та очікування.","ru":"Начинаем вовремя, без спешки и ожидания."}}
 ]
}'::jsonb),
('gallery_intro','Galeria - naglowek',60,'{
 "heading":{"pl":"Galeria prac","en":"Portfolio","uk":"Галерея робіт","ru":"Галерея работ"},
 "subheading":{"pl":"Efekty, z ktorych jestesmy dumni.","en":"Results we are proud of.","uk":"Результати, якими ми пишаємось.","ru":"Результаты, которыми мы гордимся."}
}'::jsonb),
('testimonials_intro','Opinie - naglowek',70,'{
 "heading":{"pl":"Opinie klientow","en":"Client stories","uk":"Відгуки клієнтів","ru":"Отзывы клиентов"},
 "subheading":{"pl":"Ponad 3000 ocen w Google i Booksy.","en":"Over 3000 ratings on Google and Booksy.","uk":"Понад 3000 оцінок у Google та Booksy.","ru":"Более 3000 оценок в Google и Booksy."}
}'::jsonb),
('booking_cta','Sekcja rezerwacji',80,'{
 "heading":{"pl":"Zarezerwuj swoj termin","en":"Reserve your moment","uk":"Забронюйте свій час","ru":"Забронируйте свое время"},
 "subheading":{"pl":"Wypelnij formularz - oddzwonimy w ciagu 15 minut w godzinach pracy.","en":"Fill in the form and we will call you back within 15 minutes during opening hours.","uk":"Заповніть форму, і ми передзвонимо протягом 15 хвилин у робочі години.","ru":"Заполните форму, и мы перезвоним в течение 15 минут в рабочее время."}
}'::jsonb),
('footer','Stopka',90,'{
 "about":{"pl":"LUXE Beauty Atelier - premium salon piekna w Warszawie.","en":"LUXE Beauty Atelier - premium beauty salon in Warsaw.","uk":"LUXE Beauty Atelier - преміальний салон краси у Варшаві.","ru":"LUXE Beauty Atelier - премиальный салон красоты в Варшаве."},
 "copyright":{"pl":"Wszelkie prawa zastrzezone.","en":"All rights reserved.","uk":"Всі права захищені.","ru":"Все права защищены."}
}'::jsonb);

-- ===== navigation =====
INSERT INTO public.navigation_items (location, href, sort_order, label) VALUES
('header','#services',10,'{"pl":"Uslugi","en":"Services","uk":"Послуги","ru":"Услуги"}'::jsonb),
('header','#showcase',20,'{"pl":"Wideo","en":"Showcase","uk":"Відео","ru":"Видео"}'::jsonb),
('header','#gallery',30,'{"pl":"Galeria","en":"Gallery","uk":"Галерея","ru":"Галерея"}'::jsonb),
('header','#about',40,'{"pl":"O nas","en":"About","uk":"Про нас","ru":"О нас"}'::jsonb),
('header','#contact',50,'{"pl":"Kontakt","en":"Contact","uk":"Контакти","ru":"Контакты"}'::jsonb);

-- ===== settings =====
INSERT INTO public.site_settings (key, value) VALUES
('general','{"salon_name":"LUXE Beauty Atelier","default_language":"pl","background_video":"/__l5e/assets-v1/73e3aef5-df35-4d1b-8e27-b487d746c67f/orchid-petals.mp4"}'::jsonb),
('contacts','{"phone":"+48 22 123 45 67","email":"hello@luxeatelier.pl","address":"ul. Mokotowska 24, 00-561 Warszawa","map_embed":"https://maps.google.com/maps?q=Mokotowska%2024%20Warszawa&output=embed","whatsapp":"https://wa.me/48221234567","messenger":"https://m.me/luxeatelier"}'::jsonb),
('social','{"instagram":"https://instagram.com/luxeatelier","facebook":"https://facebook.com/luxeatelier","tiktok":"https://tiktok.com/@luxeatelier"}'::jsonb),
('hours','{"mon_fri":"09:00 - 21:00","sat":"10:00 - 19:00","sun":"11:00 - 17:00"}'::jsonb),
('seo','{"title":{"pl":"LUXE Beauty Atelier - salon piekna w Warszawie","en":"LUXE Beauty Atelier - beauty salon in Warsaw","uk":"LUXE Beauty Atelier - салон краси у Варшаві","ru":"LUXE Beauty Atelier - салон красоты в Варшаве"},"description":{"pl":"Wlosy, paznokcie, brwi, rzesy i kosmetologia. Umow wizyte online.","en":"Hair, nails, brows, lashes and skincare. Book your visit online.","uk":"Волосся, нігті, брови, вії та косметологія. Запишіться онлайн.","ru":"Волосы, ногти, брови, ресницы и косметология. Запишитесь онлайн."}}'::jsonb);

-- ===== categories =====
INSERT INTO public.service_categories (slug, sort_order, image_url, name, description) VALUES
('hair',10,'/media/svc-hair.jpg','{"pl":"Wlosy","en":"Hair","uk":"Волосся","ru":"Волосы"}'::jsonb,'{"pl":"Strzyzenie, koloryzacja, pielegnacja.","en":"Cuts, colour and care.","uk":"Стрижки, фарбування, догляд.","ru":"Стрижки, окрашивание, уход."}'::jsonb),
('nails',20,'/media/svc-nails.jpg','{"pl":"Paznokcie","en":"Nails","uk":"Нігті","ru":"Ногти"}'::jsonb,'{"pl":"Manicure, pedicure, przedluzanie.","en":"Manicure, pedicure, extensions.","uk":"Манікюр, педикюр, нарощення.","ru":"Маникюр, педикюр, наращивание."}'::jsonb),
('brows',30,'/media/svc-brows.jpg','{"pl":"Brwi","en":"Brows","uk":"Брови","ru":"Брови"}'::jsonb,'{"pl":"Architektura i laminacja brwi.","en":"Brow architecture and lamination.","uk":"Архітектура та ламінування брів.","ru":"Архитектура и ламинирование бровей."}'::jsonb),
('lashes',40,'/media/svc-lashes.jpg','{"pl":"Rzesy","en":"Lashes","uk":"Вії","ru":"Ресницы"}'::jsonb,'{"pl":"Przedluzanie i lifting rzes.","en":"Lash extensions and lifting.","uk":"Нарощення та ліфтинг вій.","ru":"Наращивание и лифтинг ресниц."}'::jsonb),
('skincare',50,'/media/svc-skincare.jpg','{"pl":"Kosmetologia","en":"Skincare","uk":"Косметологія","ru":"Косметология"}'::jsonb,'{"pl":"Zabiegi na twarz i pielegnacja skory.","en":"Facial treatments and skin care.","uk":"Догляд за обличчям та шкірою.","ru":"Уход за лицом и кожей."}'::jsonb);

-- ===== services =====
INSERT INTO public.services (category_id, sort_order, price_from, duration_min, is_featured, image_url, name, description)
SELECT c.id, s.ord, s.price, s.dur, s.feat, c.image_url, s.nm::jsonb, s.ds::jsonb
FROM public.service_categories c
JOIN (VALUES
 ('hair',10,180,90,true,'{"pl":"Strzyzenie i modelowanie","en":"Cut and styling","uk":"Стрижка та укладка","ru":"Стрижка и укладка"}','{"pl":"Konsultacja, mycie, strzyzenie i stylizacja.","en":"Consultation, wash, cut and styling.","uk":"Консультація, миття, стрижка та укладка.","ru":"Консультация, мытье, стрижка и укладка."}'),
 ('hair',20,450,180,true,'{"pl":"Koloryzacja balayage","en":"Balayage colour","uk":"Фарбування балаяж","ru":"Окрашивание балаяж"}','{"pl":"Miekkie przejscia i rozswietlenie twarzy.","en":"Soft transitions that brighten the face.","uk":"Мякі переходи, що освітлюють обличчя.","ru":"Мягкие переходы, освежающие лицо."}'),
 ('nails',10,150,90,true,'{"pl":"Manicure hybrydowy","en":"Gel manicure","uk":"Гель-манікюр","ru":"Гель-маникюр"}','{"pl":"Opracowanie, kolor i utwardzenie.","en":"Prep, colour and cure.","uk":"Обробка, колір і покриття.","ru":"Обработка, цвет и покрытие."}'),
 ('nails',20,220,120,false,'{"pl":"Pedicure SPA","en":"SPA pedicure","uk":"SPA педикюр","ru":"SPA педикюр"}','{"pl":"Kapiel, peeling, masaz i lakier.","en":"Bath, scrub, massage and polish.","uk":"Ванна, пілінг, масаж і лак.","ru":"Ванна, пилинг, массаж и лак."}'),
 ('brows',10,120,60,true,'{"pl":"Laminacja brwi","en":"Brow lamination","uk":"Ламінування брів","ru":"Ламинирование бровей"}','{"pl":"Uloz brwi na 6 tygodni.","en":"Perfect brow shape for 6 weeks.","uk":"Ідеальна форма брів на 6 тижнів.","ru":"Идеальная форма бровей на 6 недель."}'),
 ('lashes',10,260,150,true,'{"pl":"Przedluzanie rzes 2D","en":"2D lash extensions","uk":"Нарощення вій 2D","ru":"Наращивание ресниц 2D"}','{"pl":"Naturalny efekt gestych rzes.","en":"Naturally full lash effect.","uk":"Природний ефект густих вій.","ru":"Естественный эффект густых ресниц."}'),
 ('skincare',10,320,80,true,'{"pl":"Peeling chemiczny","en":"Chemical peel","uk":"Хімічний пілінг","ru":"Химический пилинг"}','{"pl":"Rozswietlenie i wyrownanie kolorytu.","en":"Brightening and even skin tone.","uk":"Освітлення та рівний тон шкіри.","ru":"Осветление и ровный тон кожи."}'),
 ('skincare',20,380,90,false,'{"pl":"Mezoterapia iglowa","en":"Microneedling mesotherapy","uk":"Мезотерапія","ru":"Мезотерапия"}','{"pl":"Intensywne nawilzenie i regeneracja.","en":"Intense hydration and regeneration.","uk":"Інтенсивне зволоження та регенерація.","ru":"Интенсивное увлажнение и регенерация."}')
) AS s(slug,ord,price,dur,feat,nm,ds) ON s.slug = c.slug;

-- ===== showcase =====
INSERT INTO public.showcase_items (sort_order, poster_url, title, caption) VALUES
(10,'/media/svc-hair.jpg','{"pl":"Wlosy","en":"Hair","uk":"Волосся","ru":"Волосы"}'::jsonb,'{"pl":"Koloryzacja, ktora zyje w ruchu.","en":"Colour that lives in motion.","uk":"Колір, що живе в русі.","ru":"Цвет, который живет в движении."}'::jsonb),
(20,'/media/svc-nails.jpg','{"pl":"Paznokcie","en":"Nails","uk":"Нігті","ru":"Ногти"}'::jsonb,'{"pl":"Detal, ktory widac z bliska.","en":"Detail you can see up close.","uk":"Деталь, помітна зблизька.","ru":"Деталь, заметная вблизи."}'::jsonb),
(30,'/media/svc-brows.jpg','{"pl":"Brwi","en":"Brows","uk":"Брови","ru":"Брови"}'::jsonb,'{"pl":"Architektura idealnego luku.","en":"Architecture of the perfect arch.","uk":"Архітектура ідеальної дуги.","ru":"Архитектура идеальной дуги."}'::jsonb),
(40,'/media/svc-lashes.jpg','{"pl":"Rzesy","en":"Lashes","uk":"Вії","ru":"Ресницы"}'::jsonb,'{"pl":"Spojrzenie, ktore przyciaga.","en":"A look that draws you in.","uk":"Погляд, що притягує.","ru":"Взгляд, который притягивает."}'::jsonb),
(50,'/media/svc-skincare.jpg','{"pl":"Kosmetologia","en":"Skincare","uk":"Косметологія","ru":"Косметология"}'::jsonb,'{"pl":"Skora, ktora oddycha.","en":"Skin that breathes.","uk":"Шкіра, що дихає.","ru":"Кожа, которая дышит."}'::jsonb);

-- ===== gallery =====
INSERT INTO public.gallery_items (category_id, media_url, sort_order, caption)
SELECT c.id, c.image_url, c.sort_order, c.name FROM public.service_categories c;
INSERT INTO public.gallery_items (category_id, media_url, sort_order, caption)
SELECT c.id, c.image_url, c.sort_order + 100, c.description FROM public.service_categories c;

-- ===== testimonials =====
INSERT INTO public.testimonials (author, rating, is_pinned, sort_order, service_type, text) VALUES
('Marta K.',5,true,10,'{"pl":"Koloryzacja","en":"Colour","uk":"Фарбування","ru":"Окрашивание"}'::jsonb,'{"pl":"Najlepsza koloryzacja, jaka mialam. Efekt trzyma sie miesiacami.","en":"The best colour I have ever had. The result lasts for months.","uk":"Найкраще фарбування, яке я мала. Результат тримається місяцями.","ru":"Лучшее окрашивание в моей жизни. Результат держится месяцами."}'::jsonb),
('Olena P.',5,false,20,'{"pl":"Rzesy","en":"Lashes","uk":"Вії","ru":"Ресницы"}'::jsonb,'{"pl":"Rzesy wygladaja naturalnie i trzymaja sie idealnie.","en":"Lashes look natural and hold perfectly.","uk":"Вії виглядають природно і тримаються ідеально.","ru":"Ресницы выглядят естественно и держатся идеально."}'::jsonb),
('Anna W.',5,false,30,'{"pl":"Kosmetologia","en":"Skincare","uk":"Косметологія","ru":"Косметология"}'::jsonb,'{"pl":"Skora po zabiegu jest gladka i rozswietlona.","en":"My skin is smooth and glowing after the treatment.","uk":"Шкіра після процедури гладка та сяюча.","ru":"Кожа после процедуры гладкая и сияющая."}'::jsonb),
('Piotr N.',5,false,40,'{"pl":"Strzyzenie","en":"Haircut","uk":"Стрижка","ru":"Стрижка"}'::jsonb,'{"pl":"Profesjonalnie, punktualnie i bez pospiechu.","en":"Professional, on time and unrushed.","uk":"Професійно, вчасно і без поспіху.","ru":"Профессионально, вовремя и без спешки."}'::jsonb);

-- ===== staff =====
INSERT INTO public.staff_members (name, sort_order, role_label) VALUES
('Zofia',10,'{"pl":"Stylistka wlosow","en":"Hair stylist","uk":"Стиліст волосся","ru":"Стилист по волосам"}'::jsonb),
('Kamila',20,'{"pl":"Manicurzystka","en":"Nail artist","uk":"Майстер манікюру","ru":"Мастер маникюра"}'::jsonb),
('Iryna',30,'{"pl":"Brow and lash artist","en":"Brow and lash artist","uk":"Brow and lash майстер","ru":"Brow and lash мастер"}'::jsonb),
('Dr Ewa',40,'{"pl":"Kosmetolog","en":"Cosmetologist","uk":"Косметолог","ru":"Косметолог"}'::jsonb);

-- ===== sample requests =====
INSERT INTO public.booking_requests (name, phone, email, service_label, preferred_date, preferred_time, message, consent, source, status, language) VALUES
('Julia Nowak','+48 601 222 333','julia@example.com','Balayage', CURRENT_DATE + 2,'14:00','Prosze o kontakt po 17.',true,'website_form','new','pl'),
('Sofiia Kravets','+48 512 998 100',NULL,'Lash extensions', CURRENT_DATE + 1,'11:30',NULL,true,'chat','contacted','uk'),
('Anna Iwanowa','+48 733 400 111','anna@example.com','Gel manicure', CURRENT_DATE + 4,'18:00','Pierwsza wizyta.',true,'service_card_cta','confirmed','ru');

INSERT INTO public.chat_leads (name, phone, preferred_service, preferred_date, preferred_time, message, language, transcript) VALUES
('Marina','+48 780 100 200','Skincare', to_char(CURRENT_DATE + 3,'YYYY-MM-DD'),'16:00','Interesuje mnie peeling.','ru','[{"role":"bot","text":"Witaj w LUXE"},{"role":"user","text":"Chce peeling"}]'::jsonb);
