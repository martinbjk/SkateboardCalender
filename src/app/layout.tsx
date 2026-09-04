import type { ReactNode } from 'react';
import BottomNav from '@/components/nav/BottomNav';
import './globals.css';
/**
 * Rot-layout (utanför /[locale]). Innehåller <html>/<body> eftersom det,
 * utan middleware (se not i README om GitHub Pages-varianten), inte
 * längre finns någon serverkod som fångar upp "/" innan rendering.
 * "/"-sidan (src/app/page.tsx) och alla /[locale]/-sidor renderas båda
 * genom denna layout. Själva språket på <html lang="..."> sätts av en
 * liten klientkomponent i [locale]/layout.tsx, eftersom den (till
 * skillnad från denna rot-layout) vet vilket språk som är aktivt.
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
      <body className="font-body flex min-h-screen flex-col pb-16">{children}<BottomNav /></body>
    </html>
  );
}
