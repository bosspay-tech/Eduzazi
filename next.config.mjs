/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.1.9', '10.236.163.242', '10.12.72.242'],
  async redirects() {
    return [
      {
        source: '/courses',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/courses/:id',
        destination: '/services/:id/apply',
        permanent: true,
      },
      {
        source: '/orders',
        destination: '/applications',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
