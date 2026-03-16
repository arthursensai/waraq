import type { NextConfig } from "next";

const MAX_SIZE_MB = 50 

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    proxyClientMaxBodySize: `${MAX_SIZE_MB}mb`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.UPLOADTHING_ID}.ufs.sh`,
        port: '',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: `covers.openlibrary.org`,
        port: '',
        pathname: '/a/id/**'
      }
    ],
  },
};

export default nextConfig;
