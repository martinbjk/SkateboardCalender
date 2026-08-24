import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getAllEvents } from '@/lib/events';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skate-event-calendar.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const events = getAllEvents();
  const entries: MetadataRoute.Sitemap = [];

  // OBS: alla URL:er slutar medvetet med "/". Next.js statisk export
  // genererar varje sida som en mapp (t.ex. sv/index.html), och GitHub
  // Pages webbserver omdirigerar automatiskt "/sv" → "/sv/" om
  // snedstrecket saknas. Google räknade tidigare de omdirigeringarna som
  // ett strukturellt problem ("Sida med omdirigering" i Search Console)
  // — genom att peka direkt på den kanoniska URL:en med snedstreck slipper
  // Google en onödig extra omdirigering per sida.
  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/`,
      changeFrequency: 'daily',
      priority: 1
    });
    entries.push({
      url: `${SITE_URL}/${locale}/submit/`,
      changeFrequency: 'monthly',
      priority: 0.4
    });
    for (const event of events) {
      entries.push({
        url: `${SITE_URL}/${locale}/events/${event.slug}/`,
        lastModified: event.source?.retrievedAt,
        changeFrequency: 'weekly',
        priority: 0.7
      });
    }
  }

  return entries;
}
