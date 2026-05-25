/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const backendOrigin = process.env.BACKEND_ORIGIN || 'http://localhost:8080';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isDev ? {
    async rewrites() {
      return [
        {
          source: '/login',
          destination: `${backendOrigin}/login`,
        },
        {
          source: '/logout',
          destination: `${backendOrigin}/logout`,
        },
        {
          source: '/api/:path*',
          destination: `${backendOrigin}/api/:path*`,
        },
      ];
    },
  } : {}),
};

export default nextConfig;
