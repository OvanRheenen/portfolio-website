'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './About.module.scss'
import Split from '@app/components/ui/Split'
import type { Bio } from '@/services/about'
import { useIsMobile } from '@app/components/hooks/useMediaQuery'
import { BP_MD } from '@app/lib/breakpoints'

const ASPECT = 5 / 4 // .photo height / width
const MIN_GAP = 17 // min center distance, in width-% units

function scatterPunches(count: number) {
  const pts: { x: number; y: number }[] = []
  let guard = 0
  while (pts.length < count && guard < count * 200) {
    guard++
    const x = 14 + Math.random() * 72
    const y = 14 + Math.random() * 72
    const ok = pts.every((p) => {
      const dx = x - p.x
      const dy = (y - p.y) * ASPECT
      return Math.hypot(dx, dy) >= MIN_GAP
    })
    if (ok) pts.push({ x, y })
  }
  return pts
}

type Props = { bio: Bio; count: number }

export default function AboutBody({ bio, count }: Props) {
  const [punches, setPunches] = useState<{ x: number; y: number }[] | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    // client-only scatter — avoids SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPunches(scatterPunches(count))
  }, [count])

  const photo = (
    <div className={styles.photo}>
      {bio.photoUrl && <Image src={bio.photoUrl} alt="Portrait" loading="eager" fill sizes={`(max-width: ${BP_MD}px) 72vw, 400px`} />}
      {punches?.map((p, i) => (
        <span
          key={i}
          className={styles.punch}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}
    </div>
  )

  const bioContent = (
    <>
      <span className={styles.role}>
        {bio.role}<br />
        {bio.location}
      </span>
      {bio.lead && <p className={styles.lead}>{bio.lead}</p>}
      {bio.paragraphs.map((p, i) => (
        <p className={styles.paragraph} key={i}>{p}</p>
      ))}
    </>
  )

  if (isMobile) {
    return (
      <div className={styles.mAbout}>
        <div className={styles.mPhotoWrap}>{photo}</div>
        <div className={styles.mBio}>{bioContent}</div>
      </div>
    )
  }

  return (
    <Split
      left={
        <div className={styles.content}>
          <div className={styles.bio}>{bioContent}</div>
        </div>
      }
      right={<div className={styles.photoWrap}>{photo}</div>}
    />
  )
}
