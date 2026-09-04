/**
 * FEATURED IMAGES — för artikel-frontmatter
 * ---------------------------------------------------------------
 * Samma mönster som featured-videos.ts, men för rena bildartiklar.
 * Bilderna ska laddas upp lokalt i /public (t.ex. /public/articles/
 * bucharest-2026/final.jpg) och refereras med sökvägen som börjar
 * med "/", t.ex. "/articles/bucharest-2026/final.jpg".
 *
 *   ---
 *   title: "..."
 *   category: reportage
 *   images:
 *     - src: "/articles/bucharest-2026/final.jpg"
 *       alt: "Åkare i luften under finalen"
 *       intro: "Det här var hoppet som avgjorde allt..."
 *       caption: "Finalen, Bucharest Skate Open 2026"
 *   ---
 *
 * `alt` är OBLIGATORISKT (tillgänglighet + SEO för bilder) — till
 * skillnad från videornas `caption`/`intro` som är valfria.
 */

export interface FeaturedImageInput {
  /** Sökväg som börjar med "/" — bilden måste ligga i /public */
  src: string;
  /** Obligatorisk — beskriv vad bilden visar, för skärmläsare och Google Bildsök */
  alt: string;
  /** Er egen text OVANFÖR bilden — samma syfte som videornas intro */
  intro?: string;
  /** Kort bildtext UNDER bilden */
  caption?: string;
}
