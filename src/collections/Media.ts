import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: [
			'image/jpeg',
			'image/png',
			'image/webp',
			'image/avif',
			'video/mp4',
			'video/webm'
		],
  },
  fields: [
    {
			name: 'altText',
			type: 'text'
		},
		{
			name: 'usedAsPreview',
			type: 'join',
			collection: 'works',
			on: 'previewImage',
			admin: {
				allowCreate: false,
			},
		},
		{
			name: 'usedAsPunchhole',
			type: 'join',
			collection: 'works',
			on: 'punchholeImage',
			admin: {
				allowCreate: false,
			},
		},
		{
			name: 'usedInProject',
			type: 'join',
			collection: 'works',
			on: 'projectImages',
			admin: {
				allowCreate: false,
			},
		},
  ],
};