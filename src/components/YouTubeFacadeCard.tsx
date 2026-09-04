"use client";

import { useState } from "react";

interface Props {
  videoId: string;
  title: string;
  channelName?: string;
  isLive?: boolean;
}

/**
 * "Facade"-mönster: vi visar bara en tumnagelbild + play-knapp.
 * Det riktiga <iframe> (som drar ner YouTubes egen JS, ~1MB+)
 * skapas ENDAST när användaren klickar. Det här är den enskilt
 * viktigaste optimeringen för att inte kalendersidan/mediasidan
 * ska kännas tung — särskilt viktigt eftersom vi har flera
 * videokort på samma sida.
 */
export default function YouTubeFacadeCard({ videoId, title, channelName, isLive }: Props) {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900">
      {loaded ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={`Spela ${title}`}
          className="absolute inset-0 flex h-full w-full flex-col justify-end bg-cover bg-center text-left"
          style={{ backgroundImage: `url(${thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
          {isLive && (
            <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
          )}
          <span className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-black">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <div className="relative z-10 p-3">
            <p className="line-clamp-2 text-sm font-semibold text-white">{title}</p>
            {channelName && <p className="text-xs text-zinc-300">{channelName}</p>}
          </div>
        </button>
      )}
    </div>
  );
}
