import ContactBody from '@/app/(app)/(routes)/contact'
import { getContact } from '@/services/contact'

export const revalidate = 60

export default async function Contact() {
  const links = await getContact()
  return <ContactBody links={links} />
}
