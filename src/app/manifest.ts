import type { MetadataRoute } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skate Event Calendar',
    short_name: 'SkateCal',
    description: 'Alla skateboardtävlingar i världen, samlade på ett ställe.',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#101012',
    theme_color: '#101012',
    orientation: 'portrait-primary',
    icons: [
      { src: `${basePath}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${basePath}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: `${basePath}/icons/icon-maskable-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
