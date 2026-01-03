import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,  
  },
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    return config;
  },
};

export default nextConfig;