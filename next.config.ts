import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  allowedDevOrigins: ['localhost.ua', 'localhost.com'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
