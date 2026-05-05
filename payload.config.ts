import sharp from 'sharp';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
		 // Define your collections (e.g., for artworks, pages, etc.)
	],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.SUPABASE_URI,
    },
  }),
  sharp,
});