'use client';

import { useEffect } from 'react';
import { locales } from '@/i18n/config';

/**
 * Ersätter det middleware tidigare gjorde (auto-redirect "/" → rätt språk).
 * Statisk export (GitHub Pages) har ingen server som kan göra det per
 * request, så vi gör det i klienten istället — plus en synlig länk och
 * en <meta refresh> som fallback om JavaScript är avstängt (då går det
 * till en hårdkodad reserv, se nedan).
 *
 * Språkval, i prioritetsordning:
 *  1. Ett tidigare SPARAT val (localStorage) — om besökaren en gång bytt
 *     språk manuellt via LanguageSwitcher, respekteras det valet på
 *     framtida besök på rotdomänen, istället för att detektera om.
 *  2. Webbläsarens/enhetens språkinställning (navigator.languages) —
 *     matchas mot våra sju stödda språk. En japansk användares telefon
 *     rapporterar t.ex. "ja" eller "ja-JP", vilket matchar vårt "ja".
 *  3. Engelska som sista reserv, om inget av ovan matchar ett språk vi
 *     stödjer (t.ex. en besökare med kinesiska eller italienska som
 *     webbläsarspråk, som vi inte har en översättning för).
 *
 * OBS: relativ länk ("sv/", inte "/sv/") med flit — då fungerar det
 * oavsett om sajten ligger på en rot-domän eller under ett basePath
 * som /skate-event-calendar/ (GitHub Pages projekt-sajter).
 */

const STORAGE_KEY = 'preferred-locale';
const FALLBACK_LOCALE = 'en';

function detectLocale(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (locales as readonly string[]).includes(saved)) return saved;
  } catch {
    // localStorage kan vara blockerat (privat läge, cookies avstängda) —
    // fortsätt bara till nästa steg istället för att krascha.
  }

  const browserLangs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of browserLangs) {
    const primary = lang.split('-')[0]?.toLowerCase() ?? lang.toLowerCase();
    if ((locales as readonly string[]).includes(primary)) return primary;
  }

  return FALLBACK_LOCALE;
}

export default function RootRedirectPage() {
  useEffect(() => {
    window.location.replace(`${detectLocale()}/`);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${FALLBACK_LOCALE}/`} />
      <p style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        Redirecting… If you are not redirected automatically,{' '}
        <a href={`${FALLBACK_LOCALE}/`}>click here</a>.
      </p>
    </>
  );
}
