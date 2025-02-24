import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
