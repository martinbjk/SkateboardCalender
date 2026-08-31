/**
 * Rot-layoutens generateMetadata (src/app/[locale]/layout.tsx) sätter ett
 * statiskt twitter.images: ['/og-image.png'] för hela sajten. Eftersom
 * eventsidans egen generateMetadata inte skriver över "twitter"-fältet,
 * ärvs den generiska bilden ner — filkonventionen för opengraph-image
 * synkas INTE automatiskt till Twitter-kort i det läget. Genom att
 * återexportera exakt samma bildgenerator under namnet "twitter-image"
 * får Twitter/X-kort samma unika per-event-bild som Facebook/WhatsApp.
 */
export { default, generateStaticParams, size, contentType, alt } from './opengraph-image';
