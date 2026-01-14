/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // Thêm dòng này giúp đường dẫn ổn định hơn trên Cloudflare
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
