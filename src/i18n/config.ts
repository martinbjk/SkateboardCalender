/**
 * AKTIVA språk just nu: svenska + engelska (helt översatta).
 *
 * Så lägger du till fler språk senare (t.ex. es, pt, fr, de, ja):
 *  1. Lägg till språkkoden i `locales` nedan.
 *  2. Skapa /messages/<kod>.json (kopiera messages/en.json som mall).
 *  3. Lägg till landsflagga/label i LOCALE_LABELS i LanguageSwitcher.tsx.
 * Resten av appen (routing, <html lang>, sitemap, hreflang) är redan
 * byggd för att plocka upp nya språk automatiskt via denna fil.
 */
export const locales = ['sv', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sv';

// Språk som är förberedda i strukturen men inte aktiverade än
// (ingen messages/-fil finns, så de renderas inte förrän de läggs till ovan).
export const plannedLocales = ['es', 'pt', 'fr', 'de', 'ja'] as const;
