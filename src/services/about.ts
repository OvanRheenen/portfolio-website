import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from './media'

export type Bio = {
	role: string;
	location: string;
	lead: string | null;
	paragraphs: string[];
	photoUrl: string;
}

export async function getBio(): Promise<Bio> {
	const payload = await getPayload({ config });
	const data = await payload.findGlobal({ slug: 'about', depth: 1 });
	return {
		role: data.role ?? '',
		location: data.location ?? '',
		lead: data.lead ?? null,
		paragraphs: (data.paragraphs ?? [])
			.map((p) => p.paragraph)
			.filter((p): p is string => typeof p === 'string'),
		photoUrl: typeof data.photo === 'object' && data.photo ? mediaUrl(data.photo) : '',
	}
}
