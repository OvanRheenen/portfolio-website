import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl, mediaAsset, type MediaAsset } from './media'

export type Work = {
  id: string
  title: string
  description: string | null
  year: string
  category: '2d' | '3d'
	medium: string
  punchholeUrl: string
  previewUrl: string
  projectImages: MediaAsset[]
}

export async function getWorks(): Promise<Work[]> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'works',
    where: { active: { equals: true } },
    depth: 1,
    pagination: false,
  })

  return docs
    .map((w): Work | null => {
      try {
        return {
          id: String(w.id),
          title: w.title,
          description: w.description ?? null,
          year: String(w.year),
          category: w.category,
          medium: w.medium,
          punchholeUrl: mediaUrl(w.punchholeImage),
          previewUrl: mediaUrl(w.previewImage),
          projectImages: (w.projectImages ?? []).map(mediaAsset),
        }
      } catch (err) {
        console.error(`getWorks: skipping work ${w.id} (${w.title})`, err)
        return null
      }
    })
    .filter((w): w is Work => w !== null)
}
