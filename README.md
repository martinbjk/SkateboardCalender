# Skate Event Calendar

En global, live kalender för skateboard-tävlingar och events — byggd med
Next.js 14 (App Router), TypeScript, Tailwind CSS och next-intl.

🔴 **Status:** fungerande grund/MVP, se [Vad som INTE är klart](#vad-som-inte-är-klart-ännu) längst ner innan du sätter det i produktion.

## Snabbstart

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) — du omdirigeras automatiskt till `/sv`.

```bash
npm run build              # bygger statisk export till /out
npm run start                # servera /out lokalt (npx serve), som i produktion
npm run typecheck            # TypeScript utan att bygga
npm run lint                   # ESLint
npm run validate-events        # validera all data/events/*.json mot schemat
```

## Struktur

```
data/events/*.json       ← källa till sanning för alla events (en fil per event)
messages/{sv,en}.json    ← alla UI-texter (next-intl)
src/
  app/[locale]/          ← sidor (startsida, /events/[slug], /submit)
  components/            ← EventCard, EventsExplorer, CalendarView, m.fl.
  lib/
    schema.ts             ← Zod-schema, källa till sanning för datastrukturen
    events.ts             ← läser & validerar /data/events, statuslogik (upcoming/live/finished)
    date.ts                ← datumformat, ICS-export, Google Calendar-länk
  i18n/                   ← next-intl-konfiguration
.github/
  workflows/
    validate-events.yml    ← CI: validerar all eventdata på varje PR
    pages-deploy.yml         ← CD: bygger statisk export + publicerar till GitHub Pages vid push till main
    scheduled-fetch.yml.template  ← MALL för framtida automatisk datahämtning (ej aktiv, se filen)
  ISSUE_TEMPLATE/
    event_submission.yml   ← formulär för community-inskick av nya events
```

## Lägga till ett event

**Alternativ A — GitHub Issue (enklast):** öppna en ny Issue med mallen
"Föreslå ett event". Någon i teamet lägger till det som en JSON-fil.

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
    "venue": "Arena-namn",
    "city": "Stad",
    "country": "Land",
    "countryCode": "DE",
    "continent": "europe"
  },
  "description": {
    "sv": "Beskrivning på svenska.",
    "en": "Description in English."
  },
  "officialUrl": "https://...",
  "source": {
    "url": "https://... (var informationen hämtades ifrån)",
    "retrievedAt": "2026-08-13T00:00:00+02:00"
  }
}
```

Viktigt:
- `slug` måste matcha filnamnet exakt (utan `.json`).
- `startDate`/`endDate` måste vara ISO 8601 **med tidszon** (`+02:00` osv).
- Status (Upcoming / Live / Finished) beräknas automatiskt från dessa datum — du behöver aldrig sätta den manuellt.

## Fler språk

Just nu är svenska och engelska helt översatta. Strukturen är byggd för
att enkelt utökas (spanska, portugisiska, franska, tyska, japanska m.fl.):

1. Lägg till språkkoden i `src/i18n/config.ts` → `locales`.
2. Skapa `messages/<kod>.json` (kopiera `messages/en.json` som mall och översätt).
3. Lägg till en flagga/etikett i `LanguageSwitcher.tsx`.

## Deploy till GitHub Pages (ingen Vercel behövs)

Sajten byggs som en **statisk export** (ren HTML/CSS/JS, ingen Node-server
krävs i produktion) och publiceras av `.github/workflows/pages-deploy.yml`
varje gång du pushar till `main`. Inga externa konton eller secrets krävs.

**Engångsinställning:**

1. Pusha repot till GitHub (se avsnittet [Kom igång](#kom-igång) nedan).
2. Gå till repots **Settings → Pages**.
3. Under **Build and deployment → Source**, välj **GitHub Actions**
   (inte "Deploy from a branch").
4. Pusha till `main` (eller kör workflowen manuellt via **Actions →
   Bygg och publicera till GitHub Pages → Run workflow**).
5. Efter ett par minuter är sajten live på
   `https://<ditt-användarnamn>.github.io/<repo-namn>/`
   (URL:en visas även under Settings → Pages när den är klar).

**Hur `basePath` funkar:** eftersom sajten (troligen) ligger under en
undermapp (`/repo-namn/`) och inte sajtens rot, sätter workflowen
automatiskt miljövariabeln `NEXT_PUBLIC_BASE_PATH` till `/<repo-namn>`
vid varje bygge (`next.config.mjs` läser den och bakar in den i alla
länkar, ikoner och manifest). Kör du istället:
- en **user/org root-sajt** (`<user>.github.io` utan repo-namn i URL:en), eller
- en **egen domän** kopplad via `public/CNAME`,

då ska `NEXT_PUBLIC_BASE_PATH` vara tom. Ta i så fall bort den raden i
`.github/workflows/pages-deploy.yml`.

### Testa lokalt precis som GitHub Pages gör

```bash
npm run build          # skapar statiska filer i /out
npx serve out           # servera dem lokalt, precis som i produktion
```

(`npm run dev` fungerar också som vanligt för utveckling — då körs
Next.js dev-server och `output: 'export'`-läget påverkar inte det.)

## Kom igång

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/DITT-REPO-NAMN.git
git push -u origin main
```

Sedan: se [Deploy till GitHub Pages](#deploy-till-github-pages-ingen-vercel-behövs) ovan.

## Vad som INTE är klart ännu

Jag vill vara tydlig med begränsningarna i den här första versionen:

- **Ingen karta.** Du valde att hoppa över det i denna version. Strukturen
  har koordinater (`location.lat`/`lng`) på varje event redo för det,
  om ni vill lägga till Leaflet/Mapbox senare.
- **Inget bannersystem/reklam.** Samma sak — `BannerSchema` finns förberett
  i `src/lib/schema.ts` och en tom platshållare finns på eventsidan, men
  ingen UI, ingen Stripe-koppling.
- **Ingen riktig automatisk scraping.** `scheduled-fetch.yml.template` är
  en tydligt markerad mall, inte en fungerande scraper — jag hade ingen
  specifik källa att koppla mot. Community-inflödet via GitHub Issues/PR
  fungerar dock på riktigt.
- **PWA-ikoner saknas.** `public/manifest` pekar på `/icons/icon-192.png`
  m.fl. som du behöver lägga till själv (jag kan inte generera riktiga
  bildfiler i den här miljön).
- **`package-lock.json`** ingår och är testad i den här leveransen, men
  kör ändå `npm install` igen hos dig för säkerhets skull (kan skilja
  sig något beroende på din npm/Node-version).
- **Statisk export har vissa avvägningar** jämfört med en fullt
  server-driven Next.js-sajt: ingen på-begäran-rendering, ingen bild-
  optimering vid request-tid (`images.unoptimized: true`), och ingen
  automatisk språkdetektering/redirect från servern — "/" redirectar nu
  via en liten klient-sida till "/sv/" istället för via middleware.
  Fungerar utmärkt för den här typen av innehållssajt, men värt att
  känna till.
- Endast 13 events är inlagda som exempeldata — alla verifierade mot
  riktiga källor (se `source`-fältet i varje JSON-fil), men listan är
  långt ifrån komplett.

## Licens

MIT — gör vad ni vill med det.
