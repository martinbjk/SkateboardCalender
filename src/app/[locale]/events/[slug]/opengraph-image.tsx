import { ImageResponse } from 'next/og';
import { getAllEvents, getEventBySlug } from '@/lib/events';
import { formatDateRange } from '@/lib/date';
import { localizedCountryName } from '@/lib/events-shared';
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
 *
 * OBS: lucide-react (sajtens vanliga ikonbibliotek) funkar INTE här —
 * testat och bekräftat att satori (motorn bakom ImageResponse) inte kan
 * rendera dess forwardRef-baserade komponenter (renderas som helt tomma).
 * Därför egna små SVG-ikoner nedan, i samma visuella stil, byggda av
 * rena <svg>/<path>-element som satori stöder direkt.
 */

function PinIcon({ size = 28, color = '#ff5a1f' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

function CalendarIcon({ size = 28, color = '#ff5a1f' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={3} y={4} width={18} height={18} rx={2} />
      <line x1={16} y1={2} x2={16} y2={6} />
      <line x1={8} y1={2} x2={8} y2={6} />
      <line x1={3} y1={10} x2={21} y2={10} />
    </svg>
  );
}

/**
 * satori (motorn bakom ImageResponse) stöder INTE CSS
 * "repeating-linear-gradient" — bygger därför samma rand-mönster manuellt
 * som en vanlig linear-gradient med hårda färgstopp i par (samma
 * standardteknik för "hårda" stopp utan mjuk övertoning).
 */
function stripeGradient(containerSize: number, stripeSize: number, colorA: string, colorB: string): string {
  const stops: string[] = [];
  let pos = 0;
  let i = 0;
  while (pos < containerSize) {
    const color = i % 2 === 0 ? colorA : colorB;
    const startPct = (pos / containerSize) * 100;
    const endPct = (Math.min(pos + stripeSize, containerSize) / containerSize) * 100;
    stops.push(`${color} ${startPct}%`);
    stops.push(`${color} ${endPct}%`);
    pos += stripeSize;
    i++;
  }
  return `linear-gradient(45deg, ${stops.join(', ')})`;
}

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
  const countryName = event ? localizedCountryName(event.location.countryCode, locale, event.location.country) : '';
  const location = event ? [event.location.city, countryName].filter(Boolean).join(', ') : '';
  const tag = event?.disciplines?.[0] ?? event?.category?.[0] ?? '';

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
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Hazard-stripe-hörn (samma gul-svarta varningsrandsmönster som
            sajtens "hazardstripe"-bakgrund) — ger en skatepark-skylt-känsla
            i hörnet utan att störa läsbarheten på texten. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -90,
            right: -90,
            width: 260,
            height: 260,
            transform: 'rotate(45deg)',
            backgroundImage: stripeGradient(260, 16, '#f5d90a', '#101012'),
            opacity: 0.9
          }}
        />

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

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PinIcon size={28} color="#ff5a1f" />
                <div style={{ display: 'flex', fontSize: 30, color: '#cfcabb' }}>{location}</div>
              </div>
            )}
            {dateStr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarIcon size={28} color="#ff5a1f" />
                <div style={{ display: 'flex', fontSize: 30, color: '#cfcabb' }}>{dateStr}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
