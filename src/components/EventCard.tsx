'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import type { SkateEvent } from '@/lib/schema';
import { getEventStatus, getCountdown, localizedCountryName } from '@/lib/events-shared';
import { useLiveNow } from '@/lib/useLiveNow';
import { formatDateRange } from '@/lib/date';
import { StatusTag } from './StatusTag';

/**
 * Universell tilt/djup-gräns för ALLA ~80 kort — samma vinkel överallt,
 * ingen per-kort-specialisering. Håller sig inom kravet 2–4°.
 */
const TILT_DEGREES = 3;

export function EventCard({
  event,
  index = 0,
  now
}: {
  event: SkateEvent;
  index?: number;
  now: string;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const liveNow = useLiveNow(now);
  const nowDate = new Date(liveNow);
  const status = getEventStatus(event, nowDate);
  const countdown = status === 'upcoming' ? getCountdown(event, nowDate) : null;
  const description = event.description[locale as 'sv' | 'en'] ?? event.description.en;
  const countryName = localizedCountryName(event.location.countryCode, locale, event.location.country);

  // Databaserat, universellt: samma tre lägen härledda direkt från
  // getEventStatus (start-/slutdatum) för alla event, ingen speciallogik
  // per kort.
  const isEnded = status === 'finished' || status === 'cancelled';
  const isLive = status === 'live';

  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Tilt-on-press/touch (mus: följer pekaren inom kortet, bara transform
  // — inga layout-triggande egenskaper, så det är billigt även på 80
  // kort samtidigt i DOM:en). Avstängt helt om användaren har
  // "reducera rörelse" aktiverat i OS:et.
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * TILT_DEGREES * 2);
    rotateX.set((0.5 - py) * TILT_DEGREES * 2);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      style={{ perspective: 900 }}
      className="h-full"
    >
      {/* Andra lagret hanterar tilt/hover/press separat från
          scroll-in-animationen ovan — annars skulle de två animationerna
          (som båda styr transform) krocka med varandra. */}
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        whileHover={prefersReducedMotion ? undefined : { y: -4 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985, rotateX: -2, rotateY: 2 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        <Link
          href={`/events/${event.slug}`}
          className={clsx(
            'group relative flex h-full flex-col overflow-hidden rounded-stamp border border-asphalt-700/30 bg-white/60 p-5 shadow-card transition-[box-shadow,border-color] duration-200 hover:border-spray hover:shadow-card-hover dark:border-chalk-500/15 dark:bg-asphalt-900/60 dark:shadow-card-dark dark:hover:shadow-card-hover-dark',
            // "Avslutat/Inställt": urblekt (universellt via en enda
            // saturate/kontrast-klass, ingen bild- eller per-kort-hantering)
            isEnded && 'saturate-[0.3] contrast-[0.94]',
            // "Live": mjuk grön glöd runt hela kortet, utöver den
            // pulserande punkten i StatusTag — samma klass för alla
            // live-kort.
            isLive && 'shadow-live-ring dark:shadow-live-ring'
          )}
        >
          {/* Lager 1: bakgrundstextur (djupast bak) */}
          <div className="grip-texture pointer-events-none absolute inset-0 text-asphalt-900/[0.03] dark:text-chalk-100/[0.03]" />

          {/* Lager 2 (mellanlager): rubrik/metadata-innehåll — "relative"
              lyfter det ovanför bakgrundstexturen (lager 1) i z-ordning,
              vilket ger den skiktade djup-känslan som efterfrågades. */}
          <div className="relative flex items-start justify-between gap-3">
            <StatusTag status={status} />
            <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
              {event.location.continent && t(`continent.${event.location.continent}`)}
            </span>
          </div>

          <h3 className="font-display relative mt-3 text-2xl leading-[1.05] tracking-tight text-asphalt-900 group-hover:text-spray dark:text-chalk-100">
            {event.name}
          </h3>

          {event.series && (
            <p className="relative mt-1 text-xs text-chalk-500">{event.series}</p>
          )}

          <p className="relative mt-3 flex items-center gap-1.5 font-mono-tight text-sm text-asphalt-800 dark:text-chalk-300">
            <MapPin size={14} className="shrink-0 text-spray" />
            {event.location.city}, {countryName}
          </p>

          <p className="relative flex flex-wrap items-center gap-x-2 font-mono-tight text-sm text-chalk-500">
            {formatDateRange(event, locale)}
            {/* "Kommande"-nedräkning — databaserad (start minus nu),
                samma logik/formatering för alla kort. Bytt automatiskt
                till timmar under 48 h kvar, annars dagar. */}
            {countdown && (
              <span className="rounded-sm bg-spray/15 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-spray-dark dark:text-spray-light">
                {countdown.unit === 'hours'
                  ? t('status.inHours', { hours: countdown.value })
                  : countdown.unit === 'tomorrow'
                    ? t('status.tomorrow')
                    : t('status.inDays', { days: countdown.value })}
              </span>
            )}
          </p>

          <p className="relative mt-3 line-clamp-2 flex-1 text-sm text-asphalt-800/80 dark:text-chalk-300/80">
            {description}
          </p>

          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {event.category.map((c) => (
              <span
                key={c}
                className="rounded-sm border border-asphalt-700/25 px-2 py-0.5 font-mono-tight text-[10px] uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20"
              >
                {t(`category.${c}`)}
              </span>
            ))}
            <span className="rounded-sm bg-hazard/20 px-2 py-0.5 font-mono-tight text-[10px] uppercase tracking-wide text-hazard-dark dark:text-hazard">
              {t(`level.${event.level}`)}
            </span>
          </div>

          {/* Tydlig visuell signal om att kortet leder till mer information
              (fullständig beskrivning, karta, anmälan, källa osv.) — annars
              kan hela kortets innehåll uppfattas som "allt som finns",
              eftersom namn/plats/datum/kort beskrivning redan syns här. */}
          <div className="relative mt-4 flex items-center gap-1 border-t border-asphalt-700/10 pt-3 font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500 transition group-hover:text-spray dark:border-chalk-500/10">
            {t('event.viewDetails')}
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
