/**
 * MENYINNEHÅLL — lägg till/ta bort sidor här, inget annat behöver ändras.
 * `translationKey` är en BEFINTLIG next-intl-nyckel (samma som Footer.tsx
 * redan använder för samma sidor) — INTE en ny nyckel jag hittat på.
 * `href` är sökvägen (utan språkprefix — @/i18n/navigation sköter det).
 *
 * OBS om "Artiklar": ingen rad för /articles här, eftersom sidan inte
 * var publik än (admin-only, väntade på första riktiga artikeln) och
 * inte heller ligger i Footer.tsx. Lägg till en rad här (med rätt
 * översättningsnyckel, kolla vad artikel-sidan faktiskt använder) den
 * dagen sidan blir publik.
 */
export interface NavItem {
  translationKey: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { translationKey: "disciplines.navTitle", href: "/disciplines" },
  { translationKey: "history.navTitle", href: "/history" },
  { translationKey: "about.title", href: "/about" },
  { translationKey: "contact.title", href: "/contact" },
  { translationKey: "privacy.title", href: "/privacy" },
];
