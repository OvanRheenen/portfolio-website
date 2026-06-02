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
			name: 'category',
			type: 'select',
			options: [
				{ label: '2D', value: '2d' },
				{ label: '3D', value: '3d' },
			],
			required: true,
		},
		{
			name: 'active',
			type: 'checkbox',
			defaultValue: false,
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
				description: 'These images will be used in the project detail view, when a user clicks on a project dot.',
			},
		},
  ],
};