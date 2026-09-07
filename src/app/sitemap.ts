import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getAllEvents } from '@/lib/events';
import { getAllArticles } from '@/lib/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skate-event-calendar.vercel.app';

/**
 * Språkkluster för en sida som finns på alla sju språk. `path` är
 * sökvägen EFTER /<locale>/ med avslutande slash ('' = startsidan,
 * 'submit/', 'articles/foo/', 'events/foo/'). Speglar sidans egen
 * hreflang i <head> (se lib/seo.ts) — Next skriver ut det som
 * <xhtml:link rel="alternate" hreflang="…"> på varje <url>-post, så
 * Google ser språkversionerna som ETT kluster i stället för orelaterade
 * dubbletter.
 */
function languageAlternates(path: string): { languages: Record<string, string> } {
  const at = (l: string) => `${SITE_URL}/${l}/${path}`;
  return {
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, at(l)])),
      'x-default': at('en')
    }
  };
}

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
      priority: 1,
      alternates: languageAlternates('')
    });
    entries.push({
      url: `${SITE_URL}/${locale}/submit/`,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: languageAlternates('submit/')
    });
    entries.push({
      url: `${SITE_URL}/${locale}/articles/`,
      changeFrequency: 'weekly',
      priority: 0.5,
      alternates: languageAlternates('articles/')
    });
    for (const article of getAllArticles(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/articles/${article.slug}/`,
        lastModified: article.date,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: languageAlternates(`articles/${article.slug}/`)
      });
    }
    for (const event of events) {
      entries.push({
        url: `${SITE_URL}/${locale}/events/${event.slug}/`,
        lastModified: event.source?.retrievedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: languageAlternates(`events/${event.slug}/`)
      });
    }
  }

  return entries;
}
