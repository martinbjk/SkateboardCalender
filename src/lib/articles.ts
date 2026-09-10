import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { locales, type Locale } from '@/i18n/config';

export * from './articles-shared';

/**
 * SERVER-ONLY. Läser Markdown-artiklarna i /content/articles/<locale>/*.md,
 * validerar deras YAML-frontmatter mot ArticleFrontmatterSchema och
 * returnerar dem som strukturerad data. Samma "validera-eller-kasta"-
 * mönster som src/lib/events.ts: en trasig fil får `next build` (eller
 * CI) att misslyckas med filnamn i felmeddelandet, hellre än att visa
 * trasig data live.
 *
 * Importera ALDRIG denna fil från en 'use client'-komponent — den
 * använder node:fs. Rena hjälpfunktioner utan filsystem ligger i
 * './articles-shared' (t.ex. resolveArticleImage, formatArticleDate).
 */

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

/**
 * När en artikel inte finns på den efterfrågade locale:n visas den
 * engelska versionen som reserv (med en synlig notis i UI:t). Samma
 * princip som eventbeskrivningarna, som faller tillbaka på engelska för
 * språk utöver sv/en.
 */
const FALLBACK_LOCALE: Locale = 'en';

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug får bara innehålla a-z, 0-9 och bindestreck'),
  category: z.string().min(1),
  lang: z.string().refine(isLocale, 'lang måste vara en känd språkkod (se src/i18n/config.ts)'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date måste vara på formen YYYY-MM-DD'),
  excerpt: z.string().min(1),
  // Valfri: egen text enbart för <meta name="description"> + og/twitter-
  // description. Saknas den faller artikelsidan tillbaka på excerpt, så
  // alla andra artiklar är helt oförändrade.
  metaDescription: z.string().min(1).optional(),
  ogImage: z
    .string()
    .regex(/^\/images\/articles\/.+/, 'ogImage måste vara en absolut /images/articles/…-sökväg')
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;

export interface Article extends ArticleFrontmatter {
  /** Markdown-kroppen (frontmatter borttagen) — renderas av ArticleMarkdown. */
  content: string;
  /**
   * true när artikeln visas på ett annat språk än den efterfrågade
   * locale:n (dvs. den engelska reserven används). Styr "endast på
   * engelska"-notisen i listnings- och artikelsidan.
   */
  isFallback: boolean;
  /**
   * Faktiska pixelmått för ogImage-filen, avlästa ur PNG-headern vid
   * build-tid. Sätts som og:image:width/height i generateMetadata —
   * en delningsbild utan deklarerade mått hoppas ofta över av sociala
   * plattformars crawlers (särskilt Facebook). undefined om filen inte
   * går att läsa eller inte är en PNG.
   */
  ogImageWidth?: number;
  ogImageHeight?: number;
}

/**
 * Läser bredd/höjd ur en PNG:s IHDR-chunk (byte 16–23, big-endian) utan
 * bildbibliotek. Returnerar undefined för saknad fil eller icke-PNG.
 */
function readPngSize(absPath: string): { width: number; height: number } | undefined {
  let fd: number | undefined;
  try {
    fd = fs.openSync(absPath, 'r');
    const header = Buffer.alloc(24);
    const read = fs.readSync(fd, header, 0, 24, 0);
    if (read < 24) return undefined;
    // PNG-signatur: 89 50 4E 47 0D 0A 1A 0A
    if (header.readUInt32BE(0) !== 0x89504e47) return undefined;
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
  } catch {
    return undefined;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function listMarkdownFiles(locale: string): string[] {
  const dir = path.join(ARTICLES_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function parseArticleFile(locale: string, file: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, locale, file), 'utf-8');
  const { data, content } = matter(raw);

  const result = ArticleFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Frontmatter-fel i content/articles/${locale}/${file}:\n${issues}`);
  }

  const frontmatter = result.data;
  const expectedSlug = file.replace(/\.md$/, '');
  if (frontmatter.slug !== expectedSlug) {
    throw new Error(
      `content/articles/${locale}/${file}: "slug" (${frontmatter.slug}) matchar inte filnamnet.`
    );
  }

  // ogImage är en rot-relativ sökväg (/images/…) → filen ligger i /public.
  const ogSize = readPngSize(path.join(process.cwd(), 'public', frontmatter.ogImage));

  return {
    ...frontmatter,
    content,
    isFallback: false,
    ogImageWidth: ogSize?.width,
    ogImageHeight: ogSize?.height
  };
}

/**
 * Alla artiklar som ska visas för `locale`, nyast först. Artiklar som
 * saknas på det språket tas med från den engelska mappen och markeras
 * `isFallback: true`.
 */
export function getAllArticles(locale: string): Article[] {
  const primary = listMarkdownFiles(locale).map((f) => parseArticleFile(locale, f));
  const primarySlugs = new Set(primary.map((a) => a.slug));

  const fallback =
    locale === FALLBACK_LOCALE
      ? []
      : listMarkdownFiles(FALLBACK_LOCALE)
          .map((f) => parseArticleFile(FALLBACK_LOCALE, f))
          .filter((a) => !primarySlugs.has(a.slug))
          .map((a): Article => ({ ...a, isFallback: true }));

  return [...primary, ...fallback].sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(locale: string, slug: string): Article | undefined {
  return getAllArticles(locale).find((a) => a.slug === slug);
}

/**
 * Varje unik slug som finns i någon språkmapp — underlag för
 * generateStaticParams på /[locale]/articles/[slug].
 */
export function getAllArticleSlugs(): string[] {
  const slugs = new Set<string>();
  for (const locale of locales) {
    for (const file of listMarkdownFiles(locale)) {
      slugs.add(file.replace(/\.md$/, ''));
    }
  }
  return [...slugs];
}
