import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resolveArticleImage } from '@/lib/articles-shared';

/**
 * Renderar en artikels Markdown-kropp med sajtens typografi. Ren
 * server-komponent (ingen 'use client') — react-markdown körs vid
 * build-tid i den statiska exporten.
 *
 * - remark-gfm ger tabeller, task-listor och genomstrykning.
 * - Ingen rå HTML tillåts (react-markdowns standard) — innehållet är
 *   ren Markdown, så vi behöver inte rehype-raw och slipper dess
 *   injektionsrisk.
 * - `img` skriver om relativa bildsökvägar (./images/foo.png) till den
 *   faktiskt serverade sökvägen via resolveArticleImage(slug).
 */
export function ArticleMarkdown({ content, slug }: { content: string; slug: string }) {
  const components: Components = {
    h2: ({ children }) => (
      <h2 className="font-display mt-10 text-2xl tracking-tight text-spray">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-lg font-semibold text-asphalt-900 dark:text-chalk-100">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-4 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="marker:text-chalk-500">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
        className="text-spray underline decoration-spray/40 underline-offset-2 transition hover:decoration-spray"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-asphalt-900 dark:text-chalk-100">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-2 border-spray/50 pl-4 text-sm italic text-asphalt-800/80 dark:text-chalk-300/80">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="mt-8 border-asphalt-700/15 dark:border-chalk-500/10" />,
    code: ({ children }) => (
      <code className="rounded-sm bg-asphalt-900/5 px-1 py-0.5 font-mono-tight text-[0.85em] dark:bg-chalk-100/10">
        {children}
      </code>
    ),
    img: ({ src, alt }) => (
      // Statisk export kör med images.unoptimized — en vanlig <img> är
      // rätt val här (okända mått, sajten använder inte next/image för
      // innehållsbilder). eslint-disable: se motiveringen ovan.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolveArticleImage(src ?? '', slug)}
        alt={alt ?? ''}
        loading="lazy"
        className="mt-6 w-full rounded-stamp border border-asphalt-700/15 dark:border-chalk-500/10"
      />
    ),
    table: ({ children }) => (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-mono-tight text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-asphalt-700/25 text-left uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20">
        {children}
      </thead>
    ),
    th: ({ children }) => <th className="py-2 pr-4 align-top font-bold">{children}</th>,
    tr: ({ children }) => (
      <tr className="border-b border-asphalt-700/10 dark:border-chalk-500/10">{children}</tr>
    ),
    td: ({ children }) => (
      <td className="py-2.5 pr-4 align-top text-asphalt-800/80 dark:text-chalk-300/80">{children}</td>
    )
  };

  return (
    <div className="mt-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
