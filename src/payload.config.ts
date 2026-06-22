import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Media, Works } from '@/collections';
import { About, Contact } from '@/globals';
import { s3Storage } from '@payloadcms/storage-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default buildConfig({
  editor: lexicalEditor(),

  upload: {
    limits: {
      fileSize: 50_000_000, // 50MB, match Supabase bucket
    },
  },

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

	collections: [
		Media,
		Works,
	],

	globals: [
		About,
		Contact,
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
			clientUploads: true,
			collections: {
				media: {
					prefix: 'media',
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