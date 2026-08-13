import fs from 'node:fs';
import path from 'node:path';
import { SkateEventSchema, type SkateEvent } from './schema';

export * from './events-shared';

const EVENTS_DIR = path.join(process.cwd(), 'data', 'events');

/**
 * SERVER-ONLY. Läser samtliga *.json-filer i /data/events, validerar dem
 * mot SkateEventSchema och returnerar en sorterad lista (tidigast först).
 * Ogiltiga filer kastar ett tydligt fel med filnamn, så CI
 * (validate-events.yml) eller `next build` misslyckas hellre än att
 * visa trasig data live.
 *
 * Importera ALDRIG denna fil från en 'use client'-komponent — den
 * använder node:fs. Klientkomponenter ska importera från
 * './events-shared' istället (t.ex. getEventStatus, ALL_CATEGORIES).
 */
export function getAllEvents(): SkateEvent[] {
  const files = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.json'));

  const events = files.map((file) => {
    const raw = fs.readFileSync(path.join(EVENTS_DIR, file), 'utf-8');
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Ogiltig JSON i data/events/${file}: ${(err as Error).message}`);
    }
    const result = SkateEventSchema.safeParse(json);
    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n');
      throw new Error(`Schema-fel i data/events/${file}:\n${issues}`);
    }
    if (result.data.slug !== file.replace(/\.json$/, '')) {
      throw new Error(
        `data/events/${file}: "slug" (${result.data.slug}) matchar inte filnamnet.`
      );
    }
    return result.data;
  });

  return events.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export function getEventBySlug(slug: string): SkateEvent | undefined {
  return getAllEvents().find((e) => e.slug === slug);
}
