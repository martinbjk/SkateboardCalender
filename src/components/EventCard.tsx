'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { SkateEvent } from '@/lib/schema';
import { getEventStatus, localizedCountryName } from '@/lib/events-shared';
import { useLiveNow } from '@/lib/useLiveNow';
import { formatDateRange } from '@/lib/date';
import { StatusTag } from './StatusTag';

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
  const status = getEventStatus(event, new Date(liveNow));
  const description = event.description[locale as 'sv' | 'en'] ?? event.description.en;
  const countryName = localizedCountryName(event.location.countryCode, locale, event.location.country);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-stamp border border-asphalt-700/30 bg-white/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-spray hover:shadow-lg dark:border-chalk-500/15 dark:bg-asphalt-900/60"
      >
        <div className="grip-texture pointer-events-none absolute inset-0 text-asphalt-900/[0.03] dark:text-chalk-100/[0.03]" />

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

        <p className="relative font-mono-tight text-sm text-chalk-500">
          {formatDateRange(event, locale)}
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
  );
}
