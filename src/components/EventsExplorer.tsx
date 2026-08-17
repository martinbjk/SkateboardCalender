'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutList, CalendarDays, Search, X } from 'lucide-react';
import clsx from 'clsx';
import type { SkateEvent } from '@/lib/schema';
import { ALL_CATEGORIES, ALL_LEVELS, ALL_CONTINENTS } from '@/lib/events-shared';
import { EventCard } from './EventCard';
import { CalendarView } from './CalendarView';

type ViewMode = 'list' | 'calendar';

export function EventsExplorer({ events, now }: { events: SkateEvent[]; now: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const [view, setView] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [continent, setContinent] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (category && !e.category.includes(category as never)) return false;
      if (level && e.level !== level) return false;
      if (continent && e.location.continent !== continent) return false;
      if (q) {
        const haystack = [
          e.name,
          e.series ?? '',
          e.location.city,
          e.location.country,
          e.description[locale as 'sv' | 'en'] ?? e.description.en
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [events, search, category, level, continent, locale]);

  const hasActiveFilters = Boolean(search || category || level || continent);

  function clearFilters() {
    setSearch('');
    setCategory(null);
    setLevel(null);
    setContinent(null);
  }

  return (
    <div>
      {/* Sök + vy-växlare */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-chalk-500"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('filters.search')}
            className="w-full rounded-stamp border border-asphalt-700/30 bg-white/70 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-chalk-500 focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
          />
        </div>

        <div className="flex items-center gap-1 self-start rounded-stamp border border-asphalt-700/30 p-1 dark:border-chalk-500/20">
          <ViewButton active={view === 'list'} onClick={() => setView('list')} icon={<LayoutList size={15} />}>
            {t('view.list')}
          </ViewButton>
          <ViewButton
            active={view === 'calendar'}
            onClick={() => setView('calendar')}
            icon={<CalendarDays size={15} />}
          >
            {t('view.calendar')}
          </ViewButton>
        </div>
      </div>

      {/* Filterchips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterGroup
          label={t('filters.category')}
          options={ALL_CATEGORIES}
          value={category}
          onChange={setCategory}
          translatePrefix="category"
        />
        <FilterGroup
          label={t('filters.level')}
          options={ALL_LEVELS}
          value={level}
          onChange={setLevel}
          translatePrefix="level"
        />
        <FilterGroup
          label={t('filters.continent')}
          options={ALL_CONTINENTS}
          value={continent}
          onChange={setContinent}
          translatePrefix="continent"
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-stamp px-2.5 py-1.5 font-mono-tight text-xs text-spray hover:underline"
          >
            <X size={13} />
            {t('filters.clear')}
          </button>
        )}
      </div>

      <p className="mt-4 font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
        {t('filters.resultsCount', { count: filtered.length })}
      </p>

      {/* Resultat */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-chalk-500">{t('filters.noResults')}</p>
      ) : view === 'list' ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            <EventCard key={event.slug} event={event} index={i} now={now} />
          ))}
        </div>
      ) : (
        <CalendarView events={filtered} now={now} />
      )}
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  icon,
  children
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-mono-tight text-xs uppercase tracking-wide transition',
        active ? 'bg-spray text-asphalt-950' : 'text-current opacity-60 hover:opacity-100'
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function FilterGroup<T extends readonly string[]>({
  label,
  options,
  value,
  onChange,
  translatePrefix
}: {
  label: string;
  options: T;
  value: string | null;
  onChange: (v: string | null) => void;
  translatePrefix: string;
}) {
  const t = useTranslations();
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        aria-label={label}
        className={clsx(
          'appearance-none rounded-stamp border px-3 py-1.5 pr-7 font-mono-tight text-xs uppercase tracking-wide outline-none transition',
          value
            ? 'border-spray bg-spray/10 text-spray'
            : 'border-asphalt-700/30 bg-transparent text-current dark:border-chalk-500/20'
        )}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {t(`${translatePrefix}.${opt}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
