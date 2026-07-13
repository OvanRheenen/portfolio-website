import HomepageBody from '@/app/(app)/(routes)/(home)'
import { getWorks } from '@/services/works'
import { SITE_URL } from '@app/lib/site'

export const revalidate = 60

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nina Merk',
  url: SITE_URL,
  jobTitle: 'Mixed Media Artist and Set Designer',
}

export default async function Home() {
  const works = await getWorks()
  return (
    <>
      <h1 className="sr-only">Nina Merk — Mixed Media Artist and Set Designer</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HomepageBody works={works} />
    </>
  )
}
