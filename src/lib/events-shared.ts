import type { SkateEvent } from './schema';

/**
 * Delad, beroendefri logik (ingen fs/path) — säker att importera från
 * BÅDE server- och klientkomponenter. Filläsningen (getAllEvents m.fl.)
 * bor i events.ts och är server-only.
 */

export type EventStatus = 'upcoming' | 'live' | 'finished' | 'cancelled' | 'postponed';

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
 * Bygger en Google Maps-länk för eventets plats. Använder riktiga
 * koordinater när vi har sådana (mer exakt — pekar rätt på arenan/parken).
 * Faller tillbaka på en vanlig textsökning (arena/stad/land) för den
 * fåtal event där lat/lng bara är en platshållare (0,0) eftersom vi
 * genuint inte visste exakt ort när eventet lades till — en textsökning
 * ger då ett rimligt resultat istället för att peka mitt ute i havet.
 */
export function googleMapsUrl(event: SkateEvent): string {
  const hasRealCoords =
    event.location.lat && event.location.lng && !(event.location.lat === 0 && event.location.lng === 0);
  if (hasRealCoords) {
    return `https://www.google.com/maps/search/?api=1&query=${event.location.lat},${event.location.lng}`;
  }
  const query = [event.location.venue, event.location.city, event.location.country].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
