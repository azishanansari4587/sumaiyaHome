/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    bodySizeLimit: '100mb', // File upload limit
  },
  experimental: {
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yoursite.com',
      },
    ],
  },
};

export default nextConfig;