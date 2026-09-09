/**
 * INFO-MENYNS INNEHÅLL — sidorna i bottom-navens "Info"-sheet (samma som
 * footern listar). Hem och Artiklar är egna flikar i BottomNav och står
 * därför INTE här. Lägg till/ta bort sidor här, inget annat behöver ändras.
 *
 * Varje rad har ANTINGEN:
 *   - translationKey: en BEFINTLIG next-intl-nyckel (samma mönster som
 *     Footer.tsx redan använder) — visas översatt på alla 7 språk
 *   - label: en hårdkodad text — visas likadan oavsett språk. Använd bara
 *     tillfälligt, för sidor utan egen översättningsnyckel.
 */
export interface NavItem {
  href: string;
  translationKey?: string;
  label?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { translationKey: "disciplines.navTitle", href: "/disciplines" },
  { translationKey: "history.navTitle", href: "/history" },
  { translationKey: "about.title", href: "/about" },
  { translationKey: "contact.title", href: "/contact" },
  { translationKey: "privacy.title", href: "/privacy" },
];
