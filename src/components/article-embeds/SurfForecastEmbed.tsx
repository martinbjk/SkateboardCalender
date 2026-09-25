'use client';

import { useState } from 'react';
import { ExternalLink, Waves } from 'lucide-react';

/**
 * Bäddar in KustVåg (martinbjk.github.io/SwedishSurfWest) — en separat,
 * fristående surfprognos-app (SMHI + Open-Meteo Marine) som redan täcker
 * flera av spottarna i den här artikeln (bl.a. Apelviken, Ringenäs,
 * Tylösand, Skäret, Mölle). Inbäddad via iframe snarare än ombyggd, så
 * prognoslogiken underhålls på ett ställe.
 *
 * UI-texten är på engelska av samma skäl som SkateparkFinder: artikeln
 * visas på engelska i alla locale.
 */

const KUSTVAG_URL = 'https://martinbjk.github.io/SwedishSurfWest/';

export function SurfForecastEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="mt-10" aria-label="Live surf forecast widget">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-display flex items-center gap-2 text-2xl tracking-tight text-spray">
          <Waves size={20} className="shrink-0" aria-hidden />
          Live conditions
        </h2>
        <a
          href={KUSTVAG_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-1 font-mono-tight text-xs uppercase tracking-wide text-chalk-500 hover:text-spray"
        >
          Open full screen
          <ExternalLink size={12} />
        </a>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        A live forecast widget for the Swedish west coast (SMHI + Open-Meteo Marine data), covering
        several of the spots above — including Apelviken, Ringenäs, Tylösand, Skäret and Mölle.
      </p>

      <div className="relative mt-5 overflow-hidden rounded-stamp border border-asphalt-700/20 bg-asphalt-950/5 dark:border-chalk-500/15">
        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono-tight text-xs uppercase tracking-wide text-chalk-500"
            aria-hidden
          >
            Loading forecast…
          </div>
        )}
        <iframe
          src={KUSTVAG_URL}
          title="KustVåg — live surf forecast for the Swedish west coast"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="h-[720px] w-full border-0 bg-transparent sm:h-[640px]"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="mt-2 font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
        Forecast by KustVåg, an independent project — not affiliated with any spot's local surf club.
      </p>
    </section>
  );
}
