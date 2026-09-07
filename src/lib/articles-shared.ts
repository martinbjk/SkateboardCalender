/**
 * Rena hjälpfunktioner för artiklar — INGEN filsystemsåtkomst, så den
 * här filen är trygg att importera var som helst (även från
 * 'use client'-komponenter). Filläsning/validering ligger i
 * './articles.ts'.
 */

/**
 * Markdown-kroppen refererar bilder relativt filens egen mapp
 * (`![alt](./images/foo.png)`), men bilderna ligger faktiskt i
 * `public/images/articles/<slug>/foo.png` och serveras från
 * `/images/articles/<slug>/foo.png`. Den här funktionen skriver om
 * relativa sökvägar till den faktiskt serverade sökvägen. Redan
 * absoluta sökvägar (`/…`), externa URL:er och data-URI:er lämnas orörda.
 */
export function resolveArticleImage(src: string, slug: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/')) return src;
  const file = src.replace(/^\.\//, '').replace(/^images\//, '');
  return `/images/articles/${slug}/${file}`;
}

/** Publiceringsdatum (YYYY-MM-DD) formaterat för aktuell locale. */
export function formatArticleDate(date: string, locale: string): string {
  // Datumet har ingen tid/tidszon — tolka det som UTC-midnatt så att
  // ingen lokal tidszon kan knuffa det till dagen före.
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`));
}
