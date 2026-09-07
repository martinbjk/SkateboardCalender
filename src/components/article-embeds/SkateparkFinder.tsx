'use client';

import { useMemo, useState } from 'react';
import { Search, MapPin, Globe, Mail, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';
import type { Skatepark, SkateparkRegion } from '@/lib/article-embeds/skateparks/types';

/**
 * Sök- och filtrerbar lista över verifierade inomhusparker. Byggd generisk
 * (tar `parks` som prop) så att den kan återanvändas om fler artiklar
 * senare får sökbara listor — kopplingen artikel → data sker i
 * src/lib/article-embeds/registry.tsx, inte här.
 *
 * UI-texten är på engelska med flit: artikeln finns bara på engelska och
 * visas på engelska i alla locale (isFallback), så en engelsk sökruta är
 * konsekvent. Byt till props/next-intl den dag artiklar översätts.
 */

const REGIONS: SkateparkRegion[] = ['Europe', 'North America & Mexico', 'Asia', 'Oceania'];

/** Ren domän (ev. med path) → länk; "Facebook: …" och liknande → ren text. */
function websiteHref(website: string): string | null {
  if (/\s/.test(website)) return null;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(website)) return null;
  return `https://${website}`;
}

export function SkateparkFinder({ parks }: { parks: Skatepark[] }) {
  const [query, setQuery] = useState('');
  const [activeRegions, setActiveRegions] = useState<SkateparkRegion[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parks.filter((p) => {
      if (activeRegions.length && !activeRegions.includes(p.region)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.city?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [parks, query, activeRegions]);

  const grouped = useMemo(
    () =>
      REGIONS.map((region) => ({
        region,
        items: filtered.filter((p) => p.region === region)
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

  const regionCounts = useMemo(() => {
    const counts = {} as Record<SkateparkRegion, number>;
    for (const r of REGIONS) counts[r] = 0;
    for (const p of parks) counts[p.region] += 1;
    return counts;
  }, [parks]);

  function toggleRegion(region: SkateparkRegion) {
    setActiveRegions((cur) =>
      cur.includes(region) ? cur.filter((r) => r !== region) : [...cur, region]
    );
  }

  const hasFilters = query.trim() !== '' || activeRegions.length > 0;

  return (
    <section className="mt-10" aria-label="Verified indoor skatepark finder">
      <h2 className="font-display text-2xl tracking-tight text-spray">Find a verified park</h2>
      <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {parks.length} indoor parks, each with a checked address and contact details. Search by park
        name, city, or country, and filter by region.
      </p>

      {/* Sökruta */}
      <div className="relative mt-5">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-chalk-500"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search parks, cities, or countries…"
          aria-label="Search verified indoor skateparks"
          className="w-full rounded-stamp border border-asphalt-700/30 bg-white/70 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-chalk-500 focus:border-spray dark:border-chalk-500/20 dark:bg-asphalt-900/70"
        />
      </div>

      {/* Region-chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {REGIONS.map((region) => {
          const active = activeRegions.includes(region);
          return (
            <button
              key={region}
              type="button"
              aria-pressed={active}
              onClick={() => toggleRegion(region)}
              className={clsx(
                'flex items-center gap-1.5 rounded-stamp border px-3 py-1.5 font-mono-tight text-xs font-semibold uppercase tracking-wide transition',
                active
                  ? 'border-spray bg-spray/10 text-spray shadow-sm'
                  : 'border-asphalt-700/25 text-chalk-500 hover:border-spray/50 hover:text-spray dark:border-chalk-500/20'
              )}
            >
              {region}
              <span className={active ? 'text-spray/70' : 'text-chalk-500/70'}>
                {regionCounts[region]}
              </span>
            </button>
          );
        })}
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveRegions([]);
            }}
            className="flex items-center gap-1 rounded-stamp px-2.5 py-1.5 font-mono-tight text-xs text-spray hover:underline"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      <p className="mt-3 font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
        {filtered.length === parks.length
          ? `${parks.length} parks`
          : `${filtered.length} of ${parks.length} parks`}
      </p>

      {/* Resultat, grupperade per region */}
      {grouped.length === 0 ? (
        <p className="mt-6 rounded-stamp border border-asphalt-700/20 px-4 py-6 text-center text-sm text-chalk-500 dark:border-chalk-500/15">
          No parks match your search. Try a different term or clear a filter.
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {grouped.map(({ region, items }) => (
            <div key={region}>
              <h3 className="font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
                {region} · {items.length}
              </h3>
              <ul className="mt-3 space-y-4">
                {items.map((park) => (
                  <li
                    key={park.id}
                    className="rounded-stamp border border-asphalt-700/20 bg-white/50 p-4 dark:border-chalk-500/15 dark:bg-asphalt-900/40"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <h4 className="font-display text-lg leading-tight tracking-tight text-asphalt-900 dark:text-chalk-100">
                        {park.name}
                      </h4>
                      <span className="font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
                        {park.location}
                      </span>
                    </div>

                    {park.description && (
                      <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
                        {park.description}
                      </p>
                    )}

                    {(park.addresses.length > 0 || park.website || park.email) && (
                      <div className="mt-2.5 space-y-1 text-sm text-asphalt-800/80 dark:text-chalk-300/80">
                        {park.addresses.map((addr) => (
                          <p key={addr} className="flex items-start gap-1.5">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-spray" />
                            {addr}
                          </p>
                        ))}
                        {park.website &&
                          (websiteHref(park.website) ? (
                            <p className="flex items-start gap-1.5">
                              <Globe size={14} className="mt-0.5 shrink-0 text-spray" />
                              <a
                                href={websiteHref(park.website)!}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-spray underline decoration-spray/40 underline-offset-2 hover:decoration-spray"
                              >
                                {park.website}
                              </a>
                            </p>
                          ) : (
                            <p className="flex items-start gap-1.5">
                              <Globe size={14} className="mt-0.5 shrink-0 text-spray" />
                              {park.website}
                            </p>
                          ))}
                        {park.email && (
                          <p className="flex items-start gap-1.5">
                            <Mail size={14} className="mt-0.5 shrink-0 text-spray" />
                            <a
                              href={`mailto:${park.email}`}
                              className="text-spray underline decoration-spray/40 underline-offset-2 hover:decoration-spray"
                            >
                              {park.email}
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    {park.warning && (
                      <p className="mt-2.5 flex items-start gap-1.5 rounded-sm bg-hazard/10 px-2.5 py-1.5 text-xs text-hazard-dark dark:text-hazard">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                        {park.warning}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
