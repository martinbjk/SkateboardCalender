import { z } from 'zod';

/**
 * Källa till sanning för ett events data-struktur.
 * Alla filer i /data/events/*.json valideras mot detta schema,
 * både lokalt (npm run validate-events) och i CI via
 * .github/workflows/validate-events.yml
 */

export const EventCategory = z.enum([
  'street',
  'park',
  'vert',
  'bowl',
  'freestyle',
  'downhill',
  'slalom',
  'demo',
  'contest'
]);
export type EventCategory = z.infer<typeof EventCategory>;

export const EventLevel = z.enum(['amateur', 'pro', 'open', 'youth']);
export type EventLevel = z.infer<typeof EventLevel>;

export const EventStatusOverride = z.enum(['cancelled', 'postponed']).optional();

export const LocalizedText = z.object({
  sv: z.string().min(1),
  en: z.string().min(1)
});
export type LocalizedText = z.infer<typeof LocalizedText>;

export const SkateEventSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug får bara innehålla a-z, 0-9 och bindestreck'),
  name: z.string().min(1),
  series: z.string().optional(), // t.ex. "SLS Championship Tour", "X Games League"
  category: z.array(EventCategory).min(1),
  level: EventLevel,
  startDate: z.string().datetime({ offset: true }), // ISO 8601 med tidszon
  endDate: z.string().datetime({ offset: true }),
  timezone: z.string().min(1), // IANA tz, t.ex. "America/Los_Angeles"
  location: z.object({
    venue: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().length(2),
    continent: z.enum([
      'africa',
      'asia',
      'europe',
      'north-america',
      'south-america',
      'oceania'
    ]),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional()
  }),
  description: LocalizedText,
  officialUrl: z.string().url().optional(),
  registrationUrl: z.string().url().optional(),
  ticketsUrl: z.string().url().optional(),
  image: z.string().optional(),
  organizer: z.string().optional(),
  disciplines: z.array(z.string()).optional(),
  statusOverride: EventStatusOverride,
  source: z.object({
    note: z.string().optional(),
    url: z.string().url().optional(),
    retrievedAt: z.string().datetime({ offset: true }).optional()
  }).optional(),
  submittedBy: z.string().optional() // GitHub-användarnamn för community-inskick
});

export type SkateEvent = z.infer<typeof SkateEventSchema>;

export const BannerSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url(),
  linkUrl: z.string().url(),
  alt: z.string(),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  priority: z.number().int().min(1).max(10).default(5),
  position: z.enum(['header', 'sidebar', 'in-feed', 'sticky-mobile'])
});
export type Banner = z.infer<typeof BannerSchema>;
