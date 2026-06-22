import { GlobalConfig } from 'payload';

export const About: GlobalConfig = {
	slug: 'about',
	label: 'About Page',
	fields: [
		{
			name: 'role',
			type: 'text',
			required: true,
			label: 'Role / short title',
			admin: {
				description: 'A short title or role description, e.g. "Mixed Media Artist & Designer".'
			},
		},
		{
			name: 'location',
			type: 'text',
			required: true,
			label: 'Location',
			admin: {
				description: 'A short (current) location description, e.g. "Amsterdam / Warsaw".'
			},
		},
		{
			name: 'lead',
			type: 'text',
			label: 'Lead sentence',
			admin: {
				description: 'A short one-sentence description. Displayed in clearer font at the top of the bio.'
			},
		},
		{
			name: 'paragraphs',
			type: 'array',
			required: true,
			label: 'Bio paragraphs',
			minRows: 1,
			admin: {
				description: 'The main bio, split up in paragraphs. Displayed as separate paragraphs on the about page.'
			},
			fields: [
				{ name: 'paragraph', type: 'textarea' }
			]
		},
		{
			name: 'photo',
			type: 'upload',
			required: true,
			relationTo: 'media',
			label: 'Profile picture'
		}
	],
};
