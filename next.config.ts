import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vqacmibrsneptaljprez.supabase.co', // 👈 Tu dominio de Supabase
        port: '',
        pathname: '/storage/v1/object/public/**', // Permitir solo la carpeta pública
      },
    ],
  },
};

export default nextConfig;