import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);