import { ImageResponse } from 'next/og';
import { getAllEvents, getEventBySlug } from '@/lib/events';
import { formatDateRange } from '@/lib/date';
import { locales } from '@/i18n/config';

/**
 * Genererar en unik delningsbild per event vid build-tid (statisk export,
 * inga körtidsanrop). Next.js filkonvention: eftersom denna fil heter
 * "opengraph-image" i samma route-segment som page.tsx, kopplas den
 * AUTOMATISKT in i og:image/twitter:image — generateMetadata i page.tsx
 * behöver inte röras.
 *
 * Ingen extern font laddas här (skulle kräva ett nätverksanrop under
 * `next build`) — vi använder satoris inbyggda fallback-typsnitt för att
 * garantera att bygget aldrig failar pga ett otillgängligt typsnitt-CDN.
 */

export const alt = 'Skateboard Event Calendar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  const events = getAllEvents();
  return locales.flatMap((locale) => events.map((e) => ({ locale, slug: e.slug })));
}

export default function Image({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const event = getEventBySlug(slug);
  const dateStr = event ? formatDateRange(event, locale) : '';
  const location = event ? [event.location.city, event.location.country].filter(Boolean).join(', ') : '';
  const tag = event?.disciplines?.[0] ?? event?.category?.[0] ?? '';
  const metaLine = [location, dateStr].filter(Boolean).join('   ·   ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          backgroundColor: '#101012',
          backgroundImage: 'linear-gradient(135deg, #101012 0%, #1e1e22 100%)',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', width: 16, height: 16, backgroundColor: '#ff5a1f', borderRadius: 4 }} />
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#ff5a1f',
              fontWeight: 700
            }}
          >
            Skateboard Event Calendar
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {tag && (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: '#f5d90a',
                color: '#101012',
                padding: '8px 20px',
                borderRadius: 6,
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              {tag}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 1050,
              color: '#edeae2'
            }}
          >
            {event?.name ?? 'Skateboard Event'}
          </div>
          {metaLine && <div style={{ display: 'flex', fontSize: 30, color: '#cfcabb' }}>{metaLine}</div>}
        </div>
      </div>
    ),
    { ...size }
  );
}
