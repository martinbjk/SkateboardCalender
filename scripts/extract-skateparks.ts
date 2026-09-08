/**
 * SKATEPARK-EXTRAKTOR — läser content/articles/en/verified-indoor-
 * skateparks-world.md och plockar ut varje verifierad park (region-
 * sektionerna Europe / North America & Mexico / Asia / Oceania) till
 * src/lib/article-embeds/skateparks/verified-indoor-skateparks-world.data.ts
 *
 * Körs på två sätt:
 *
 *   npx tsx scripts/extract-skateparks.ts            (manuellt, strikt)
 *       Skriver datafilen om allt validerar, annars felmeddelande + exit 1.
 *       Kör detta och committa datafilen när du ändrat artikeln, så att
 *       diffen går att granska.
 *
 *   npx tsx scripts/extract-skateparks.ts --build    (körs som `prebuild`)
 *       Vid fel: tydlig varning, men EXIT 0 och datafilen lämnas orörd, så
 *       att resten av sajten kan byggas och deployas ändå. Finder:n visar
 *       då den senast committade (last-known-good) datan.
 *
 * "## Bonus:"-parken (Guangzhou) och "## More Swedish indoor halls"-tabellen
 * hoppas MEDVETET över — de saknar den verifierade adress/sajt/e-post som
 * varje finder-post har och renderas kvar som vanlig artikeltext.
 */
import fs from 'node:fs';
import path from 'node:path';

// SKATEPARK_MD / SKATEPARK_OUT tillåter test mot en avvikande käll-/målfil
// utan att röra de riktiga (samma mönster som OUT_DIR i fix-html-lang.mjs).
const SRC =
  process.env.SKATEPARK_MD ??
  path.join(process.cwd(), 'content', 'articles', 'en', 'verified-indoor-skateparks-world.md');
const OUT =
  process.env.SKATEPARK_OUT ??
  path.join(
    process.cwd(),
    'src',
    'lib',
    'article-embeds',
    'skateparks',
    'verified-indoor-skateparks-world.data.ts'
  );

const BUILD_MODE = process.argv.includes('--build');

/** Minsta rimliga antal parker — färre = trolig parser-/formatregression. */
const MIN_PARKS = 50;
const REQUIRED_REGIONS = ['Europe', 'North America & Mexico', 'Asia', 'Oceania'] as const;

const REGION_HEADINGS: Record<string, string> = {
  '## Europe': 'Europe',
  '## North America & Mexico': 'North America & Mexico',
  '## Asia': 'Asia',
  '## Oceania': 'Oceania'
};

interface Skatepark {
  id: string;
  name: string;
  location: string;
  city: string | null;
  country: string;
  region: string;
  description: string | null;
  addresses: string[];
  website: string | null;
  email: string | null;
  warning: string | null;
}

function slugify(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // kombinerande diakriter
    .replace(/[Łł]/g, 'l') // Ł ł
    .replace(/[Øø]/g, 'o') // Ø ø
    .replace(/[ĐđÐð]/g, 'd') // Đ đ Ð ð
    .replace(/[Ææ]/g, 'ae') // Æ æ
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function parseParkBlock(lines: string[], region: string): Skatepark | null {
  const header = (lines[0] ?? '').match(/^\*\*(.+)\*\*$/);
  if (!header || !header[1]) return null;

  const raw = header[1].trim();
  // Dela på FÖRSTA " – " (en-dash) eller " - " (hyphen som reserv).
  const dash = raw.search(/\s[–-]\s/);
  if (dash === -1) return null;
  const name = raw.slice(0, dash).trim();
  const location = raw
    .slice(dash)
    .replace(/^\s*[–-]\s*/, '')
    .trim()
    // ta bort avslutande "(...)"-not, t.ex. "(multi-location)", "(2 locations)"
    .replace(/\s*\([^()]*\)\s*$/, '')
    .trim();

  const segments = location.split(',').map((s) => s.trim()).filter(Boolean);
  const country = segments[segments.length - 1] ?? location;
  const city = segments.length > 1 ? (segments[0] ?? null) : null;

  const addresses: string[] = [];
  let website: string | null = null;
  let email: string | null = null;
  let warning: string | null = null;
  const descParts: string[] = [];

  for (const line of lines.slice(1)) {
    if (line.startsWith('📍')) {
      addresses.push(line.replace(/^📍\s*/, '').trim());
      continue;
    }
    if (line.startsWith('⚠️')) {
      warning = line.replace(/^⚠️\s*/, '').trim();
      continue;
    }
    if (line.includes('🌐') || line.includes('✉️')) {
      const w = line.match(/🌐\s*([^·]+?)\s*(?:·|$)/);
      const e = line.match(/✉️\s*(\S+@\S+)/);
      if (w && w[1]) website = w[1].trim();
      if (e && e[1]) email = e[1].trim();
      continue;
    }
    descParts.push(line.trim());
  }

  return {
    id: slugify(name),
    name,
    location,
    city,
    country,
    region,
    description: descParts.length ? descParts.join(' ') : null,
    addresses,
    website,
    email,
    warning
  };
}

function extract(): { parks: Skatepark[]; unparsed: string[] } {
  // Normalisera radslut först — arbetskopian kan ha CRLF (core.autocrlf),
  // annars blir ett kvarvarande \r i slutet av varje rad och regexarna
  // nedan matchar inget.
  const md = fs
    .readFileSync(SRC, 'utf-8')
    .replace(/\r\n/g, '\n')
    .replace(/^---\n[\s\S]*?\n---\n/, '');
  const lines = md.split('\n');

  const parks: Skatepark[] = [];
  const unparsed: string[] = [];
  let region: string | null = null;
  let block: string[] = [];

  const flush = () => {
    if (region && block.length) {
      const park = parseParkBlock(block, region);
      if (park) parks.push(park);
      else if (block[0]?.startsWith('**')) unparsed.push(block[0]);
    }
    block = [];
  };

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      flush();
      region = REGION_HEADINGS[line.trim()] ?? null;
      continue;
    }
    if (line.trim() === '') {
      flush();
      continue;
    }
    // tabellrader och bilder i region-sektioner ska inte bli parkblock
    if (region && (line.startsWith('|') || line.startsWith('!['))) {
      flush();
      continue;
    }
    if (region) block.push(line);
  }
  flush();

  return { parks, unparsed };
}

