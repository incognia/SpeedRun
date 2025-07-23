/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:5000/auth/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GITHUB_LOGIN_URL: process.env.NEXT_PUBLIC_GITHUB_LOGIN_URL,
    NEXT_PUBLIC_GITLAB_LOGIN_URL: process.env.NEXT_PUBLIC_GITLAB_LOGIN_URL,
  },
};

module.exports = nextConfig;
