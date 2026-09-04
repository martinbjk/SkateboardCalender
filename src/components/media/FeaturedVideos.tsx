import { resolveFeaturedVideos, type FeaturedVideoInput } from "@/lib/media/featured-videos";
import YouTubeFacadeCard from "./YouTubeFacadeCard";
import VimeoFacadeCard from "./VimeoFacadeCard";
import InstagramPostEmbed from "./InstagramPostEmbed";

interface Props {
  videos: FeaturedVideoInput[];
}

/**
 * Rendera i er artikel-mall, t.ex:
 *   {frontmatter.videos?.length ? <FeaturedVideos videos={frontmatter.videos} /> : null}
 * Se README-featured-videos.md för var i mallen den bör placeras.
 */
export default async function FeaturedVideos({ videos }: Props) {
  if (!videos || videos.length === 0) return null;
  const resolved = await resolveFeaturedVideos(videos);

  return (
    <div className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
      {resolved.map((video, i) => {
        if (video.platform === "error") {
          // Visas bara för er (skribenter), inte tänkt att synas i
          // produktion. Hjälper er hitta en felstavad URL snabbt.
          return (
            <div
              key={i}
              className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-red-800 bg-red-950/30 p-4 text-center text-xs text-red-400"
            >
              {video.message}
            </div>
          );
        }

        return (
          <div key={i}>
            {video.intro && (
              <p className="mb-3 text-sm leading-relaxed text-zinc-300">{video.intro}</p>
            )}
            {video.platform === "youtube" && (
              <YouTubeFacadeCard
                videoId={video.videoId}
                title={video.caption ?? "Utvald video"}
              />
            )}
            {video.platform === "vimeo" && (
              <VimeoFacadeCard
                videoId={video.videoId}
                thumbnailUrl={video.thumbnailUrl}
                title={video.title}
                caption={video.caption}
              />
            )}
            {video.platform === "instagram" && (
              <InstagramPostEmbed url={video.url} caption={video.caption} />
            )}
          </div>
        );
      })}
    </div>
  );
}
