import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vqacmibrsneptaljprez.supabase.co', // 👈 Tu dominio de Supabase
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 👇 AÑADE ESTO AQUÍ:
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 👈 Permitir imágenes de Unsplash
      },
    ],
  },
};

export default nextConfig;