import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return { title: t('title') };
}

// Privacy Policy-innehållet skrivs direkt här (inte i messages/*.json) eftersom
// det är ett långt dokument med rubriker/listor — samma princip som
// eventbeskrivningarna (bara sv/en, inte alla sju UI-språk). Uppdatera BÅDA
// språken om innehållet ändras, annars hamnar de i otakt med varandra.
//
// OBS: det här är en utgångspunkt skriven för sajtens FAKTISKA nuvarande
// datapraxis (ingen inloggning, ingen egen serverlagring av personuppgifter,
// inga annonser ännu). Det är INTE juridisk rådgivning — låt gärna en
// jurist granska texten innan ni aktiverar Google AdSense, eftersom det
// tillkommer nya skyldigheter (cookie-samtycke, uppdaterad sektion nedan)
// den dagen annonser faktiskt slås på.

function PrivacyContentSv() {
  return (
    <>
      <p className="text-xs text-chalk-500">Senast uppdaterad: 28 augusti 2026</p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Sammanfattning</h2>
      <p>
        Skateboard Event Calendar är en statisk webbplats utan inloggning, konton eller egen
        serverbaserad lagring av personuppgifter. Vi samlar för närvarande inte in
        besöksstatistik eller använder spårningscookies. Den här sidan förklarar exakt vad som
        lagras, var, och varför.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Vad vi INTE gör</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Inga användarkonton eller inloggning</li>
        <li>Ingen insamling av namn, e-post eller andra personuppgifter via sajten själv</li>
        <li>Inga spårningscookies eller analysverktyg (Google Analytics, Meta Pixel e.dyl.) just nu</li>
        <li>Vi säljer aldrig data, eftersom vi inte samlar in någon</li>
      </ul>

      <h2 className="mt-8 font-display text-xl tracking-tight">Lokal lagring i din webbläsare</h2>
      <p>
        Sajten sparar två små, tekniska inställningar direkt i din webbläsare
        (<code>localStorage</code>) — de skickas aldrig till någon server:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Språkval</strong> — vilket av våra sju språk du senast valde manuellt</li>
        <li><strong>Färgtema</strong> — om du föredrar ljust eller mörkt läge</li>
      </ul>
      <p>
        Du kan när som helst rensa detta genom din webbläsares egna
        inställningar för webbplatsdata.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Tredjepartstjänster</h2>
      <p>Vissa delar av sajten länkar till eller använder externa tjänster som har egna
        integritetspolicyer, utanför vår kontroll:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>GitHub</strong> — om du föreslår ett event via vår Issue-mall eller Pull
          Request skickas den informationen till GitHub, som har sin egen{' '}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
            target="_blank"
            rel="noreferrer noopener"
            className="text-spray underline"
          >
            integritetspolicy
          </a>.
        </li>
        <li>
          <strong>Google Maps</strong> — platslänkar på eventsidor öppnar Google Maps i en ny
          flik. Google har sin egen{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer noopener"
            className="text-spray underline"
          >
            integritetspolicy
          </a>.
        </li>
        <li>
          <strong>Officiella eventsidor</strong> — länkar till arrangörers egna webbplatser
          (anmälan, biljetter, officiell info) omfattas av respektive arrangörs egen policy.
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl tracking-tight">Om vi lägger till annonser</h2>
      <p>
        Vi utvärderar för närvarande om Google AdSense ska aktiveras för att finansiera
        driften. Annonser är <strong>inte</strong> aktiverade just nu. Om/när de aktiveras
        kommer den här sidan att uppdateras med information om annonscookies, och ett
        samtyckesverktyg (cookie-banner) läggs till som frågar om lov innan några
        annonsrelaterade cookies sätts — i enlighet med GDPR och Googles krav för besökare i
        EU/EES/Storbritannien.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Barn</h2>
      <p>
        Sajten riktar sig inte specifikt till barn under 13 år och samlar inte medvetet in
        uppgifter från barn.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Ändringar</h2>
      <p>
        Vi kan uppdatera den här sidan när sajten utvecklas (t.ex. vid tillägg av annonser
        eller analysverktyg). Datumet högst upp visar senaste ändring.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Kontakt</h2>
      <p>
        Frågor om integritet? Se vår{' '}
        <a href="../contact/" className="text-spray underline">
          Contact-sida
        </a>.
      </p>
    </>
  );
}

function PrivacyContentEn() {
  return (
    <>
      <p className="text-xs text-chalk-500">Last updated: August 28, 2026</p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Summary</h2>
      <p>
        Skateboard Event Calendar is a static website with no accounts, no login, and no
        server-side storage of personal data. We do not currently collect visitor analytics or
        use tracking cookies. This page explains exactly what is stored, where, and why.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">What we do NOT do</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>No user accounts or login</li>
        <li>No collection of names, emails, or other personal data through the site itself</li>
        <li>No tracking cookies or analytics tools (Google Analytics, Meta Pixel, etc.) at this time</li>
        <li>We never sell data, because we don't collect any</li>
      </ul>

      <h2 className="mt-8 font-display text-xl tracking-tight">Local browser storage</h2>
      <p>
        The site stores two small technical preferences directly in your browser
        (<code>localStorage</code>) — never sent to any server:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Language choice</strong> — which of our seven languages you last manually selected</li>
        <li><strong>Color theme</strong> — whether you prefer light or dark mode</li>
      </ul>
      <p>You can clear this at any time via your browser&rsquo;s own site-data settings.</p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Third-party services</h2>
      <p>Some parts of the site link to or use external services with their own privacy
        policies, outside our control:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>GitHub</strong> — if you suggest an event via our Issue template or a Pull
          Request, that information is sent to GitHub, which has its own{' '}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
            target="_blank"
            rel="noreferrer noopener"
            className="text-spray underline"
          >
            privacy policy
          </a>.
        </li>
        <li>
          <strong>Google Maps</strong> — location links on event pages open Google Maps in a
          new tab. Google has its own{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer noopener"
            className="text-spray underline"
          >
            privacy policy
          </a>.
        </li>
        <li>
          <strong>Official event pages</strong> — links to organizers&rsquo; own websites
          (registration, tickets, official info) are covered by each organizer&rsquo;s own
          policy.
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl tracking-tight">If we add advertising</h2>
      <p>
        We are currently evaluating whether to enable Google AdSense to help fund the site.
        Advertising is <strong>not</strong> enabled at this time. If/when it is enabled, this
        page will be updated with information about ad cookies, and a consent tool (cookie
        banner) will be added that asks permission before any ad-related cookies are set — in
        line with GDPR and Google&rsquo;s requirements for visitors in the EU/EEA/UK.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Children</h2>
      <p>
        The site is not specifically directed at children under 13 and does not knowingly
        collect data from children.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Changes</h2>
      <p>
        We may update this page as the site evolves (e.g. if we add advertising or analytics
        tools). The date at the top shows the most recent change.
      </p>

      <h2 className="mt-8 font-display text-xl tracking-tight">Contact</h2>
      <p>
        Questions about privacy? See our{' '}
        <a href="../contact/" className="text-spray underline">
          Contact page
        </a>.
      </p>
    </>
  );
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{t('title')}</h1>
      <div className="prose-sm mt-6 space-y-4 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {locale === 'sv' ? <PrivacyContentSv /> : <PrivacyContentEn />}
      </div>
    </div>
  );
}
