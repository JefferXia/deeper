/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['example.com'],
    remotePatterns: [
      {
        // protocol: 'https',
        hostname: '*.cos.ap-nanjing.myqcloud.com'
      },
      {
        protocol: 'https',
        hostname: 'sv.topmind.video',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // 允许 localhost
      },
    ],
    unoptimized: true
  },
};

export default nextConfig;
