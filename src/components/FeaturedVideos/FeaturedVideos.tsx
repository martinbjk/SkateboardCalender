// src/components/FeaturedVideos/FeaturedVideos.tsx
//
// Usage: import and render inside your /articles page:
//
//   import FeaturedVideos from "@/components/FeaturedVideos/FeaturedVideos";
//   ...
//   <ArticlesList ... />
//   <FeaturedVideos />
//
// No props needed — it reads everything from src/data/featured-videos.ts.
//
// ASSUMPTION TO VERIFY: import path below is "@/components/ShareButton" —
// change it if your ShareButton.tsx file lives somewhere else.
import { ShareButton } from "@/components/ShareButton";
import { featuredVideos } from "@/data/featured-videos";
import styles from "./FeaturedVideos.module.css";

// ASSUMPTION TO VERIFY: replace with your existing site-URL constant if you
// already have one (e.g. from the lib you used to fix the OG absolute-URL bug).
const SITE_URL = "https://skateboardeventcalendar.com";

export default function FeaturedVideos() {
  const sectionUrl = `${SITE_URL}/articles#featured-videos`;

  return (
    <section id="featured-videos" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <h2>Featured Videos</h2>
            {/* NOTE: ShareButton's styling assumes it sits on a theme-aware
                background (light/dark). This section is always dark, so the
                "dark" wrapper class below nudges Tailwind's dark: variants on —
                only works if your Tailwind dark mode strategy is "class". If
                the button looks wrong (e.g. invisible border) in light theme,
                this is the line to revisit. */}
            <span className="dark">
              <ShareButton url={sectionUrl} title="Featured Videos – Skateboard Calendar" />
            </span>
          </div>
          <p>A few videos worth watching</p>
        </div>

        <div className={styles.tagStrip} />

        <div className={styles.grid}>
          {featuredVideos.map((video) => {
            const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
            return (
              <article key={video.id} className={styles.card}>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.thumb}
                  aria-label={`Watch: ${video.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                  />
                  <span className={styles.playBadge}>
                    <svg viewBox="0 0 24 24" fill="var(--fv-neon-yellow)">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </a>

                <div className={styles.cardContent}>
                  <div className={styles.cardTitleRow}>
                    <h3>{video.title}</h3>
                    <span className="dark">
                      <ShareButton url={videoUrl} title={video.title} text={video.intro} />
                    </span>
                  </div>
                  <p className={styles.intro}>{video.intro}</p>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.watchBtn}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch video
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
