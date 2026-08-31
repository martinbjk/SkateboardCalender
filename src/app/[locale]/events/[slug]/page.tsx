import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapPin, ExternalLink, Ticket, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getAllEvents, getEventBySlug, getEventStatus } from '@/lib/events';
import { googleMapsUrl, locationIsKnown, localizedCountryName } from '@/lib/events-shared';
import { formatDateRange, formatTime } from '@/lib/date';
import { StatusTag } from '@/components/StatusTag';
import { AddToCalendar } from '@/components/AddToCalendar';
import { ShareButton } from '@/components/ShareButton';

export function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const event = getEventBySlug(slug);
  if (!event) return {};
  const rawDescription = event.description[locale as keyof typeof event.description] ?? event.description.en;
  // Lägger till en kort uppmaning som lovar KONKRET extra värde vid
  // klick (kartlänk, anmälan, fler detaljer) — utan den ser Google-
  // sökaren redan datum/plats via strukturerad data i själva
  // sökresultatet och har ingen tydlig anledning att klicka vidare.
  const t = await getTranslations({ locale, namespace: 'meta' });
  const dateRange = formatDateRange(event, locale);
  const countryName = localizedCountryName(event.location.countryCode, locale, event.location.country);
  const location = [event.location.city, countryName].filter(Boolean).join(', ');
  // Konkreta fakta (plats + datum) rakt i beskrivningen, så den matchar
  // vad folk faktiskt sökt efter — inte bara en generisk uppmaning.
  const facts = t('metaFacts', { location, date: dateRange });
  const description = `${rawDescription} ${facts}${t('eventCta')}`;
  // Datum i <title> hjälper sökträffen matcha "[event] [stad] [datum]"-
  // sökningar. Ingen separat stad här — eventnamnet innehåller den redan
  // i de allra flesta fall (t.ex. "The Bunt Jam – Toronto").
  const title = `${event.name} (${dateRange})`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';
  const pageUrl = `${siteUrl}/${locale}/events/${slug}/`;
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    // OG-titeln hålls ren (bara eventnamnet) — delningsbilden (se
    // opengraph-image.tsx) visar redan datum/plats visuellt, så att
    // upprepa det i textraden här är överflödigt för sociala kort.
    openGraph: { title: event.name, description, url: pageUrl, type: 'article' }
  };
}

function eventJsonLd(event: ReturnType<typeof getEventBySlug>, locale: string, siteUrl: string) {
  if (!event) return null;
  const description = event.description[locale as keyof typeof event.description] ?? event.description.en;
  // "Okänd" (och liknande platshållarvärden) betyder i praktiken att vi
  // inte har en riktig arrangör — behandla det som inget värde alls i
  // stället för att skicka blandspråkig text som "Okänd athletes" till
  // Google. Riktig fix är att uppdatera själva datafilen, men detta skydd
  // finns kvar även om fler filer skulle råka få samma platshållare.
  const UNKNOWN_VALUES = new Set(['okänd', 'unknown', 'n/a', '-', '']);
  const hasRealOrganizer = event.organizer && !UNKNOWN_VALUES.has(event.organizer.trim().toLowerCase());
  const offerUrl = event.ticketsUrl ?? event.registrationUrl ?? event.officialUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description,
    url: `${siteUrl}/${locale}/events/${event.slug}/`,
    image: [event.image || `${siteUrl}/og-image.png`],
    location: {
      '@type': 'Place',
      name: event.location.venue || event.location.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location.city,
        addressCountry: event.location.countryCode
      },
      ...(event.location.lat && event.location.lng
        ? { geo: { '@type': 'GeoCoordinates', latitude: event.location.lat, longitude: event.location.lng } }
        : {})
    },
    performer: {
      '@type': 'PerformingGroup',
      name: hasRealOrganizer ? `${event.organizer} athletes` : 'Professional skateboarders'
    },
    ...(hasRealOrganizer
      ? {
          organizer: {
            '@type': 'Organization',
            name: event.organizer,
            url: event.officialUrl ?? siteUrl
          }
        }
      : {}),
    ...(offerUrl
      ? {
          offers: {
            '@type': 'Offer',
            url: offerUrl,
            availability: 'https://schema.org/InStock'
          }
        }
      : {}),
    ...(event.officialUrl ? { sameAs: event.officialUrl } : {})
  };
}

