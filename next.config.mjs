/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['example.com'],
    remotePatterns: [
      {
        // protocol: 'https',
        hostname: '*.cos.ap-nanjing.myqcloud.com'
      }
    ],
    unoptimized: true
  },
};

export default nextConfig;
