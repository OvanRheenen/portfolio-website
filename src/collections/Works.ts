import { CollectionConfig } from 'payload';

export const Works: CollectionConfig = {
  slug: 'works',
  fields: [
    {
      name: 'title',
      type: 'text',
			required: true,
    },
		{
			name: 'description',
			type: 'textarea',
		},
		{
			name: 'year',
			type: 'number',
			min: 2003,
			max: 2103,
			required: true,
			admin: {
				description: 'The year the project was completed.',
			},
			defaultValue: new Date().getFullYear(),
		},
		{
			name: 'category',
			type: 'radio',
			options: [
				{ label: '2D', value: '2d' },
				{ label: '3D', value: '3d' },
			],
			required: true,
		},
		{
			name: 'medium',
			type: 'text',
			required: true,
		},
		{
			name: 'active',
			type: 'checkbox',
			defaultValue: false,
			admin: {
				description: 'If checked, this project will be shown on the homepage.',
			},
		},
		{
			name: 'previewImage',
			type: 'upload',
			relationTo: 'media',
			required: true,
		 	label: 'Image with Punchhole',
			admin: {
				description: 'This image will be used as a preview when its corresponding punchhole is hovered over, it should be an image with a punchhole cutout.',
			},
		},
		{
			name: 'punchholeImage',
			type: 'upload',
			relationTo: 'media',
			required: true,
		 	label: 'Punchhole Cutout',
			admin: {
				description: 'This image will be used in the homepage overview as one of the spread around dots.',
			},
		},
		{
			name: 'projectImages',
			type: 'upload',
			relationTo: 'media',
			hasMany: true,
		 	label: 'Project Display Images',
			admin: {
				description: 'Images or videos (.mp4 / .webm) shown in the project detail view after a user clicks a project dot. Videos autoplay muted on loop. Order here is the display order.',
			},
		},
  ],
};