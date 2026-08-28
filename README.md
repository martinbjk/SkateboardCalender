[README (2).md](https://github.com/user-attachments/files/31560837/README.2.md)
# Skateboard Event Calendar

En global, live kalender för skateboard-tävlingar och events —
[skateboardeventcalendar.com](https://skateboardeventcalendar.com) — byggd med
Next.js 14 (App Router), TypeScript, Tailwind CSS och next-intl. Statisk
export, publiceras automatiskt till GitHub Pages via GitHub Actions.

## Status

🟢 **Live och i aktiv drift.** ~90 event, 7 språk, sökmotorindexerad med
strukturerad data. Se [Vad som INTE är klart](#vad-som-inte-är-klart-ännu)
längst ner för kända begränsningar och nästa steg.

## Funktioner

- **~90 skateboardevent** världen över — VM/mästerskap, proffs-tourer
  (SLS, X Games, WDSC), nationella cuper (Skateboardcupen, Skate SM,
  Deutsche Meisterschaft m.fl.), och grässrotsjams — alla verifierade
  mot en riktig källa (se `source`-fältet i varje JSON-fil).
- **7 språk** (svenska, engelska, tyska, franska, spanska, portugisiska,
  japanska) — hela gränssnittet helt översatt. Eventbeskrivningar finns
  på alla sju; övrig eventtext (namn, ort osv.) är på originalspråket.
- **Automatisk språkdetektering** — en besökare på grunddomänen
  skickas till rätt språk baserat på webbläsarens/telefonens
  inställning, med ett sparat manuellt val som prioriteras vid
  återbesök (`localStorage`).
- **Sök & filter** — text, disciplin, nivå, region — med en klibbig
  filterrad som följer med vid scroll, och automatisk skrollning till
  dagens/kommande event vid sidladdning (så man slipper scrolla förbi
  redan avslutade tävlingar).
- **Kalendervy** utöver listvyn, öppnar alltid på innevarande månad.
- **Google Maps-länk** per event — smart fallback: riktigt venue-namn
  ger en textsökning (hittar oftast exakt anläggning), okänt venue med
  kända koordinater ger en platslänk, och helt okänd plats visar ingen
  länk alls (istället för en missvisande sådan).
- **SEO & strukturerad data** — JSON-LD (`SportsEvent`: datum, plats,
  arrangör, bild, performer, offers), canonical-URL:er, hreflang för
  alla 7 språk, sitemap med konsekvent avslutande snedstreck, og:image,
  riktiga PWA-ikoner.
- **"Lägg till i kalender"** — .ics-nedladdning + Google Calendar-länk
  per event.
- **Community-inskick** — via GitHub Issue-mall eller Pull Request,
  automatiskt validerat av CI innan merge.

## Snabbstart

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) — du omdirigeras automatiskt (klientsidan detekterar språk, se `src/app/page.tsx`).

```bash
npm run build              # bygger statisk export till /out
npm run start                # servera /out lokalt (npx serve), som i produktion
npm run typecheck            # TypeScript utan att bygga
npm run lint                   # ESLint
npm run validate-events        # validera all data/events/*.json mot schemat
```

## Struktur

```
data/events/*.json              ← källa till sanning för alla events (en fil per event)
messages/{sv,en,de,fr,es,pt,ja}.json  ← alla UI-texter (next-intl)
src/
  app/
    page.tsx                    ← rot-omdirigering med språkdetektering (localStorage + navigator.languages)
    [locale]/                   ← sidor (startsida, /events/[slug], /submit)
    sitemap.ts, robots.ts, manifest.ts
  components/
    EventsExplorer.tsx           ← sök, filter, klibbig filterrad, autoscroll till dagens event
    EventCard.tsx, CalendarView.tsx, Hero.tsx, Header.tsx, LanguageSwitcher.tsx m.fl.
  lib/
    schema.ts                    ← Zod-schema, källa till sanning för datastrukturen
    events.ts                    ← läser & validerar /data/events (server-only)
    events-shared.ts             ← delad logik (status, kategorier, googleMapsUrl) — säker för klientkomponenter
    date.ts                      ← datumformat, ICS-export, Google Calendar-länk
    useLiveNow.ts                ← håller Live/Kommande-status uppdaterad efter sidladdning utan hydreringsfel
  i18n/                         ← next-intl-konfiguration (lägg till nya språk i config.ts)
.github/
  workflows/
    validate-events.yml          ← CI: validerar all eventdata på varje PR
    pages-deploy.yml               ← CD: bygger statisk export + publicerar till GitHub Pages vid push till main
  ISSUE_TEMPLATE/
    event_submission.yml         ← formulär för community-inskick av nya events
```

## Lägga till ett event

**Alternativ A — GitHub Issue (enklast):** öppna en ny Issue med mallen
"Föreslå ett event" (eller via `/submit`-sidan på sajten). Någon i
teamet lägger till det som en JSON-fil.

**Alternativ B — Pull Request:** skapa `data/events/ditt-event-slug.json`
enligt strukturen nedan (se `src/lib/schema.ts` för fullständigt schema)
och öppna en PR. `validate-events.yml` kontrollerar automatiskt att
filen är giltig innan den kan mergas.

```json
{
  "slug": "ditt-event-slug",
  "name": "Eventets namn",
  "category": ["street"],
  "level": "pro",
  "startDate": "2027-06-12T10:00:00+02:00",
  "endDate": "2027-06-13T18:00:00+02:00",
  "timezone": "Europe/Berlin",
  "location": {
    "venue": "Arena-namn (eller \"TBD\" om okänt)",
    "city": "Stad",
    "country": "Land",
    "countryCode": "DE",
    "continent": "europe",
    "lat": 52.52,
    "lng": 13.405
  },
  "description": {
    "sv": "Beskrivning på svenska.",
    "en": "Description in English."
  },
  "officialUrl": "https://...",
  "organizer": "Arrangörens namn",
  "source": {
    "note": "Var/hur informationen verifierades.",
    "url": "https://... (var informationen hämtades ifrån)",
    "retrievedAt": "2026-08-28T00:00:00+02:00"
  }
}
```

Viktigt:
- `slug` måste matcha filnamnet exakt (utan `.json`).
- `startDate`/`endDate` måste vara ISO 8601 **med tidszon** (`+02:00` osv).
- Status (Upcoming / Live / Finished) beräknas automatiskt från dessa datum — sätt aldrig den manuellt.
- Skriv **"TBD"** i `venue` om ni inte känner till exakt anläggning — då faller Google Maps-länken automatiskt tillbaka på stadens koordinater istället för att gissa fel.
- Kategorierna (street/park/vert/bowl/downhill/slalom/freestyle/demo/contest) hålls medvetet **oöversatta** i alla språk — internationellt vedertagen skateboard-terminologi, som "kickflip" eller "ollie".

## Fler språk

Alla sju språk (sv, en, de, fr, es, pt, ja) är helt översatta för
UI-texten. Så här lägger du till ytterligare ett:

1. Lägg till språkkoden i `src/i18n/config.ts` → `locales`.
2. Skapa `messages/<kod>.json` (kopiera `messages/en.json` som mall och översätt).
3. Lägg till språknamnet i `LOCALE_NAMES`/`LOCALE_CODES` i `LanguageSwitcher.tsx`.

Sitemap, hreflang och routing plockar upp nya språk automatiskt via
`i18n/config.ts` — inget annat behöver ändras. Eventbeskrivningar
(`description`-fältet i varje eventfil) stödjer valfritt alla sju
språk, med engelska som reserv om en översättning saknas för ett
specifikt event.

## Deploy till GitHub Pages (ingen Vercel behövs)

Sajten byggs som en **statisk export** (ren HTML/CSS/JS, ingen Node-server
krävs i produktion) och publiceras av `.github/workflows/pages-deploy.yml`
varje gång du pushar till `main`. Inga externa konton eller secrets krävs.

**Engångsinställning:**

1. Pusha repot till GitHub.
2. Gå till repots **Settings → Pages**.
3. Under **Build and deployment → Source**, välj **GitHub Actions**
   (inte "Deploy from a branch").
4. Pusha till `main` (eller kör workflowen manuellt via **Actions →
   Bygg och publicera till GitHub Pages → Run workflow**).
5. Efter ett par minuter är sajten live.

**Anpassad domän:** kopplas under **Settings → Pages → Custom domain**.
GitHub skapar då automatiskt en `CNAME`-fil i repot. ⚠️ Att spara/ändra
den inställningen triggar GitHubs egen inbyggda publicering parallellt
med er workflow, vilket **kan orsaka ett tillfälligt låst
deployment-läge** (felmeddelande: "deployment request failed... due to
in progress deployment"). Löser sig genom att i Settings → Pages
tillfälligt växla Source till "Deploy from a branch", spara, och växla
tillbaka till "GitHub Actions" — det nollställer GitHubs interna lås.

### Testa lokalt precis som GitHub Pages gör

```bash
npm run build          # skapar statiska filer i /out
npx serve out           # servera dem lokalt, precis som i produktion
```

## Vad som INTE är klart ännu

- **Automatisk datahämtning/scraping är inte implementerad.** Ett
  utkast till skript (`scripts/fetch-worldskate.ts`) och en schemalagd
  workflow (`.github/workflows/scheduled-fetch.yml`) har tagits fram
  och testkörts mot simulerad data, men medvetet **inte lagts till i
  repot än** — väntar på att sättas i drift. Skriptet skulle skapa
  utkast-PR:er från World Skates kalender (aldrig auto-publicera direkt).
- **Inget bannersystem/reklam.** `BannerSchema` finns förberett i
  `src/lib/schema.ts` och en tom platshållare syns på eventsidan
  ("Annonsplats — kommer snart"), men ingen UI, ingen betalkoppling.
- **Ingen inbäddad karta på sajten.** Varje event länkar ut till Google
  Maps (ny flik) istället för att visa en karta inline — ett medvetet,
  enklare val.
- **Statisk export har vissa avvägningar** jämfört med en fullt
  server-driven Next.js-sajt: ingen på-begäran-rendering, ingen
  bildoptimering vid request-tid (`images.unoptimized: true`).
- **Sverige-täckningen i källorna** (se det separata källregistret,
  hålls utanför repot) är fortfarande tunnare än övriga stora
  discipliner trots att det är sajtens hemmamarknad — värt en
  återkommande extra koll.

## Licens

Uppdelad licens — koden är öppen, eventdatan är skyddad:

- **Källkoden** (allt under `src/`, `scripts/`, konfigurationsfiler)
  är **MIT-licensierad** — se [`LICENSE`](LICENSE). Använd, kopiera
  eller bygg vidare på den fritt.
- **Eventdatan** (`data/events/*.json` — den kuraterade listan över
  tävlingar) är **inte** MIT-licensierad. Se
  [`data/events/LICENSE`](data/events/LICENSE) — all rights reserved,
  kontakta upphovsrättsinnehavaren för tillstånd att återanvända den.
