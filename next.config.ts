import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload';

const supabaseHost = new URL(process.env.S3_ENDPOINT!).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withPayload(nextConfig);
