import type { ReactNode } from 'react';
import { SkateparkFinder } from '@/components/article-embeds/SkateparkFinder';
import { verifiedIndoorSkateparks } from './skateparks/verified-indoor-skateparks-world.data';

/**
 * ARTIKEL-EMBEDS — vilka artiklar som byter ut en del av sin markdown-
 * kropp mot en interaktiv komponent, och exakt vilken del.
 *
 * Detektering = exakt slug-match mot den här tabellen. Artiklar som inte
 * står här renderas helt oförändrat.
 *
 * `splice.from` / `splice.to`: allt i markdown-kroppen FRÅN och med `from`
 * TILL (men inte med) `to` klipps bort och ersätts av `render()`. Resten
 * (intro, bilder, tabeller, checklista, "More Swedish indoor halls" …)
 * renderas som vanligt. Saknas någon markör, eller ligger de i fel
 * ordning, kastar sidan ett fel vid build i stället för att tyst tappa
 * innehåll — se spliceArticleEmbed i articles/[slug]/page.tsx.
 */
export interface ArticleEmbed {
  splice: { from: string; to: string };
  render: () => ReactNode;
}

export const ARTICLE_EMBEDS: Record<string, ArticleEmbed> = {
  'verified-indoor-skateparks-world': {
    // Ersätter de fyra verifierade region-sektionerna (Europe … Oceania).
    // "## Bonus:"-parken och "More Swedish indoor halls" ligger efter `to`
    // och renderas därför kvar som vanlig text.
    splice: { from: '\n## Europe\n', to: '\n## Bonus:' },
    render: () => <SkateparkFinder parks={verifiedIndoorSkateparks} />
  }
};
