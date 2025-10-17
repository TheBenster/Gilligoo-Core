/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Node.js runtime for API routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'gilligoo.org']
    }
  }
};

export default nextConfig;
