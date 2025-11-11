// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  

  basePath: process.env.NODE_ENV === 'production' ? '/acquiredtaste' : '',
};

module.exports = nextConfig;