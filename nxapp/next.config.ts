import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        // allow any HTTPS host so admin-added products work
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
