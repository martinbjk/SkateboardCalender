'use client';

import { useEffect, useState } from 'react';

/**
 * Löser en avvägning mellan två buggar:
 *
 * 1. Om varje komponent räknar ut sin egen `new Date()` vid rendering,
 *    skiljer sig servertidpunkten (byggtillfället) från klienttidpunkten
 *    (besökarens faktiska "nu") — React upptäcker mismatchen vid
 *    hydrering och blixtrar till fel text innan den rättar sig (se commit
 *    "Fix hydration mismatch" tidigare).
 * 2. Om vi istället fryser "nu" en gång vid byggtillfället och ALDRIG
 *    uppdaterar den i webbläsaren (den tidigare fixen), blir statusen
 *    (Live/Kommande/Avslutat) inaktuell tills nästa bygge/commit — ett
 *    event som startat idag kan fortsätta visas som "Kommande" i flera
 *    dagar om inget nytt pushats.
 *
 * Lösningen: använd den frysta byggtidpunkten för DEN FÖRSTA renderingen
 * (så hydreringen matchar servern exakt, inget flimmer), och uppdatera
 * sedan till riktig aktuell tid i en effect EFTER att hydreringen är
 * klar — det räknas inte som en mismatch eftersom det sker efteråt, inte
 * under själva hydreringen.
 */
export function useLiveNow(buildTimeIso: string): string {
  const [now, setNow] = useState(buildTimeIso);

  useEffect(() => {
    setNow(new Date().toISOString());
    const interval = setInterval(() => {
      setNow(new Date().toISOString());
    }, 60_000); // uppdatera varje minut, så en lång webbläsarsession inte fastnar på gammal status
    return () => clearInterval(interval);
  }, []);

  return now;
}
