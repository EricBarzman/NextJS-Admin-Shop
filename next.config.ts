import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'hqnklvsjipklmkuvzlud.supabase.co',
    }]
  }
};

export default nextConfig;
