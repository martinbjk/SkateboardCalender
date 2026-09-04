/**
 * MENYINNEHÅLL — lägg till/ta bort sidor här, inget annat behöver ändras.
 * `label` visas i menyn, `href` är sökvägen (utan språkprefix — er
 * routing sköter redan i18n baserat på tidigare beslut om 7 språk).
 *
 * OBS: Artiklar-sidan var senast admin-only och väntade på sin första
 * riktiga artikel innan den skulle driftsättas — ta bort/kommentera
 * bort raden nedan om den fortfarande inte är publik än.
 */
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Artiklar", href: "/articles" },
  { label: "Discipliner", href: "/disciplines" },
  { label: "Historia", href: "/history" },
  { label: "Om oss", href: "/about" },
  { label: "Kontakt", href: "/contact" },
  { label: "Integritetspolicy", href: "/privacy" },
];
