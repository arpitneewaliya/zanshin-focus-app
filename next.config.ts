import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // cache dynamic pages for 30s in the client router
      static: 180, // cache static pages for 3m
    },
  },
};

export default nextConfig;