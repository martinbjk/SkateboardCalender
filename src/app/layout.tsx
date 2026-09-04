import type { ReactNode } from 'react';
import './globals.css';

/**
 * Rot-layout (utanför /[locale]). Innehåller <html>/<body> eftersom det,
 * utan middleware (se not i README om GitHub Pages-varianten), inte
 * längre finns någon serverkod som fångar upp "/" innan rendering.
 * "/"-sidan (src/app/page.tsx) och alla /[locale]/-sidor renderas båda
 * genom denna layout. Själva språket på <html lang="..."> sätts av en
 * liten klientkomponent i [locale]/layout.tsx, eftersom den (till
 * skillnad från denna rot-layout) vet vilket språk som är aktivt.
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
 * pb-12 här matchar BottomNav:s höjd (h-12/48px) så att den fasta
 * raden aldrig täcker sidans eget innehåll längst ner.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
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
      <body className="font-body flex min-h-screen flex-col pb-12">{children}</body>
    </html>
  );
}
