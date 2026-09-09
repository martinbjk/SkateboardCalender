import type { ReactNode } from 'react';
import './globals.css';

/**
 * Rot-layout (utanför /[locale]). Innehåller <html>/<body> eftersom det,
 * utan middleware (se not i README om GitHub Pages-varianten), inte
 * längre finns någon serverkod som fångar upp "/" innan rendering.
 * "/"-sidan (src/app/page.tsx) och alla /[locale]/-sidor renderas båda
 * genom denna layout. <html lang> går inte att sätta per språk här (den
 * här layouten har ingen locale-param) — värdet nedan är en platshållare
 * som skrivs om per exporterad fil av scripts/fix-html-lang.mjs (körs som
 * `postbuild`, se package.json).
 *
 * VIKTIGT: BottomNav renderas INTE här. Den här layouten saknar
 * NextIntlClientProvider (den finns bara i [locale]/layout.tsx), och
 * BottomNav använder useTranslations() — vilket kraschar utan den
 * providern. Den här filen omsluter även "/_not-found" (404-sidan),
 * som bara går genom rot-layouten och inte genom [locale]/layout.tsx,
 * så en BottomNav här skulle krascha bygget specifikt för den sidan.
 * BottomNav ligger istället i [locale]/layout.tsx, direkt efter
 * <Footer />, där NextIntlClientProvider finns.
 *
 * Botten-paddingen matchar BottomNav:s höjd (h-14 + safe-area) så att
 * den fasta raden aldrig täcker sidans innehåll — men bara på mobil,
 * eftersom BottomNav är `sm:hidden` (sm:pb-0 nollställer på desktop).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  // lang="sv" är en build-tids-platshållare — scripts/fix-html-lang.mjs
  // skriver om den till rätt språk per fil i /out efter `next build`.
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        {/* Cloudflare Web Analytics — cookiefri besöksstatistik, inget samtycke krävs */}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "f96776bf6f1b40c79cb299c6ab382f34"}'
        />
      </head>
      <body className="font-body flex min-h-screen flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
        {children}
      </body>
    </html>
  );
}
