/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'graph.microsoft.com'],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000',
  },
}

module.exports = nextConfig
