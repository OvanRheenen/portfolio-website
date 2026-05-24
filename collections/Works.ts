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
			name: 'imageWithPunchhole',
			type: 'upload',
			relationTo: 'media',
			required: true,
		 	label: 'Image with Punchhole',
		},
		{
			name: 'punchholeCutout',
			type: 'upload',
			relationTo: 'media',
			required: true,
		 	label: 'Punchhole Cutout',
		},
  ],
};