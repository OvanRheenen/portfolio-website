import { GlobalConfig } from 'payload';

export const Contact: GlobalConfig = {
	slug: 'contact',
	label: 'Contact Page',
	fields: [
		{
			name: 'links',
			type: 'array',
			label: 'Contact rows',
			admin: {
				description:
					'Each row: a medium (e.g. Email), a value (e.g. nina@mail.com), and an optional link (e.g. mailto:nina@mail.com or a profile URL). Leave link empty for a plain, non-clickable row like "Based in".',
			},
			fields: [
				{ name: 'medium', type: 'text', required: true, admin: { description: 'e.g. Email, Instagram, Based in' } },
				{ name: 'value', type: 'text', required: true, admin: { description: 'e.g. nina@mail.com, @ninamerk, Amsterdam / Warsaw' } },
				{ name: 'link', type: 'text', required: false, admin: { description: 'Optional. e.g. mailto:nina@mail.com or https://instagram.com/ninamerk. Empty = non-link row.' } },
			],
		},
	],
};
