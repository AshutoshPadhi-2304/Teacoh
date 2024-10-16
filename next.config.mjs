/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.discordapp.net',
        port: '', // Leave blank for default ports
        pathname: '/attachments/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '', // Leave blank for default ports
        pathname: '/photo/**',
      }
    ],
  },
};

export default nextConfig;
