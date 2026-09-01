'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutList, CalendarDays, Search, X, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import type { SkateEvent } from '@/lib/schema';
import { ALL_CATEGORIES, ALL_LEVELS, ALL_CONTINENTS, getEventStatus } from '@/lib/events-shared';
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

  // Länkar från discipliner-guiden ("Se kommande Vert-event") kan förfylla
  // kategorifiltret via ?category=vert i URL:en. Läses manuellt via
  // window.location EFTER mount (i en effect), inte med Next.js egna
  // useSearchParams() — den hooken kräver en Suspense-gräns i statisk
  // export, vilket fick hela kalendern att sluta serverrenderas (byggd
  // HTML blev tom, "kalendern helt dold" tills klienten hann rita om
  // allt, och kraschade den ritningen syntes ingenting alls). Detta sätt
  // håller komponenten helt vanlig — server-HTML:en är komplett direkt,
  // och filtret sätts bara som en liten förbättring om parametern finns.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('category');
    if (initial && (ALL_CATEGORIES as readonly string[]).includes(initial)) {
      setCategory(initial);
    }
  }, []);

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

  // Listan sorteras kronologiskt äldst-först (se getAllEvents), vilket
  // annars innebär att besökaren först möts av flera månaders redan
  // avslutade event innan dagens/kommande dyker upp. Skrolla automatiskt
  // fram till det första ej-avslutade eventet — men bara EN gång vid
  // första sidladdningen, inte varje gång filtren ändras (annars hade
  // vyn hoppat omkring på ett förvirrande sätt medan man söker/filtrerar).
  const firstUpcomingIndex = useMemo(
    () => filtered.findIndex((e) => getEventStatus(e, new Date(now)) !== 'finished'),
    [filtered, now]
  );
  const firstUpcomingRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolled = useRef(false);

  useEffect(() => {
    if (hasAutoScrolled.current) return;
    if (view !== 'list') return;
    if (firstUpcomingIndex <= 0) {
      // Redan överst (eller inget ej-avslutat event hittades) — inget att göra.
      hasAutoScrolled.current = true;
      return;
    }
    if (firstUpcomingRef.current) {
      firstUpcomingRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      hasAutoScrolled.current = true;
    }
  }, [firstUpcomingIndex, view]);

  function clearFilters() {
    setSearch('');
    setCategory(null);
    setLevel(null);
    setContinent(null);
  }

  return (
    <div>
      {/* Klibbig sök/filter-sektion, fäst direkt under headern (som också
          är sticky). Utan detta hamnar filtren ovanför skärmen så fort man
          scrollar ner i listan — särskilt märkbart på mobil efter att
          sidan automatiskt hoppat fram till dagens/kommande event. */}
      <div className="sticky top-[60px] z-30 -mx-4 bg-concrete-100/95 px-4 pb-3 pt-2 backdrop-blur sm:-mx-6 sm:px-6 dark:bg-asphalt-950/95">
        {/* Sök + vy-växlare — samma rad överallt (tidigare staplat på
            mobil) för en kompaktare header. ViewButton döljer sin text
            under sm-brytpunkten (bara ikon) så raden får plats utan att
            klämmas ihop på smala skärmar. */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
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

          <div className="flex shrink-0 items-center gap-1.5 rounded-stamp border border-asphalt-700/25 bg-asphalt-800/[0.04] p-1.5 shadow-sm dark:border-chalk-500/15 dark:bg-chalk-500/[0.04]">
            <ViewButton active={view === 'list'} onClick={() => setView('list')} icon={<LayoutList size={16} />}>
              {t('view.list')}
            </ViewButton>
            <ViewButton
              active={view === 'calendar'}
              onClick={() => setView('calendar')}
              icon={<CalendarDays size={16} />}
            >
              {t('view.calendar')}
            </ViewButton>
          </div>
        </div>


        {/* Länk till discipliner-guiden — placerad precis här eftersom det
            är exakt där någon står och funderar på skillnaden mellan
            t.ex. Vert och Bowl medan de filtrerar. */}
        <p className="mt-4 text-xs text-chalk-500">
          {t('disciplines.filterHint')}{' '}
          <Link href="/disciplines" className="text-spray underline hover:text-spray-dark">
            {t('disciplines.filterHintCta')}
          </Link>
        </p>

        {/* Filterchips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
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
            <div key={event.slug} ref={i === firstUpcomingIndex ? firstUpcomingRef : undefined} className="scroll-mt-40">
              <EventCard event={event} index={i} now={now} />
            </div>
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
      aria-label={typeof children === 'string' ? children : undefined}
      className={clsx(
        'flex items-center justify-center gap-2 rounded-stamp px-3 py-2.5 font-mono-tight text-sm font-bold uppercase tracking-wide transition sm:px-4',
        active
          ? // Mörk text (inte vit) på den ljusa orangea bakgrunden — bättre
            // kontrastvärde/läsbarhet, vilket var specens egen överordnade
            // krav ("high contrast and easy to read").
            'bg-spray text-asphalt-950 shadow-md'
          : 'border border-asphalt-700/20 bg-asphalt-800/[0.05] text-chalk-500 shadow-sm hover:text-current dark:border-chalk-500/15 dark:bg-chalk-500/[0.05]'
      )}
    >
      {icon}
      {/* Text dold på mobil (bara ikon, för att få plats bredvid sökfältet
          på samma rad) — synlig igen från sm-brytpunkten. */}
      <span className="hidden sm:inline">{children}</span>
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Byggd från grunden (i stället för en native <select>) eftersom
  // operativsystemets egen rullgardinsmeny ritas av OS:et självt, inte
  // av oss — på Windows gav det ibland en svårläst, till synes
  // "inaktiverad" nedrullningslista i mörkt läge (dålig kontrast,
  // OS-standardfärger som ignorerade vår styling). Med en egen dropdown
  // (samma mönster som språkväxlaren) ser den identisk ut och beter sig
  // likadant oavsett Windows/Mac/mobil.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const selectedLabel = value ? t(`${translatePrefix}.${value}`) : label;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={clsx(
          'flex items-center gap-1.5 rounded-stamp border px-3.5 py-2 font-mono-tight text-xs font-semibold uppercase tracking-wide shadow-sm transition',
          value
            ? 'border-spray bg-spray/10 text-spray shadow-md'
            : 'border-asphalt-700/20 bg-asphalt-800/[0.05] text-current hover:border-spray hover:text-spray dark:border-chalk-500/15 dark:bg-chalk-500/[0.05]'
        )}
      >
        {selectedLabel}
        <ChevronDown size={13} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-2 max-h-64 w-48 overflow-y-auto rounded-stamp border border-asphalt-700/20 bg-concrete-100 py-1 shadow-lg dark:border-chalk-500/20 dark:bg-asphalt-900"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === null}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={clsx(
              'flex w-full items-center justify-between px-4 py-2 text-left font-mono-tight text-xs uppercase tracking-wide hover:bg-spray/10 hover:text-spray',
              value === null && 'font-semibold text-spray'
            )}
          >
            {label}
            {value === null && <Check size={13} />}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={clsx(
                'flex w-full items-center justify-between px-4 py-2 text-left font-mono-tight text-xs uppercase tracking-wide hover:bg-spray/10 hover:text-spray',
                value === opt && 'font-semibold text-spray'
              )}
            >
              {t(`${translatePrefix}.${opt}`)}
              {value === opt && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
