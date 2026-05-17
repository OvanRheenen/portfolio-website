import sharp from 'sharp';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Works } from './collections/Works';
import { s3Storage } from '@payloadcms/storage-s3';

export default buildConfig({
  editor: lexicalEditor(),
  
	collections: [
		Works,
	],
  
	secret: process.env.PAYLOAD_SECRET || '',
  
	db: postgresAdapter({
    pool: {
      connectionString: process.env.SUPABASE_URI,
    },
  }),
  
	sharp,
	
	plugins: [
		s3Storage({
			collections: {
				works: {
					prefix: 'works',
				}
			},
			bucket: process.env.S3_BUCKET || '',
			config: {
				forcePathStyle: true,
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
				},
				region: process.env.S3_REGION || '',
				endpoint: process.env.S3_ENDPOINT || '',
			}
		}),
	],
});