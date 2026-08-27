/**
 * AKTIVA språk: svenska, engelska, tyska, franska, spanska, portugisiska,
 * japanska — alla helt översatta (UI-text). Eventbeskrivningar
 * (data/events/*.json) finns bara på sv/en; övriga språk visar den
 * engelska beskrivningen som reservval (se getEventBySlug/description-
 * hanteringen), eftersom att översätta 75+ faktatunga eventbeskrivningar
 * till fem språk inte går att göra tillförlitligt utan risk för fel.
 *
 * Disciplinnamnen (Street/Park/Vert/Bowl/osv) hålls medvetet på engelska
 * i ALLA språk — det är internationellt vedertagen skateboard-terminologi,
 * på samma sätt som "kickflip" eller "ollie" inte översätts.
 *
 * Så lägger du till ännu fler språk senare:
 *  1. Lägg till språkkoden i `locales` nedan.
 *  2. Skapa /messages/<kod>.json (kopiera messages/en.json som mall).
 *  3. Lägg till språknamnet i LOCALE_LABELS i LanguageSwitcher.tsx.
 * Resten av appen (routing, <html lang>, sitemap, hreflang) plockar
 * upp nya språk automatiskt via denna fil.
 */
export const locales = ['sv', 'en', 'de', 'fr', 'es', 'pt', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sv';
