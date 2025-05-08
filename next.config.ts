import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // If you were using external images during development from localhost:
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      // },
    ],
  },
};

export default nextConfig;
