'use client';

import { useMemo, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval
} from 'date-fns';
import { sv, enUS } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import type { SkateEvent } from '@/lib/schema';
import { getEventStatus } from '@/lib/events-shared';
import { useLiveNow } from '@/lib/useLiveNow';

const STATUS_DOT: Record<string, string> = {
  live: 'bg-live',
  upcoming: 'bg-spray',
  finished: 'bg-asphalt-600',
  cancelled: 'bg-chalk-500',
  postponed: 'bg-hazard'
};

export function CalendarView({ events, now }: { events: SkateEvent[]; now: string }) {
  const liveNow = useLiveNow(now);
  const locale = useLocale();
  const t = useTranslations();
  const dfLocale = locale === 'sv' ? sv : enUS;
  const [cursor, setCursor] = useState(() => new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1, locale: dfLocale });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1, locale: dfLocale });
    return eachDayOfInterval({ start, end });
  }, [cursor, dfLocale]);

  const eventsByDay = useMemo(() => {
    return days.map((day) =>
      events.filter((e) =>
        isWithinInterval(day, {
          start: new Date(new Date(e.startDate).toDateString()),
          end: new Date(new Date(e.endDate).toDateString())
        })
      )
    );
  }, [days, events]);

  const weekdayLabels = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1, locale: dfLocale });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
    });
  }, [dfLocale, locale]);

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          className="rounded-stamp border border-asphalt-700/30 p-1.5 hover:border-spray hover:text-spray dark:border-chalk-500/20"
          aria-label="Föregående månad"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-display text-xl capitalize tracking-tight">
          {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(cursor)}
        </h3>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          className="rounded-stamp border border-asphalt-700/30 p-1.5 hover:border-spray hover:text-spray dark:border-chalk-500/20"
          aria-label="Nästa månad"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-stamp border border-asphalt-700/20 bg-asphalt-700/20 dark:border-chalk-500/15 dark:bg-chalk-500/10">
        {weekdayLabels.map((wd) => (
          <div
            key={wd}
            className="bg-concrete-100 px-2 py-1.5 text-center font-mono-tight text-[10px] uppercase tracking-wide text-chalk-500 dark:bg-asphalt-900"
          >
            {wd}
          </div>
        ))}

        {days.map((day, i) => {
          const dayEvents = eventsByDay[i] ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'min-h-[86px] bg-concrete-100 p-1.5 dark:bg-asphalt-900',
                !inMonth && 'opacity-40'
              )}
            >
              <div
                className={clsx(
                  'mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full font-mono-tight text-[11px]',
                  isToday && 'bg-spray text-asphalt-950'
                )}
              >
                {day.getDate()}
              </div>
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <Link
                    key={event.slug}
                    href={`/events/${event.slug}`}
                    className="flex items-center gap-1 truncate rounded-sm px-1 py-0.5 font-mono-tight text-[10px] hover:bg-spray/10 hover:text-spray"
                    title={event.name}
                  >
                    <span
                      className={clsx(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        STATUS_DOT[getEventStatus(event, new Date(liveNow))]
                      )}
                    />
                    <span className="truncate">{event.name}</span>
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <span className="px-1 font-mono-tight text-[10px] text-chalk-500">
                    +{dayEvents.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
