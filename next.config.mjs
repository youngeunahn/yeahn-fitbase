/** @type {import('next').NextConfig} */
const backendOrigin = process.env.BACKEND_ORIGIN || 'http://localhost:8080';

const nextConfig = {
  // output: 'export', // 로컬 개발 시 rewrites를 사용하려면 주석 처리하거나 배포 시에만 활성화해야 할 수 있습니다.
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/login',
        destination: `${backendOrigin}/login`,
      },
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
