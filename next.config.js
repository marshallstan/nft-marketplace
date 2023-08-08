/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['maskangel.infura-ipfs.io', 'infura-ipfs.io', 'infura.io']
  },
  env: {
    PROJECT_ID: process.env.PROJECT_ID,
    PROJECT_SECRET_KEY: process.env.PROJECT_SECRET_KEY,
    SUBDOMAIN: process.env.SUBDOMAIN
  }
}

module.exports = nextConfig
