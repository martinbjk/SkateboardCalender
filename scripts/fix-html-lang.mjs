/**
 * POSTBUILD — kör automatiskt efter `next build` (se package.json).
 *
 * Rot-layouten (src/app/layout.tsx) äger <html> och måste hårdkoda ett
 * lang-värde ("sv"), eftersom <html> ligger OVANFÖR /[locale]/ i trädet
 * och statisk export inte har någon middleware som kan sätta det per
 * språk vid rendering. Följden: varje exporterad sida får lang="sv".
 *
 * Här skrivs attributet om per fil utifrån sökvägen i /out:
 *   out/sv/**  -> lang="sv"   out/de/**  -> lang="de"   ... osv
 *   out/index.html, out/404.html (språkneutrala) -> lang="en"
 *
 * Skriptet FAILAR bygget om någon .html blir kvar med fel lang, så en
 * framtida omstrukturering inte tyst kan återinföra problemet.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const OUT = process.env.OUT_DIR ?? 'out';
const LOCALES = ['sv', 'en', 'de', 'fr', 'es', 'pt', 'ja'];
const DEFAULT_LANG = 'en';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

function wantedLang(file) {
  const first = relative(OUT, file).split(sep)[0];
  return LOCALES.includes(first) ? first : DEFAULT_LANG;
}

let checked = 0;
let rewritten = 0;
const stragglers = [];

for await (const file of htmlFiles(OUT)) {
  checked++;
  const want = wantedLang(file);
  const html = await readFile(file, 'utf8');
  const fixed = html.replace(
    /(<html\b[^>]*?\blang=")[A-Za-z-]+(")/,
    (_m, pre, post) => `${pre}${want}${post}`
  );
  if (fixed !== html) {
    await writeFile(file, fixed);
    rewritten++;
  }
  if (new RegExp(`<html\\b[^>]*?\\blang="(?!${want}")[A-Za-z-]+"`).test(fixed)) {
    stragglers.push(file);
  }
}

console.log(`fix-html-lang: ${checked} HTML files, ${rewritten} rewritten`);

if (stragglers.length) {
  console.error(`fix-html-lang: FAILED — wrong <html lang> still present in ${stragglers.length} file(s):`);
  for (const f of stragglers.slice(0, 20)) console.error(`  ${f}`);
  process.exit(1);
}
