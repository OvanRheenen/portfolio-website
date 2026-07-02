import Image, { getImageProps } from 'next/image'
import { useEffect } from 'react'
import styles from '../Homepage.module.scss'
import { BP_MD } from '@app/lib/breakpoints'
import type { Work } from './types'

// 50/50 Split above the md breakpoint, then single column below
const PREVIEW_SIZES = `(max-width: ${BP_MD}px) 100vw, 50vw`

type Props = { work: Work }

export default function WorkPreview({ work }: Props) {
  return (
    <div className={styles.image}>
      <Image
        src={work.preview.url}
        alt={work.title}
        fill
        sizes={PREVIEW_SIZES}
        className={styles.previewImage}
      />
    </div>
  )
}

// To preload all the preview images on the homepage, so they appear instantly on hover.
export function PreloadPreviews({ works }: { works: Work[] }) {
  useEffect(() => {
    for (const work of works) {
      const { props } = getImageProps({
        src: work.preview.url,
        alt: '',
        fill: true,
        sizes: PREVIEW_SIZES,
      })
      const img = new window.Image()
      if (props.sizes) img.sizes = props.sizes
      if (props.srcSet) img.srcset = props.srcSet
      img.src = props.src
    }
  }, [works])
  return null
}
