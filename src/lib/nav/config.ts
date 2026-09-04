/**
 * MENYINNEHÅLL — lägg till/ta bort sidor här, inget annat behöver ändras.
 *
 * Varje rad har ANTINGEN:
 *   - translationKey: en BEFINTLIG next-intl-nyckel (samma mönster som
 *     Footer.tsx redan använder) — visas översatt på alla 7 språk
 *   - label: en hårdkodad text — visas likadan oavsett språk. Använd
 *     bara detta tillfälligt, för sidor som ännu inte har en egen
 *     översättningsnyckel (som /articles just nu).
 */
export interface NavItem {
  href: string;
  translationKey?: string;
  label?: string;
}

export const NAV_ITEMS: NavItem[] = [
  // TODO: byt till translationKey (t.ex. "articles.navTitle") den dagen
  // /articles har en riktig, översatt sida istället för test-bilden.
  { label: "Articles", href: "/articles" },
  { translationKey: "disciplines.navTitle", href: "/disciplines" },
  { translationKey: "history.navTitle", href: "/history" },
  { translationKey: "about.title", href: "/about" },
  { translationKey: "contact.title", href: "/contact" },
  { translationKey: "privacy.title", href: "/privacy" },
];
