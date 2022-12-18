/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['https://res.cloudinary.com/'],
  }
}

module.exports = nextConfig
