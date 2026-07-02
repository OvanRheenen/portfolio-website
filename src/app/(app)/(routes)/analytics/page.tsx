import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAnalytics, resolveRange } from '@/services/analytics'
import Analytics from './index'

export const revalidate = 300

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; since?: string; until?: string }>
}) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login?redirect=/analytics')

  const resolved = resolveRange(await searchParams)
  const data = await getAnalytics(resolved)
  return <Analytics data={data} resolved={resolved} />
}
