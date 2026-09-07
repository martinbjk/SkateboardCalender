/**
 * ONE-OFF EXTRACTOR — kör om vid behov, inte del av bygget.
 *
 *   npx tsx scripts/extract-skateparks.ts
 *
 * Läser content/articles/en/verified-indoor-skateparks-world.md och plockar
 * ut varje verifierad park (region-sektionerna Europe / North America &
 * Mexico / Asia / Oceania) till strukturerad data i
 * src/lib/article-embeds/skateparks/verified-indoor-skateparks-world.data.ts
 *
 * "## Bonus:"-parken (Guangzhou) och "## More Swedish indoor halls"-tabellen
 * hoppas MEDVETET över — de saknar den verifierade adress/sajt/e-post som
 * varje finder-post har och renderas kvar som vanlig artikeltext.
 *
 * Efter körning: ögna igenom räknarna nedan mot artikeln och spot-checka
 * ~10 poster innan du committar den genererade filen.
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'content', 'articles', 'en', 'verified-indoor-skateparks-world.md');
const OUT = path.join(
  process.cwd(),
  'src',
  'lib',
  'article-embeds',
  'skateparks',
  'verified-indoor-skateparks-world.data.ts'
);

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
  let location = raw
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

function main() {
  const md = fs.readFileSync(SRC, 'utf-8').replace(/^---\n[\s\S]*?\n---\n/, '');
  const lines = md.split('\n');

  const parks: Skatepark[] = [];
  let region: string | null = null;
  let block: string[] = [];

  const flush = () => {
    if (region && block.length) {
      const park = parseParkBlock(block, region);
      if (park) parks.push(park);
      else if (block[0]?.startsWith('**')) {
        console.warn(`⚠️  Kunde inte tolka block: ${block[0]}`);
      }
    }
    block = [];
  };

  for (const line of lines) {
    const heading = line.match(/^##\s+/);
    if (heading) {
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

  // Kontroller
  const ids = new Map<string, number>();
  for (const p of parks) ids.set(p.id, (ids.get(p.id) ?? 0) + 1);
  const dupes = [...ids].filter(([, n]) => n > 1);
  if (dupes.length) console.warn('⚠️  Dubbletter av id:', dupes);

  const byRegion = parks.reduce<Record<string, number>>((acc, p) => {
    acc[p.region] = (acc[p.region] ?? 0) + 1;
    return acc;
  }, {});
  console.log('Parker per region:', byRegion);
  console.log('Totalt:', parks.length);
  console.log('Utan adress:', parks.filter((p) => p.addresses.length === 0).map((p) => p.name));
  console.log('Med varning:', parks.filter((p) => p.warning).map((p) => `${p.name} — ${p.warning}`));

  const banner =
    '// AUTO-GENERERAD av scripts/extract-skateparks.ts — redigera inte för hand.\n' +
    '// Källa: content/articles/en/verified-indoor-skateparks-world.md\n' +
    `// Senast genererad: ${new Date().toISOString().slice(0, 10)}\n\n` +
    "import type { Skatepark } from './types';\n\n";

  const body = `export const verifiedIndoorSkateparks: Skatepark[] = ${JSON.stringify(parks, null, 2)};\n`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, banner + body, 'utf-8');
  console.log(`\nSkrev ${parks.length} parker → ${path.relative(process.cwd(), OUT)}`);
}

main();
