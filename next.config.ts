import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@smogon/calc', '@pkmn/dex'],
};

export default nextConfig;
