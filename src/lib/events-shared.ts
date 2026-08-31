import type { SkateEvent } from './schema';

/**
 * Delad, beroendefri logik (ingen fs/path) — säker att importera från
 * BÅDE server- och klientkomponenter. Filläsningen (getAllEvents m.fl.)
 * bor i events.ts och är server-only.
 */

export type EventStatus = 'upcoming' | 'live' | 'finished' | 'cancelled' | 'postponed';

/**
 * Härleder landsnamnet på RÄTT språk från den redan existerande
 * `countryCode` (ISO 3166-1, t.ex. "CA", "SE", "JP") istället för att
 * lita på det fritt inskrivna `country`-fältet i data/events/*.json.
 * Anledning: en genomgång (aug 2026) visade att 34 av 89 eventfiler har
 * landsnamnet hårdkodat på svenska (t.ex. "Kanada", "Tyskland") — vilket
 * visades fel i ALLA språkversioner, inte bara de svenska. Med denna
 * funktion är countryCode den enda sanningskällan, så nya event behöver
 * aldrig få landsnamnet manuellt översatt igen.
 * Faller tillbaka till det inskrivna `country`-fältet om countryCode
 * saknas eller är ogiltig (t.ex. "TBD"-platshållare för okänd plats).
 */
export function localizedCountryName(countryCode: string | undefined, locale: string, fallback: string): string {
  if (!countryCode || countryCode.length !== 2) return fallback;
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode.toUpperCase()) ?? fallback;
  } catch {
    return fallback;
  }
}

export function getEventStatus(event: SkateEvent, now: Date = new Date()): EventStatus {
  if (event.statusOverride) return event.statusOverride;
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();
  const t = now.getTime();
  if (t < start) return 'upcoming';
  if (t > end) return 'finished';
  return 'live';
}

export const ALL_CATEGORIES = [
  'street',
  'park',
  'vert',
  'bowl',
  'freestyle',
  'downhill',
  'slalom',
  'demo',
  'contest'
] as const;

export const ALL_LEVELS = ['amateur', 'pro', 'open', 'youth'] as const;

export const ALL_CONTINENTS = [
  'africa',
  'asia',
  'europe',
  'north-america',
  'south-america',
  'oceania'
] as const;

/**
 * Bygger en Google Maps-länk för eventets plats.
 *
 * Prioritetsordning (medvetet i den här ordningen, inte tvärtom):
 *  1. Om vi har ett RIKTIGT venue-namn (inte "TBD" i någon variant) —
 *     textsökning på "venue, stad, land". Google Maps hittar då själv
 *     den exakta anläggningen/parken via namnet, vilket är mycket
 *     precisare än våra sparade koordinater — de flesta av dem är bara
 *     stadens ungefärliga mittpunkt, inte den faktiska tävlingsplatsen
 *     (vi har sällan slagit upp exakta arena-koordinater när filerna
 *     skapades).
 *  2. Annars, om vi har riktiga koordinater (inte platshållaren 0,0) —
 *     använd dem. Bättre än inget när venue genuint är okänt.
 *  3. Sista utväg: textsökning på bara stad + land.
 */
/**
 * Sant om vi vet NÅGOT om eventets plats — antingen ett riktigt
 * venue-namn, eller en riktig stad (inte bara "TBD" båda vägar). Används
 * för att avgöra om en Google Maps-länk är meningsfull att visa —
 * annars hade den bara skickat besökaren till en meningslös sökning på
 * bokstavligen "TBD, TBD" för de fåtal event (t.ex. ISSA:s distribuerade
 * lopp-format) där ingen enskild plats finns.
 */
export function locationIsKnown(event: SkateEvent): boolean {
  const venue = event.location.venue?.trim();
  const city = event.location.city?.trim();
  const hasRealVenue = venue && !/^tbd\b/i.test(venue);
  const hasRealCity = city && !/^tbd\b/i.test(city);
  return Boolean(hasRealVenue || hasRealCity);
}

export function googleMapsUrl(event: SkateEvent): string {
  const venue = event.location.venue?.trim();
  const hasRealVenue = venue && !/^tbd\b/i.test(venue);
  if (hasRealVenue) {
    const query = [venue, event.location.city, event.location.country].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  const hasRealCoords =
    event.location.lat && event.location.lng && !(event.location.lat === 0 && event.location.lng === 0);
  if (hasRealCoords) {
    return `https://www.google.com/maps/search/?api=1&query=${event.location.lat},${event.location.lng}`;
  }

  const query = [event.location.city, event.location.country].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
