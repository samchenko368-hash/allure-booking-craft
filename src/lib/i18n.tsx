import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LANGS, type Lang, type Localized } from "@/types/cms";

const STORAGE_KEY = "luxe-lang";
export const DEFAULT_LANG: Lang = "pl";

export const LANG_LABELS: Record<Lang, string> = {
  pl: "Polski",
  en: "English",
  uk: "Українська",
  ru: "Русский",
};

type Dict = Record<string, Record<Lang, string>>;

export const dict: Dict = {
  "nav.book": { pl: "Umow wizyte", en: "Book now", uk: "Записатися", ru: "Записаться" },
  "nav.menu": { pl: "Menu", en: "Menu", uk: "Меню", ru: "Меню" },
  "nav.admin": { pl: "Panel", en: "Admin", uk: "Панель", ru: "Панель" },
  "common.from": { pl: "od", en: "from", uk: "від", ru: "от" },
  "common.min": { pl: "min", en: "min", uk: "хв", ru: "мин" },
  "common.all": { pl: "Wszystkie", en: "All", uk: "Усі", ru: "Все" },
  "common.close": { pl: "Zamknij", en: "Close", uk: "Закрити", ru: "Закрыть" },
  "common.save": { pl: "Zapisz", en: "Save", uk: "Зберегти", ru: "Сохранить" },
  "common.saved": { pl: "Zapisano", en: "Saved", uk: "Збережено", ru: "Сохранено" },
  "common.cancel": { pl: "Anuluj", en: "Cancel", uk: "Скасувати", ru: "Отмена" },
  "common.delete": { pl: "Usun", en: "Delete", uk: "Видалити", ru: "Удалить" },
  "common.add": { pl: "Dodaj", en: "Add", uk: "Додати", ru: "Добавить" },
  "common.loading": { pl: "Ladowanie...", en: "Loading...", uk: "Завантаження...", ru: "Загрузка..." },
  "common.empty": { pl: "Brak danych", en: "Nothing here yet", uk: "Поки що порожньо", ru: "Пока пусто" },
  "common.error": { pl: "Cos poszlo nie tak", en: "Something went wrong", uk: "Щось пішло не так", ru: "Что-то пошло не так" },
  "common.details": { pl: "Szczegoly", en: "Details", uk: "Деталі", ru: "Детали" },
  "common.search": { pl: "Szukaj", en: "Search", uk: "Пошук", ru: "Поиск" },

  "booking.title": { pl: "Formularz rezerwacji", en: "Booking request", uk: "Заявка на запис", ru: "Заявка на запись" },
  "booking.name": { pl: "Imie i nazwisko", en: "Full name", uk: "Імя та прізвище", ru: "Имя и фамилия" },
  "booking.phone": { pl: "Telefon", en: "Phone", uk: "Телефон", ru: "Телефон" },
  "booking.email": { pl: "E-mail (opcjonalnie)", en: "Email (optional)", uk: "Email (необовязково)", ru: "Email (необязательно)" },
  "booking.service": { pl: "Usluga", en: "Service", uk: "Послуга", ru: "Услуга" },
  "booking.staff": { pl: "Specjalista (opcjonalnie)", en: "Specialist (optional)", uk: "Майстер (необовязково)", ru: "Мастер (необязательно)" },
  "booking.date": { pl: "Preferowana data", en: "Preferred date", uk: "Бажана дата", ru: "Желаемая дата" },
  "booking.time": { pl: "Preferowana godzina", en: "Preferred time", uk: "Бажаний час", ru: "Желаемое время" },
  "booking.message": { pl: "Wiadomosc", en: "Message", uk: "Повідомлення", ru: "Сообщение" },
  "booking.consent": {
    pl: "Zgadzam sie na kontakt w sprawie rezerwacji.",
    en: "I agree to be contacted about this booking.",
    uk: "Погоджуюсь на звязок щодо запису.",
    ru: "Согласен(на) на связь по поводу записи.",
  },
  "booking.submit": { pl: "Wyslij zgloszenie", en: "Send request", uk: "Надіслати заявку", ru: "Отправить заявку" },
  "booking.sending": { pl: "Wysylanie...", en: "Sending...", uk: "Надсилання...", ru: "Отправка..." },
  "booking.success": {
    pl: "Dziekujemy! Skontaktujemy sie z Toba wkrotce.",
    en: "Thank you! We will contact you shortly.",
    uk: "Дякуємо! Ми звяжемось з вами найближчим часом.",
    ru: "Спасибо! Мы свяжемся с вами в ближайшее время.",
  },
  "booking.anySpecialist": { pl: "Dowolny specjalista", en: "Any specialist", uk: "Будь-який майстер", ru: "Любой мастер" },
  "validation.name": { pl: "Podaj imie (min. 2 znaki)", en: "Enter your name (min. 2 characters)", uk: "Введіть імя (мін. 2 символи)", ru: "Введите имя (мин. 2 символа)" },
  "validation.phone": { pl: "Podaj poprawny numer telefonu", en: "Enter a valid phone number", uk: "Введіть коректний номер телефону", ru: "Введите корректный номер телефона" },
  "validation.email": { pl: "Niepoprawny adres e-mail", en: "Invalid email address", uk: "Некоректний email", ru: "Некорректный email" },
  "validation.consent": { pl: "Wymagana jest zgoda", en: "Consent is required", uk: "Потрібна згода", ru: "Требуется согласие" },

  "chat.title": { pl: "Asystent LUXE", en: "LUXE assistant", uk: "Асистент LUXE", ru: "Ассистент LUXE" },
  "chat.subtitle": { pl: "Zwykle odpowiadamy w kilka minut", en: "We usually reply in minutes", uk: "Зазвичай відповідаємо за кілька хвилин", ru: "Обычно отвечаем за несколько минут" },
  "chat.open": { pl: "Napisz do nas", en: "Chat with us", uk: "Написати нам", ru: "Написать нам" },
  "chat.welcome": {
    pl: "Czesc! Jestem asystentka LUXE. W czym moge pomoc?",
    en: "Hi! I am the LUXE assistant. How can I help?",
    uk: "Привіт! Я асистент LUXE. Чим можу допомогти?",
    ru: "Привет! Я ассистент LUXE. Чем могу помочь?",
  },
  "chat.chip.services": { pl: "Zapytaj o uslugi", en: "Ask about services", uk: "Запитати про послуги", ru: "Спросить об услугах" },
  "chat.chip.prices": { pl: "Zapytaj o ceny", en: "Ask about prices", uk: "Запитати про ціни", ru: "Спросить о ценах" },
  "chat.chip.booking": { pl: "Umow wizyte", en: "Book an appointment", uk: "Записатися", ru: "Записаться" },
  "chat.chip.contact": { pl: "Kontakt z salonem", en: "Contact salon", uk: "Звязок із салоном", ru: "Связаться с салоном" },
  "chat.answer.services": {
    pl: "Robimy wlosy, paznokcie, brwi, rzesy i kosmetologie. Ktora kategoria Cie interesuje?",
    en: "We do hair, nails, brows, lashes and skincare. Which category interests you?",
    uk: "Ми робимо волосся, нігті, брови, вії та косметологію. Яка категорія вас цікавить?",
    ru: "Мы делаем волосы, ногти, брови, ресницы и косметологию. Какая категория вас интересует?",
  },
  "chat.answer.prices": {
    pl: "Ceny zaczynaja sie od 120 zl. Podaj usluge, a przygotuje dokladna wycene.",
    en: "Prices start from 120 PLN. Tell me the service and I will prepare an exact quote.",
    uk: "Ціни починаються від 120 zl. Назвіть послугу, і я підготую точний розрахунок.",
    ru: "Цены начинаются от 120 zl. Назовите услугу, и я подготовлю точный расчет.",
  },
  "chat.answer.contact": {
    pl: "Zadzwon do nas lub zostaw numer - oddzwonimy.",
    en: "Call us or leave your number and we will call you back.",
    uk: "Зателефонуйте нам або залиште номер - ми передзвонимо.",
    ru: "Позвоните нам или оставьте номер - мы перезвоним.",
  },
  "chat.ask.name": { pl: "Jak masz na imie?", en: "What is your name?", uk: "Як вас звати?", ru: "Как вас зовут?" },
  "chat.ask.phone": { pl: "Podaj numer telefonu.", en: "What is your phone number?", uk: "Вкажіть номер телефону.", ru: "Укажите номер телефона." },
  "chat.ask.service": { pl: "Jaka usluga Cie interesuje?", en: "Which service are you interested in?", uk: "Яка послуга вас цікавить?", ru: "Какая услуга вас интересует?" },
  "chat.ask.date": { pl: "Preferowana data? (np. 12.08)", en: "Preferred date? (e.g. 12.08)", uk: "Бажана дата? (напр. 12.08)", ru: "Желаемая дата? (напр. 12.08)" },
  "chat.ask.time": { pl: "O ktorej godzinie?", en: "At what time?", uk: "О котрій годині?", ru: "В какое время?" },
  "chat.ask.message": { pl: "Chcesz cos dodac? Napisz lub wpisz -", en: "Anything to add? Write it or type -", uk: "Хочете щось додати? Напишіть або введіть -", ru: "Хотите что-то добавить? Напишите или введите -" },
  "chat.done": {
    pl: "Gotowe! Twoje zgloszenie zostalo wyslane. Oddzwonimy wkrotce.",
    en: "Done! Your request has been sent. We will call you back soon.",
    uk: "Готово! Вашу заявку надіслано. Ми скоро передзвонимо.",
    ru: "Готово! Ваша заявка отправлена. Мы скоро перезвоним.",
  },
  "chat.placeholder": { pl: "Napisz wiadomosc...", en: "Type a message...", uk: "Напишіть повідомлення...", ru: "Напишите сообщение..." },
  "chat.send": { pl: "Wyslij", en: "Send", uk: "Надіслати", ru: "Отправить" },

  "footer.hours": { pl: "Godziny otwarcia", en: "Opening hours", uk: "Години роботи", ru: "Часы работы" },
  "footer.contact": { pl: "Kontakt", en: "Contact", uk: "Контакти", ru: "Контакты" },
  "footer.monfri": { pl: "Pon - Pt", en: "Mon - Fri", uk: "Пн - Пт", ru: "Пн - Пт" },
  "footer.sat": { pl: "Sobota", en: "Saturday", uk: "Субота", ru: "Суббота" },
  "footer.sun": { pl: "Niedziela", en: "Sunday", uk: "Неділя", ru: "Воскресенье" },

  "status.new": { pl: "Nowe", en: "New", uk: "Нове", ru: "Новая" },
  "status.contacted": { pl: "Skontaktowano", en: "Contacted", uk: "Звязались", ru: "Связались" },
  "status.confirmed": { pl: "Potwierdzone", en: "Confirmed", uk: "Підтверджено", ru: "Подтверждена" },
  "status.cancelled": { pl: "Anulowane", en: "Cancelled", uk: "Скасовано", ru: "Отменена" },
  "status.completed": { pl: "Zrealizowane", en: "Completed", uk: "Виконано", ru: "Выполнена" },

  "admin.dashboard": { pl: "Pulpit", en: "Dashboard", uk: "Панель", ru: "Панель" },
  "admin.sections": { pl: "Sekcje strony", en: "Site sections", uk: "Секції сайту", ru: "Секции сайта" },
  "admin.services": { pl: "Uslugi", en: "Services", uk: "Послуги", ru: "Услуги" },
  "admin.navigation": { pl: "Nawigacja", en: "Navigation", uk: "Навігація", ru: "Навигация" },
  "admin.media": { pl: "Media", en: "Media library", uk: "Медіа", ru: "Медиа" },
  "admin.settings": { pl: "Ustawienia", en: "Settings", uk: "Налаштування", ru: "Настройки" },
  "admin.bookings": { pl: "Rezerwacje", en: "Bookings", uk: "Заявки", ru: "Заявки" },
  "admin.chatLeads": { pl: "Leady z czatu", en: "Chat leads", uk: "Ліди з чату", ru: "Лиды из чата" },
  "admin.signOut": { pl: "Wyloguj", en: "Sign out", uk: "Вийти", ru: "Выйти" },
  "admin.viewSite": { pl: "Zobacz strone", en: "View site", uk: "Переглянути сайт", ru: "Смотреть сайт" },
};

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
  tr: (value: Localized | null | undefined, fallback?: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && (LANGS as readonly string[]).includes(stored)) setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: string) => dict[key]?.[lang] ?? dict[key]?.[DEFAULT_LANG] ?? key,
    [lang],
  );

  const tr = useCallback(
    (value: Localized | null | undefined, fallback = "") =>
      value?.[lang] || value?.[DEFAULT_LANG] || value?.en || fallback,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t, tr }), [lang, setLang, t, tr]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
