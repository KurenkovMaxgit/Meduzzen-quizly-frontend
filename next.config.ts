import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  allowedDevOrigins: ['localhost.ua', 'localhost.com'],
};

export default nextConfig;
