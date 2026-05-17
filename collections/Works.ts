import { CollectionConfig } from "payload";

export const Works: CollectionConfig = {
  slug: 'works',
	upload: true,
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
  ],
};