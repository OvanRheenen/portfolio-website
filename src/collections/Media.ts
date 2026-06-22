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
  ],
};