function validate(parks: Skatepark[], unparsed: string[]): string[] {
  const errors: string[] = [];

  if (unparsed.length) {
    errors.push(
      `${unparsed.length} "**…**"-rad(er) i en region-sektion gick inte att tolka som park ` +
        `(trolig markdown-formatering):\n` +
        unparsed.map((u) => `      ${u}`).join('\n')
    );
  }
  if (parks.length < MIN_PARKS) {
    errors.push(`bara ${parks.length} parker tolkade (förväntar minst ${MIN_PARKS})`);
  }

  const byRegion = parks.reduce<Record<string, number>>((acc, p) => {
    acc[p.region] = (acc[p.region] ?? 0) + 1;
    return acc;
  }, {});
  for (const r of REQUIRED_REGIONS) {
    if (!byRegion[r]) errors.push(`region "${r}" har 0 parker`);
  }

  const ids = new Map<string, number>();
  for (const p of parks) ids.set(p.id, (ids.get(p.id) ?? 0) + 1);
  const dupes = [...ids].filter(([, n]) => n > 1).map(([id]) => id);
  if (dupes.length) errors.push(`dubbletter av id: ${dupes.join(', ')}`);

  return errors;
}

function writeData(parks: Skatepark[]): void {
  const banner =
    '// AUTO-GENERERAD av scripts/extract-skateparks.ts (körs som `prebuild`) — redigera inte för hand.\n' +
    '// Källa: content/articles/en/verified-indoor-skateparks-world.md\n' +
    `// Senast genererad: ${new Date().toISOString().slice(0, 10)}\n\n` +
    "import type { Skatepark } from './types';\n\n";
  const body = `export const verifiedIndoorSkateparks: Skatepark[] = ${JSON.stringify(parks, null, 2)};\n`;

  const tmp = `${OUT}.tmp`;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(tmp, banner + body, 'utf-8');
  // Atomiskt byte — en krasch mitt i skrivningen kan inte lämna en
  // halvskriven (korrupt) datafil kvar.
  fs.renameSync(tmp, OUT);
}

function fail(details: string[]): never {
  if (BUILD_MODE) {
    const bar = '─'.repeat(74);
    console.warn(`\n${bar}`);
    console.warn('⚠️  SKATEPARK-EXTRAKTIONEN MISSLYCKADES — bygget fortsätter.');
    console.warn('    Sajten byggs med den SENAST COMMITTADE skatepark-datan;');
    console.warn('    finder:n kan visa inaktuell data tills detta är åtgärdat.');
    console.warn(bar);
    for (const d of details) console.warn(d);
    console.warn(`${bar}\n`);
    process.exit(0);
  }
  console.error('\nSKATEPARK-EXTRAKTIONEN MISSLYCKADES:');
  for (const d of details) console.error(`  ${d}`);
  console.error('\nDatafilen lämnades orörd.');
  process.exit(1);
}

function main(): void {
  let result: { parks: Skatepark[]; unparsed: string[] };
  try {
    result = extract();
  } catch (err) {
    fail([`kunde inte läsa/tolka artikeln: ${(err as Error).message}`]);
  }

  const errors = validate(result.parks, result.unparsed);
  if (errors.length) fail(errors.map((e) => `• ${e}`));

  try {
    writeData(result.parks);
  } catch (err) {
    fail([`kunde inte skriva datafilen: ${(err as Error).message}`]);
  }

  const byRegion = result.parks.reduce<Record<string, number>>((acc, p) => {
    acc[p.region] = (acc[p.region] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`skatepark-data: ${result.parks.length} parker`, byRegion);
  console.log(`  med varning: ${result.parks.filter((p) => p.warning).length}`);
  console.log(`  utan adress: ${result.parks.filter((p) => !p.addresses.length).map((p) => p.name).join(', ') || '—'}`);
  console.log(`  skrev ${path.relative(process.cwd(), OUT)}`);
}

main();