export default async function EventPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const event = getEventBySlug(slug);
  if (!event) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const status = getEventStatus(event);
  const description = event.description[locale as keyof typeof event.description] ?? event.description.en;
  const countryName = localizedCountryName(event.location.countryCode, locale, event.location.country);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';
  const jsonLd = eventJsonLd(event, locale, siteUrl);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {jsonLd && (
        // eslint-disable-next-line react/no-danger -- JSON-LD kräver rå script-injektion, ingen brukarindata renderas som HTML
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <Link href="/" className="font-mono-tight text-xs uppercase tracking-wide text-chalk-500 hover:text-spray">
        ← {t('event.backToCalendar')}
      </Link>

      <div className="mt-5 flex items-center gap-3">
        <StatusTag status={status} />
        {event.series && <span className="text-sm text-chalk-500">{event.series}</span>}
      </div>

      <h1 className="font-display mt-3 text-4xl leading-[1.02] tracking-tight sm:text-5xl">
        {event.name}
      </h1>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono-tight text-sm text-asphalt-800 dark:text-chalk-300">
        {locationIsKnown(event) ? (
          <a
            href={googleMapsUrl(event)}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 text-spray underline decoration-spray/40 underline-offset-2 transition hover:decoration-spray"
          >
            <MapPin size={14} className="text-spray" />
            {event.location.venue}, {event.location.city}, {countryName}
            <ExternalLink size={12} className="text-spray" />
          </a>
        ) : (
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-spray" />
            {event.location.venue}, {event.location.city}, {countryName}
          </span>
        )}
        <span>{formatDateRange(event, locale)}</span>
        <span>
          {formatTime(event.startDate, event.timezone, locale)}–
          {formatTime(event.endDate, event.timezone, locale)} ({event.timezone.split('/').pop()?.replace('_', ' ')})
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {event.category.map((c) => (
          <span
            key={c}
            className="rounded-sm border border-asphalt-700/25 px-2.5 py-1 font-mono-tight text-xs uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20"
          >
            {t(`category.${c}`)}
          </span>
        ))}
        <span className="rounded-sm bg-hazard/20 px-2.5 py-1 font-mono-tight text-xs uppercase tracking-wide text-hazard-dark dark:text-hazard">
          {t(`level.${event.level}`)}
        </span>
      </div>

      <p className="mt-8 max-w-2xl text-base leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {description}
      </p>

      {event.disciplines && event.disciplines.length > 0 && (
        <div className="mt-6">
          <h2 className="font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
            {t('event.disciplines')}
          </h2>
          <p className="mt-1 text-sm">{event.disciplines.join(' · ')}</p>
        </div>
      )}

      {event.organizer && (
        <div className="mt-4 flex items-center gap-2 text-sm text-chalk-500">
          <Users size={14} />
          {t('event.organizer')}: {event.organizer}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <AddToCalendar event={event} />
        <ShareButton url={`${siteUrl}/${locale}/events/${event.slug}/`} title={event.name} />

        {event.officialUrl && (
          <LinkButton href={event.officialUrl} icon={<ExternalLink size={15} />}>
            {t('event.officialSite')}
          </LinkButton>
        )}
        {event.registrationUrl && (
          <LinkButton href={event.registrationUrl} icon={<Users size={15} />}>
            {t('event.register')}
          </LinkButton>
        )}
        {event.ticketsUrl && (
          <LinkButton href={event.ticketsUrl} icon={<Ticket size={15} />}>
            {t('event.tickets')}
          </LinkButton>
        )}
      </div>

      {/* Reserverad plats för framtida sponsrad banner-placering (ej aktiv i denna version) */}
      <div className="mt-10 flex items-center justify-center rounded-stamp border border-dashed border-asphalt-700/25 py-6 font-mono-tight text-xs uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20">
        {t('event.sponsoredSlot')}
      </div>

      {event.source?.url && (
        <p className="mt-6 text-xs text-chalk-500">
          {t('event.source')}:{' '}
          <a href={event.source.url} target="_blank" rel="noreferrer noopener" className="underline hover:text-spray">
            {event.source.url}
          </a>
        </p>
      )}
    </div>
  );
}

function LinkButton({
  href,
  icon,
  children
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-2 rounded-stamp border border-asphalt-700/30 px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide transition hover:border-spray hover:text-spray dark:border-chalk-500/20"
    >
      {icon}
      {children}
    </a>
  );
}
