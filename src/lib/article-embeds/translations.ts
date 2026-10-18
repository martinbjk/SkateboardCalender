'use client';

import { useMemo, useState } from 'react';
import { Calculator, Clock, ExternalLink, MapPin, Waves } from 'lucide-react';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { COASTS, type CoastEntry, type ToolLink } from '@/lib/article-embeds/surf-tools/coast-data';
import { tr, UI, type EmbedLocale, type EmbedUi } from '@/lib/article-embeds/surf-tools/translations';

/**
 * Två små verktyg för artikeln "surf-forecast-sites-and-buoys-guide":
 *  1. Kustväljare — välj kust, få rätt prognossajt, bojkälla och webbkamera.
 *  2. Dyningskalkylator — period + avstånd till en boj => ankomsttid.
 *
 * Båda arbetar enbart på data/regler som står i artikeln (inga live-anrop),
 * så de kan inte visa föråldrade bojvärden. Regeln: grupphastighet i knop =
 * 1,5 × period i sekunder (djupvatten), 1 knop = 1,852 km/h.
 *
 * UI-texten följer sidans locale: svenska för 'sv', annars engelska.
 */

const GROUPS: CoastEntry['group'][] = ['Americas', 'Europe', 'Asia-Pacific and Africa', 'Elsewhere'];

const NM_PER_KM = 1 / 1.852;
const NM_PER_MILE = 0.868976;

type Unit = 'nm' | 'km' | 'mi';

function toNm(value: number, unit: Unit): number {
  if (unit === 'km') return value * NM_PER_KM;
  if (unit === 'mi') return value * NM_PER_MILE;
  return value;
}

