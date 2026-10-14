
'use client';

import { useMemo, useState } from 'react';
import { Calculator, Clock, ExternalLink, MapPin, Waves } from 'lucide-react';
import clsx from 'clsx';
import { COASTS, type CoastEntry, type ToolLink } from '@/lib/article-embeds/surf-tools/coast-data';

/**
 * Två små verktyg för artikeln "surf-forecast-sites-and-buoys-guide":
 *  1. Kustväljare — välj kust, få rätt prognossajt, bojkälla och webbkamera.
 *  2. Dyningskalkylator — period + avstånd till en boj => ankomsttid.
 *
 * Båda arbetar enbart på data/regler som står i artikeln (inga live-anrop),
 * så de kan inte visa föråldrade bojvärden. Regeln: grupphastighet i knop =
 * 1,5 × period i sekunder (djupvatten), 1 knop = 1,852 km/h.
 *
 * UI-texten är på engelska eftersom artikeln visas på engelska i alla locale.
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

function formatDuration(hours: number): string {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function LinkList({ label, items }: { label: string; items: ToolLink[] }) {
  return (
    <div>
      <h4 className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">{label}</h4>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-chalk-500">None confirmed.</p>
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
                {item.name}
                <ExternalLink size={12} aria-hidden />
              </a>
              <span className="text-asphalt-800/80 dark:text-chalk-300/80"> — {item.note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CoastFinder() {
  const [coastId, setCoastId] = useState<string>('');
  const coast = useMemo(() => COASTS.find((c) => c.id === coastId), [coastId]);

  return (
    <div className="rounded-stamp border border-asphalt-700/20 bg-white/50 p-4 dark:border-chalk-500/15 dark:bg-asphalt-900/40">
      <h3 className="font-display flex items-center gap-2 text-xl tracking-tight text-asphalt-900 dark:text-chalk-100">
        <MapPin size={18} className="text-spray" aria-hidden />
        Find your tools
      </h3>
      <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
        Pick your coast and get a forecast site, a buoy source and a webcam source from this article.
      </p>

      <label htmlFor="surf-coast" className="sr-only">
        Choose a coast
      </label>
      <select
        id="surf-coast"
        value={coastId}
        onChange={(e) => setCoastId(e.target.value)}
        className="mt-3 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
      >
        <option value="">Choose a coast…</option>
        {GROUPS.map((g) => (
          <optgroup key={g} label={g}>
            {COASTS.filter((c) => c.group === g).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {coast && (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
            {coast.summary}
          </p>
          {coast.evidence === 'thin' && (
            <p className="rounded-stamp border border-spray/40 bg-spray/5 px-3 py-2 text-xs text-asphalt-800 dark:text-chalk-300">
              Thinner evidence: treat this as a starting point, not a recommendation we tested.
            </p>
          )}
          <LinkList label="Forecast sites" items={coast.forecasts} />
          <LinkList label="Buoy data" items={coast.buoys} />
          <LinkList label="Webcams" items={coast.cams} />
        </div>
      )}
    </div>
  );
}

const PRESETS: { label: string; period: number; distance: number; unit: Unit }[] = [
  { label: 'Hawaii: NOAA 51001, 17 s', period: 17, distance: 400, unit: 'km' },
  { label: 'Hawaii: NOAA 51001, 20 s', period: 20, distance: 400, unit: 'km' },
  { label: '400 nm out, 12 s', period: 12, distance: 400, unit: 'nm' }
];

function SwellCalculator() {
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
    const dayLabel = dayDiff === 0 ? 'same day' : dayDiff === 1 ? 'next day' : `+${dayDiff} days`;
    const time = arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${time} (${dayLabel})`;
  }, [valid, readingTime, hours]);

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
        When does the swell arrive?
      </h3>
      <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
        Enter the swell period on an upstream buoy and the distance from that buoy to your coast. Group
        speed is 1.5 × period, in knots (deep water).
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESETS.map((pr) => (
          <button
            key={pr.label}
            type="button"
            onClick={() => {
              setPeriod(pr.period);
              setDistance(pr.distance);
              setUnit(pr.unit);
            }}
            className="rounded-stamp border border-asphalt-700/25 px-3 py-1.5 font-mono-tight text-xs uppercase tracking-wide text-chalk-500 transition hover:border-spray/50 hover:text-spray dark:border-chalk-500/20"
          >
            {pr.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
            Swell period (s)
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
            Distance to coast
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
            Unit
          </span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="mt-1 w-full rounded-stamp border border-asphalt-700/30 bg-white/70 px-3 py-2 outline-none focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
          >
            <option value="nm">nautical miles</option>
            <option value="km">kilometres</option>
            <option value="mi">miles</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm sm:max-w-[16rem]">
        <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
          Buoy reading time (optional, your local time)
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
              About {formatDuration(hours)}
            </p>
            <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
              Speed {speedKn.toFixed(1)} knots ({(speedKn * 1.852).toFixed(0)} km/h) over{' '}
              {distNm.toFixed(0)} nautical miles.
              {eta ? ` Estimated arrival: ${eta}.` : ''}
            </p>
          </>
        ) : (
          <p className="text-sm text-chalk-500">Enter a period and a distance above zero.</p>
        )}
      </div>

      {byPeriod.length > 0 && (
        <div className="mt-4">
          <h4 className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
            Same distance, other periods
          </h4>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
            {byPeriod.map(({ p, kn, h }) => (
              <li key={p} className="flex justify-between gap-2 border-b border-asphalt-700/10 py-1 dark:border-chalk-500/10">
                <span className="font-semibold">{p} s</span>
                <span className="text-asphalt-800/80 dark:text-chalk-300/80">
                  {formatDuration(h)} · {kn.toFixed(0)} kn
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-chalk-500">
            Longer periods arrive first, so the longest-period energy shows up on your coast before the
            rest of the swell.
          </p>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-chalk-500">
        Rule of thumb for deep water (SurferToday, Wikipedia). Real arrival depends on swell direction,
        shelter and where the buoy sits.
      </p>
    </div>
  );
}

export function SurfToolsEmbed() {
  return (
    <section className="mt-10" aria-label="Surf forecast tools">
      <h2 className="font-display flex items-center gap-2 text-2xl tracking-tight text-spray">
        <Waves size={20} className="shrink-0" aria-hidden />
        Try it
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        Two small tools built from the data in this article. They do not fetch live buoy readings, so
        they cannot show out-of-date numbers.
      </p>
      <div className="mt-5 space-y-6">
        <CoastFinder />
        <SwellCalculator />
      </div>
    </section>
  );
}
