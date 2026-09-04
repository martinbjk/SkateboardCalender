import Image from "next/image";
import type { FeaturedImageInput } from "@/lib/media/featured-images";

interface Props {
  images: FeaturedImageInput[];
}

/**
 * Rendera i er artikel-mall precis som FeaturedVideos:
 *   {frontmatter.images?.length ? <FeaturedImages images={frontmatter.images} /> : null}
 *
 * En artikel kan alltså ha `images`, `videos`, båda, eller inget —
 * de är helt oberoende fält i frontmatter.
 */
export default function FeaturedImages({ images }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
      {images.map((image, i) => (
        <figure key={i}>
          {image.intro && (
            <p className="mb-3 text-sm leading-relaxed text-zinc-300">{image.intro}</p>
          )}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-900">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-2 text-sm text-zinc-400">{image.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
