import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
      {
        protocol: 'https',
        hostname: 'sefmheubfkmulfygqhwi.supabase.co',
        pathname: '/storage/v1/object/public/personal-porto/**',
      },
    ],
  },
};

export default nextConfig;
