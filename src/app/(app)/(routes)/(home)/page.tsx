import HomepageBody from '@/app/(app)/(routes)/(home)'
import { getWorks } from '@/services/works'

export const revalidate = 60

export default async function Home() {
  const works = await getWorks()
  return <HomepageBody works={works} />
}
