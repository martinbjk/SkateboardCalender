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
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className="font-body flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
