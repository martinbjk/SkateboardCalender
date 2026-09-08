// src/components/FeaturedVideos/FeaturedVideos.tsx
//
// Same dark/neon visual design as before (all colors, fonts, layout
// inside are untouched) — the only change is an outer card frame so it
// reads as one contained box, same width as the article cards, instead
// of breaking out to full page width.
//
// Meant to sit INSIDE the same `mx-auto max-w-3xl` container as the
// articles list, right after the articles div.
//
// Requires a `locale` prop (e.g. "en", "sv") so the section's share link
// includes the language prefix the site's routing requires — without it,
// the shared URL 404s.
import { ShareButton } from '@/components/ShareButton';
import { featuredVideos } from '@/data/featured-videos';
import styles from './FeaturedVideos.module.css';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';

export default function FeaturedVideos({ locale }: { locale: string }) {
  const sectionUrl = `${SITE_URL}/${locale}/articles#featured-videos`;

  return (
    <div className="mt-10 overflow-hidden rounded-stamp border border-asphalt-700/30 shadow-card dark:border-chalk-500/15">
      <section id="featured-videos" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerRow}>
              <h2>Featured Videos</h2>
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
    </div>
  );
}
