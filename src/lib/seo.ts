import { locales } from '@/i18n/config';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';

/**
 * Korrekt `canonical` + reciprok `hreflang` (alla sju språk + x-default →
 * engelska) för en sida som finns på samtliga språk.
 *
 * `path` = sökvägen EFTER /<locale>/, med avslutande slash:
 *   ''                       → startsidan
 *   'about/'                 → /<locale>/about/
 *   'events/cph-open-2026/'  → /<locale>/events/cph-open-2026/
 *
 * Måste sättas per sida: en sidas egen `alternates` ersätter rot-layoutens
 * helt (Next slår inte ihop fältet), så ett språkkort i layouten kan aldrig
 * få rätt sökväg för undersidorna.
 */
export function localeAlternates(locale: string, path: string) {
  const at = (l: string) => `${SITE_URL}/${l}/${path}`;
  return {
    canonical: at(locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, at(l)])),
      'x-default': at('en')
    }
  };
}
