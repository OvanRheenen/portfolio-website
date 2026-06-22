import AboutBody from '@/app/(app)/(routes)/about'
import { getWorksCount } from '@/services/works'
import { getBio } from '@/services/about'

export const revalidate = 60

export default async function About() {
  const [count, bio] = await Promise.all([getWorksCount(), getBio()]);
  return <AboutBody bio={bio} count={count} />;
}
