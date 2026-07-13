import type { Metadata } from 'next'
import ContactBody from '@/app/(app)/(routes)/contact'
import { getContact } from '@/services/contact'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Nina Merk — get in touch for collaborations and inquiries.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact' },
}

export default async function Contact() {
  const links = await getContact()
  return (
    <>
      <h1 className="sr-only">Contact Nina Merk</h1>
      <ContactBody links={links} />
    </>
  )
}
