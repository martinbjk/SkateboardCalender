"use client";

import { useState } from "react";

interface Props {
  videoId: string;
  thumbnailUrl: string | null;
  title: string | null;
  caption?: string | null;
}

export default function VimeoFacadeCard({ videoId, thumbnailUrl, title, caption }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="overflow-hidden rounded-xl">
      <div className="relative aspect-video w-full bg-zinc-900">
        {loaded ? (
          <iframe
            className="h-full w-full"
            src={`https://player.vimeo.com/video/${videoId}`}
            title={title ?? "Vimeo-video"}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={`Spela ${title ?? "video"}`}
            className="group absolute inset-0 flex h-full w-full items-center justify-center bg-cover bg-center"
            style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
          >
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-black">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-zinc-400">{caption}</figcaption>
      )}
    </figure>
  );
}
