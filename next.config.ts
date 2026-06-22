import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload';

const supabaseHost = new URL(process.env.S3_ENDPOINT!).hostname;

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(','),
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