function formatDuration(hours: number, ui: EmbedUi): string {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} ${ui.minute}`;
  if (m === 0) return `${h} ${ui.hour}`;
  return `${h} ${ui.hour} ${m} ${ui.minute}`;
}

/** Tal med en decimal; svenskt decimalkomma för 'sv'. */
function num(value: number, digits: number, locale: EmbedLocale): string {
  const t = value.toFixed(digits);
  return locale === 'sv' ? t.replace('.', ',') : t;
}

function LinkList({
  label,
  items,
  locale,
  ui
}: {
  label: string;
  items: ToolLink[];
  locale: EmbedLocale;
  ui: EmbedUi;
}) {
  return (
    <div>
      <h4 className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">{label}</h4>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-chalk-500">{ui.none}</p>
      ) : (
        <ul className="mt-1 space-y-1.5">
          {items.map((item) => (
            <li key={`${item.name}-${item.url}`} className="text-sm">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 font-semibold text-spray underline decoration-spray/40 underline-offset-2 hover:decoration-spray"
              >
                {tr(item.name, locale)}
                <ExternalLink size={12} aria-hidden />
              </a>
              <span className="text-asphalt-800/80 dark:text-chalk-300/80"> — {tr(item.note, locale)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CoastFinder({ locale, ui }: { locale: EmbedLocale; ui: EmbedUi }) {
  const [coastId, setCoastId] = useState<string>('');
  const coast = useMemo(() => COASTS.find((c) => c.id === coastId), [coastId]);

  return (
    <div className="rounded-stamp border border-asphalt-700/20 bg-white/50 p-4 dark:border-chalk-500/15 dark:bg-asphalt-900/40">
      <h3 className="font-display flex items-center gap-2 text-xl tracking-tight text-asphalt-900 dark:text-chalk-100">
        <MapPin size={18} className="text-spray" aria-hidden />
        {ui.findTitle}
      </h3>
      <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
        {ui.findIntro}
      </p>

      <label htmlFor="surf-coast" className="sr-only">
        {ui.chooseCoastSr}
      </label>
      <select
        id="surf-coast"
        value={coastId}
        onChange={(e) => setCoastId(e.target.value)}
        className="mt-3 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
      >
        <option value="">{ui.chooseCoast}</option>
        {GROUPS.map((g) => (
          <optgroup key={g} label={tr(g, locale)}>
            {COASTS.filter((c) => c.group === g).map((c) => (
              <option key={c.id} value={c.id}>
                {tr(c.name, locale)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {coast && (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
            {tr(coast.summary, locale)}
          </p>
          {coast.evidence === 'thin' && (
            <p className="rounded-stamp border border-spray/40 bg-spray/5 px-3 py-2 text-xs text-asphalt-800 dark:text-chalk-300">
              {ui.thin}
            </p>
          )}
          <LinkList label={ui.forecasts} items={coast.forecasts} locale={locale} ui={ui} />
          <LinkList label={ui.buoys} items={coast.buoys} locale={locale} ui={ui} />
          <LinkList label={ui.webcams} items={coast.cams} locale={locale} ui={ui} />
        </div>
      )}
    </div>
  );
}

const PRESET_VALUES: { period: number; distance: number; unit: Unit }[] = [
  { period: 17, distance: 400, unit: 'km' },
  { period: 20, distance: 400, unit: 'km' },
  { period: 12, distance: 400, unit: 'nm' }
];

function SwellCalculator({ locale, ui }: { locale: EmbedLocale; ui: EmbedUi }) {
  const [period, setPeriod] = useState<number>(15);
  const [distance, setDistance] = useState<number>(400);
  const [unit, setUnit] = useState<Unit>('nm');
  const [readingTime, setReadingTime] = useState<string>('');

  const valid = period > 0 && distance > 0 && Number.isFinite(period) && Number.isFinite(distance);
  const speedKn = 1.5 * period;
  const distNm = toNm(distance, unit);
  const hours = valid ? distNm / speedKn : 0;

  const eta = useMemo(() => {
    if (!valid || !readingTime) return null;
    const parts = readingTime.split(':').map(Number);
    const hh = parts[0];
    const mm = parts[1];
    if (hh === undefined || mm === undefined || Number.isNaN(hh) || Number.isNaN(mm)) return null;
    const base = new Date();
    base.setHours(hh, mm, 0, 0);
    const arrival = new Date(base.getTime() + hours * 3600 * 1000);
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayDiff = Math.round((startOfDay(arrival) - startOfDay(base)) / 86400000);
    const dayLabel = dayDiff === 0 ? ui.sameDay : dayDiff === 1 ? ui.nextDay : ui.plusDays(dayDiff);
    const time = arrival.toLocaleTimeString(locale === 'sv' ? 'sv-SE' : [], { hour: '2-digit', minute: '2-digit' });
    return `${time} (${dayLabel})`;
  }, [valid, readingTime, hours, locale, ui]);

  const byPeriod = useMemo(() => {
    if (!(distance > 0)) return [];
    return [8, 10, 12, 14, 16, 18, 20].map((p) => ({
      p,
      kn: 1.5 * p,
      h: toNm(distance, unit) / (1.5 * p)
    }));
  }, [distance, unit]);

  return (
    <div className="rounded-stamp border border-asphalt-700/20 bg-white/50 p-4 dark:border-chalk-500/15 dark:bg-asphalt-900/40">
      <h3 className="font-display flex items-center gap-2 text-xl tracking-tight text-asphalt-900 dark:text-chalk-100">
        <Calculator size={18} className="text-spray" aria-hidden />
        {ui.calcTitle}
      </h3>
      <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
        {ui.calcIntro}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESET_VALUES.map((pr, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setPeriod(pr.period);
              setDistance(pr.distance);
              setUnit(pr.unit);
            }}
            className="rounded-stamp border border-asphalt-700/25 px-3 py-1.5 font-mono-tight text-xs uppercase tracking-wide text-chalk-500 transition hover:border-spray/50 hover:text-spray dark:border-chalk-500/20"
          >
            {ui.presets[i]}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
            {ui.period}
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={4}
            max={30}
            step={0.5}
            value={Number.isNaN(period) ? '' : period}
            onChange={(e) => setPeriod(parseFloat(e.target.value))}
            className="mt-1 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2 outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
          />
        </label>
        <label className="block text-sm">
          <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
            {ui.distance}
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step={10}
            value={Number.isNaN(distance) ? '' : distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="mt-1 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2 outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
          />
        </label>
        <label className="block text-sm">
          <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
            {ui.unit}
          </span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="mt-1 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2 outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
          >
            <option value="nm">{ui.unitNm}</option>
            <option value="km">{ui.unitKm}</option>
            <option value="mi">{ui.unitMi}</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm sm:max-w-[16rem]">
        <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
          {ui.readingTime}
        </span>
        <input
          type="time"
          value={readingTime}
          onChange={(e) => setReadingTime(e.target.value)}
          className="mt-1 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2 outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
        />
      </label>

      <div
        className={clsx(
          'mt-4 rounded-stamp border px-4 py-3',
          valid ? 'border-spray/50 bg-spray/5' : 'border-asphalt-700/20'
        )}
        aria-live="polite"
      >
        {valid ? (
          <>
            <p className="flex items-center gap-2 font-display text-2xl tracking-tight text-spray">
              <Clock size={20} aria-hidden />
              {ui.about} {formatDuration(hours, ui)}
            </p>
            <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
              {ui.speed} {num(speedKn, 1, locale)} {ui.knots} ({num(speedKn * 1.852, 0, locale)} km/h){' '}
              {ui.over} {num(distNm, 0, locale)} {ui.nauticalMiles}.
              {eta ? ` ${ui.eta}: ${eta}.` : ''}
            </p>
          </>
        ) : (
          <p className="text-sm text-chalk-500">{ui.invalid}</p>
        )}
      </div>

      {byPeriod.length > 0 && (
        <div className="mt-4">
          <h4 className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
            {ui.otherPeriods}
          </h4>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
            {byPeriod.map(({ p, kn, h }) => (
              <li key={p} className="flex justify-between gap-2 border-b border-asphalt-700/10 py-1 dark:border-chalk-500/10">
                <span className="font-semibold">{p} s</span>
                <span className="text-asphalt-800/80 dark:text-chalk-300/80">
                  {formatDuration(h, ui)} · {num(kn, 0, locale)} kn
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-chalk-500">
            {ui.longerFirst}
          </p>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-chalk-500">
        {ui.rule}
      </p>
    </div>
  );
}

export function SurfToolsEmbed() {
  const locale: EmbedLocale = useLocale() === 'sv' ? 'sv' : 'en';
  const ui = UI[locale];
  return (
    <section className="mt-10" aria-label={ui.sectionLabel}>
      <h2 className="font-display flex items-center gap-2 text-2xl tracking-tight text-spray">
        <Waves size={20} className="shrink-0" aria-hidden />
        {ui.tryIt}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {ui.intro}
      </p>
      <div className="mt-5 space-y-6">
        <CoastFinder locale={locale} ui={ui} />
        <SwellCalculator locale={locale} ui={ui} />
      </div>
    </section>
  );
}
