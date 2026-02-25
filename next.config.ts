import type { NextConfig } from "next";
import { MAX_SIZE_MB } from "./rules/pdf";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    proxyClientMaxBodySize: `${MAX_SIZE_MB}mb`,
  },
};

export default nextConfig;
