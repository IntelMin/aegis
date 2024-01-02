/** @type {import('next').NextConfig} */
const nextConfig = {
  server: 'localhost:9898'
  ,rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
      },
    ];
  },
  images: {
    domains: ['token-media.defined.fi'],
  },
}

module.exports = nextConfig
