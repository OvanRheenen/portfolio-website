import Image from 'next/image'
import { isVideo, type MediaAsset } from '@/services/media'
import { useVideoDims } from './videoPreload'

type Props = {
  asset: MediaAsset
  title: string
  className?: string
  // Fill mode (mobile, fixed-aspect wrappers) vs. intrinsic width/height (desktop gallery).
  fill?: boolean
  sizes?: string
  // Opt in to eager loading for above-the-fold assets; defaults to lazy.
  eager?: boolean
}

// Renders a project asset as an autoplaying muted video or a next/image,
// owning the video attribute set so consumers don't repeat the branch.
export default function ProjectMedia({ asset, title, className, fill, sizes, eager }: Props) {
  // Prevent layout shift by preloading the video dimensions, if it's a video.
  const videoDims = useVideoDims(isVideo(asset) ? asset.url : null)

  if (isVideo(asset)) {
    return (
      <video
        src={asset.url}
        width={videoDims?.width}
        height={videoDims?.height}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        className={className}
      />
    )
  }

  return fill ? (
    <Image src={asset.url} alt={title} fill sizes={sizes} priority={eager} className={className} />
  ) : (
    <Image src={asset.url} alt={title} width={asset.width} height={asset.height} sizes={sizes} priority={eager} className={className} />
  )
}
