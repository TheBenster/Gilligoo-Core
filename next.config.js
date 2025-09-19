/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't resolve mongoose during build
      config.externals = [...config.externals, 'mongoose'];
    }
    return config;
  },
  env: {
    NETLIFY_BUILD_CONTEXT: process.env.NETLIFY_BUILD_CONTEXT,
  },
}

module.exports = nextConfig