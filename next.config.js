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
    SUBDOMAIN: process.env.SUBDOMAIN,
    TARGET_ID: process.env.TARGET_ID,
    NFT_ADDRESS: process.env.NFT_ADDRESS,
    FUNDS_ADDRESS: process.env.FUNDS_ADDRESS
  }
}

module.exports = nextConfig
