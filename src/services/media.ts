import type { Media } from '@/payload-types'

/**
 * Build a direct, public Supabase Storage URL for a populated Media doc.
 * Requires the media relation to be populated (Payload query depth >= 1).
 *
 * Supabase S3 endpoint looks like `https://<ref>.supabase.co/storage/v1/s3`;
 * the public object base is `https://<ref>.supabase.co/storage/v1/object/public`.
 */
export function mediaUrl(media: number | Media | null | undefined): string {
  if (!media || typeof media === 'number' || !media.filename) {
    throw new Error(
      'mediaUrl: media is not populated (use query depth >= 1) or has no filename',
    )
  }

  const endpoint = process.env.S3_ENDPOINT
  const bucket = process.env.S3_BUCKET
  if (!endpoint || !bucket) {
    throw new Error('mediaUrl: S3_ENDPOINT or S3_BUCKET is not set')
  }

  const base = endpoint.replace(/\/storage\/v1\/s3\/?$/, '/storage/v1/object/public')
  if (base === endpoint) {
    throw new Error('mediaUrl: S3_ENDPOINT must end with /storage/v1/s3')
  }
  const prefix = media.prefix ?? 'media'
  return `${base}/${bucket}/${prefix}/${encodeURIComponent(media.filename)}`
}

export type MediaAsset = { url: string; width: number; height: number }

/**
 * Build a `next/image`-ready asset (url + intrinsic dimensions) for a populated Media doc.
 * Throws (via `mediaUrl`) if the media is not populated.
 */
export function mediaAsset(media: number | Media | null | undefined): MediaAsset {
  const url = mediaUrl(media)
  const { width, height } = media as Media
  return { url, width: width ?? 0, height: height ?? 0 }
}
