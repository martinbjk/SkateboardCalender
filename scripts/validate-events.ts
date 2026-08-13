/**
 * Validerar samtliga data/events/*.json mot schema.ts.
 * Körs via `npm run validate-events` lokalt, och automatiskt i CI
 * (.github/workflows/validate-events.yml) på varje Pull Request som
 * rör /data/events/**.
 *
 * Avslutar med exit code 1 om något fel hittas, så att CI failar tydligt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { SkateEventSchema } from '../src/lib/schema';

const EVENTS_DIR = path.join(process.cwd(), 'data', 'events');

function main() {
  if (!fs.existsSync(EVENTS_DIR)) {
    console.error(`Hittar inte mappen ${EVENTS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.warn('Inga eventfiler hittades i data/events/.');
  }

  let hasErrors = false;
  const seenSlugs = new Set<string>();

  for (const file of files) {
    const fullPath = path.join(EVENTS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      console.error(`✗ ${file}\n  Ogiltig JSON: ${(err as Error).message}`);
      hasErrors = true;
      continue;
    }

    const result = SkateEventSchema.safeParse(json);
    if (!result.success) {
      console.error(`✗ ${file}`);
      for (const issue of result.error.issues) {
        console.error(`    - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
      }
      hasErrors = true;
      continue;
    }

    const { slug, startDate, endDate } = result.data;

    if (slug !== file.replace(/\.json$/, '')) {
      console.error(`✗ ${file}\n    - slug "${slug}" matchar inte filnamnet`);
      hasErrors = true;
      continue;
    }

    if (seenSlugs.has(slug)) {
      console.error(`✗ ${file}\n    - dubblett-slug "${slug}"`);
      hasErrors = true;
      continue;
    }
    seenSlugs.add(slug);

    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      console.error(`✗ ${file}\n    - startDate ligger efter endDate`);
      hasErrors = true;
      continue;
    }

    console.log(`✓ ${file}`);
  }

  if (hasErrors) {
    console.error(`\n${files.length} filer kontrollerade — fel hittades ovan.`);
    process.exit(1);
  }

  console.log(`\nAlla ${files.length} eventfiler är giltiga.`);
}

main();
