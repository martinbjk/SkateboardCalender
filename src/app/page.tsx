'use client';

import { useEffect } from 'react';

/**
 * Ersätter det middleware tidigare gjorde (auto-redirect "/" → "/sv").
 * Statisk export (GitHub Pages) har ingen server som kan göra det per
 * request, så vi gör det i klienten istället — plus en synlig länk och
 * en <meta refresh> som fallback om JavaScript är avstängt.
 *
 * OBS: relativ länk ("sv/", inte "/sv/") med flit — då fungerar det
 * oavsett om sajten ligger på en rot-domän eller under ett basePath
 * som /skate-event-calendar/ (GitHub Pages projekt-sajter).
 *
 * Ingen egen <html>/<head>/<body> här — de kommer från
 * src/app/layout.tsx som redan omsluter den här sidan. <meta>-taggen
 * hoistas ändå automatiskt till <head> av Next.js (samma inbyggda
 * beteende som för title/meta/link i App Router).
 */
export default function RootRedirectPage() {
  useEffect(() => {
    window.location.replace('sv/');
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content="0; url=sv/" />
      <p style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        Omdirigerar… Om du inte skickas vidare automatiskt,{' '}
        <a href="sv/">klicka här</a>.
      </p>
    </>
  );
}
