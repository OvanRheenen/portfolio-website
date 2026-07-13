import type { Metadata } from 'next'
import AboutBody from '@/app/(app)/(routes)/about'
import { getWorksCount } from '@/services/works'
import { getBio } from '@/services/about'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Nina Merk — background and practice of the mixed media artist and set designer.',
  alternates: { canonical: '/about' },
  openGraph: { url: '/about' },
}

export default async function About() {
  const [count, bio] = await Promise.all([getWorksCount(), getBio()]);
  return (
    <>
      <h1 className="sr-only">About Nina Merk</h1>
      <AboutBody bio={bio} count={count} />
    </>
  );
}
