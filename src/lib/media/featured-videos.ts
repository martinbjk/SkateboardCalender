
/**
 * FEATURED VIDEOS — för artikel-frontmatter
 * ---------------------------------------------------------------
 * Lägg till i en artikels frontmatter (content/articles/sv|en/din-artikel.md):
 *
 *   ---
 *   title: "..."
 *   category: reportage
 *   videos:
 *     - platform: youtube
 *       url: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
 *       caption: "Varför den här klippet är sjukt bra"
 *     - platform: vimeo
 *       url: "https://vimeo.com/123456789"
 *     - platform: instagram
 *       url: "https://www.instagram.com/p/XXXXXXXXXXX/"
 *   ---
 *
 * Detta kräver INGEN MDX — det är bara data i frontmatter. Er
 * artikel-mall (den React-komponent som renderar en artikel) läser
 * `frontmatter.videos` och skickar in det i <FeaturedVideos />.
 * Se README-featured-videos.md för själva inkopplingen.
 */

export type VideoPlatform = "youtube" | "vimeo" | "instagram";

export interface FeaturedVideoInput {
  platform: VideoPlatform;
  url: string;
  /** Kort bildtext under videon, t.ex. "Finalkörningen i damklassen" */
  caption?: string;
  /**
   * Er egen text OVANFÖR videon — några meningar om varför ni valde
   * den, vad som händer i klippet, eller er reflektion. DET HÄR är
   * biten som gör sidan unik och läsvärd (skiljer den från en ren
   * embed-lista) — skriv den i er egen röst.
   */
  intro?: string;
}

export interface ResolvedYoutubeVideo {
  platform: "youtube";
  videoId: string;
  caption?: string;
  intro?: string;
}

export interface ResolvedVimeoVideo {
  platform: "vimeo";
  videoId: string;
  thumbnailUrl: string | null;
  title: string | null;
  caption?: string;
  intro?: string;
}

export interface ResolvedInstagramVideo {
  platform: "instagram";
  url: string; // instagram-embed.js behöver bara originalURL:en
  caption?: string;
  intro?: string;
}

export type ResolvedVideo =
  | ResolvedYoutubeVideo
  | ResolvedVimeoVideo
  | ResolvedInstagramVideo
  | { platform: "error"; message: string };

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

async function resolveVimeo(
  url: string,
  caption?: string,
  intro?: string
): Promise<ResolvedVideo> {
  const videoId = extractVimeoId(url);
  if (!videoId) {
    return { platform: "error", message: `Kunde inte tolka Vimeo-URL: ${url}` };
  }
  try {
    // Vimeos publika oEmbed-endpoint — ingen API-nyckel behövs för publika videor.
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 86400 } } // thumbnails ändras sällan — cacha 1 dygn
    );
    if (!res.ok) {
      return { platform: "vimeo", videoId, thumbnailUrl: null, title: null, caption, intro };
    }
    const data = await res.json();
    return {
      platform: "vimeo",
      videoId,
      thumbnailUrl: data.thumbnail_url ?? null,
      title: data.title ?? null,
      caption,
      intro,
    };
  } catch {
    return { platform: "vimeo", videoId, thumbnailUrl: null, title: null, caption, intro };
  }
}

export async function resolveFeaturedVideos(
  videos: FeaturedVideoInput[]
): Promise<ResolvedVideo[]> {
  return Promise.all(
    videos.map(async (v): Promise<ResolvedVideo> => {
      if (v.platform === "youtube") {
        const videoId = extractYoutubeId(v.url);
        if (!videoId) {
          return { platform: "error", message: `Kunde inte tolka YouTube-URL: ${v.url}` };
        }
        return { platform: "youtube", videoId, caption: v.caption, intro: v.intro };
      }
      if (v.platform === "vimeo") {
        return resolveVimeo(v.url, v.caption, v.intro);
      }
      if (v.platform === "instagram") {
        return { platform: "instagram", url: v.url, caption: v.caption, intro: v.intro };
      }
      return { platform: "error", message: `Okänd plattform i frontmatter: ${(v as any).platform}` };
    })
  );
}
