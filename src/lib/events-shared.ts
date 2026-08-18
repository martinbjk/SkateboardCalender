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
