'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from '../Homepage.module.scss'
import { useFilter } from './filterStore'
import type { Work } from './types'
import { isVideo } from '@/services/media'
import ProjectMedia from './ProjectMedia'

type Props = { works: Work[] }

// Scatter `count` dots within the field box (measured in px), keeping centers at
// least 80% of a dot's size apart so dots never fully overlap. Returns positions
// as percentages of the box for absolute placement.
function scatterDots(count: number, width: number, height: number, dotSize: number) {
  const minDist = dotSize * 0.8
  const margin = dotSize / 2 // half a dot, so each sits fully inside the box
  const pts: Array<{ x: number; y: number }> = []

  for (let i = 0; i < count; i++) {
    let candidate = { x: 0, y: 0 }
    // Rejection-sample; fall back to the last try if the box is too crowded.
    for (let attempt = 0; attempt < 30; attempt++) {
      candidate = {
        x: margin + Math.random() * Math.max(0, width - 2 * margin),
        y: margin + Math.random() * Math.max(0, height - 2 * margin),
      }
      if (pts.every(p => (p.x - candidate.x) ** 2 + (p.y - candidate.y) ** 2 >= minDist ** 2)) break
    }
    pts.push(candidate)
  }

  return pts.map(p => ({ x: (p.x / width) * 100, y: (p.y / height) * 100 }))
}

// Read a px-valued CSS custom prop off :root, falling back if unset.
const cssPx = (name: string, fallback: number) =>
  parseInt(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback

export default function MobileHome({ works }: Props) {
  const { effective } = useFilter()
  const [positions, setPositions] = useState<Array<{ x: number; y: number }> | null>(null)
  const [stripShown, setStripShown] = useState(false)

  const dotfieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Client-only: Math.random() + measured box would mismatch SSR.
    const field = dotfieldRef.current
    if (!field) return
    const { width, height } = field.getBoundingClientRect()
    setPositions(scatterDots(works.length, width, height, cssPx('--dot-size', 30)))
  }, [works.length])

  // Reveal the sticky strip once the dot field has scrolled out from under the header.
  useEffect(() => {
    // Open once the dot field reaches the strip's lower edge, so a scroll-to-work
    // (which lands the work at header + strip) finds the strip already open.
    const revealLine = cssPx('--header-height', 60) + cssPx('--m-strip-height', 50)

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const df = dotfieldRef.current
        setStripShown(!!df && df.getBoundingClientRect().bottom <= revealLine)
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToWork = (id: string) => {
    document.getElementById(`mwork-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isFaded = (work: Work) => !!effective && work.category !== effective

  // Shared punchhole-dot button for the scatter field and the sticky strip.
  // sizes defaults to the dot box (kept in sync with --dot-size in globals.css).
  const renderDot = (
    work: Work,
    opts: { className: string; sizes?: string; style?: React.CSSProperties; eager?: boolean },
  ) => (
    <button
      key={work.id}
      className={`${opts.className} ${isFaded(work) ? styles.isFaded : ''}`}
      style={opts.style}
      aria-label={work.title}
      onClick={() => scrollToWork(work.id)}
    >
      <Image
        src={work.punchholeUrl}
        alt={work.title}
        fill
        sizes={opts.sizes ?? '30px'}
        loading={opts.eager ? 'eager' : undefined}
        className={styles.cover}
      />
    </button>
  )

  return (
    <div className={styles.mobile}>
      <div className={styles.mDotfield} ref={dotfieldRef}>
        {positions?.map((p, i) =>
          renderDot(works[i], {
            className: styles.mDot,
            style: { left: `${p.x}%`, top: `${p.y}%` },
            eager: true,
          }),
        )}
      </div>

      <div
        className={styles.mStrip}
        data-shown={stripShown ? '1' : '0'}
        aria-label="Works"
      >
        {works.map(work => renderDot(work, { className: styles.mStripDot }))}
      </div>

      <div className={styles.mWorks}>
        {works.map(work => (
          <article key={work.id} id={`mwork-${work.id}`} className={styles.mWork}>
            {work.projectImages.length > 1 ? (
              <div className={styles.mGallery}>
                <div className={styles.mTrack}>
                  {work.projectImages.map(img => (
                    <div key={img.url} className={styles.mSlide}>
                      <ProjectMedia asset={img} title={work.title} fill sizes="100vw" className={styles.cover} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.mWorkImg}>
                {/* single video plays inline; otherwise show the curated preview image */}
                {work.projectImages.length === 1 && isVideo(work.projectImages[0]) ? (
                  <ProjectMedia asset={work.projectImages[0]} title={work.title} fill className={styles.cover} />
                ) : (
                  <Image src={work.previewUrl} alt={work.title} fill sizes="100vw" className={styles.cover} />
                )}
              </div>
            )}
            <p className={styles.mWorkMeta}>{work.medium} · {work.year}</p>
            <h3 className={styles.mWorkTitle}>{work.title}</h3>
            {work.description && <p className={styles.mWorkDesc}>{work.description}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}
