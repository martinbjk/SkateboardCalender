import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * GitHub Pages-hosting: sajten ligger under <user>.github.io/<repo-namn>/
 * (om det inte är en user/org root-sajt eller en egen domän är kopplad).
 * NEXT_PUBLIC_BASE_PATH sätts av .github/workflows/pages-deploy.yml
 * automatiskt till "/<repo-namn>" vid varje bygge. Lokalt (npm run dev)
 * är den tom, så localhost:3000 fungerar som vanligt.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Statisk export: bygger till ren HTML/CSS/JS i /out, ingen Node-server
  // behövs. Det är detta GitHub Pages kräver (den kan bara servera filer).
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    // next/image's optimerings-API kräver en server. GitHub Pages har
    // ingen, så vi stänger av optimering. Vi använder inga <Image>-
    // komponenter i dagsläget, men detta gör det säkert om det görs senare.
    unoptimized: true
  }
};

export default withNextIntl(nextConfig);
