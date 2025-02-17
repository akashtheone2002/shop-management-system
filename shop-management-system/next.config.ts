import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
