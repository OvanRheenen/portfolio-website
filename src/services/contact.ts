import { getPayload } from 'payload'
import config from '@payload-config'

export type ContactLink = { medium: string; value: string; link: string | null }

export async function getContact(): Promise<ContactLink[]> {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'contact' })
  return (data.links ?? []).map((l) => ({
    medium: l.medium,
    value: l.value,
    link: l.link?.trim() ? l.link.trim() : null,
  }))
}
