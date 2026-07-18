/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
  async redirects() {
    return [
      { source: '/privacy', destination: 'https://app.saltwaves.studio/privacy', permanent: true },
      { source: '/terms', destination: 'https://app.saltwaves.studio/terms', permanent: true },
    ];
  },
};

export default nextConfig;
