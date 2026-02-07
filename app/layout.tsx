import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar' // <--- 1. Importado correctamente

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vouncer", // <--- Le he puesto el nombre real
  description: "Gestión de entradas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`} // <--- He forzado fondo negro aquí
      >
        <Navbar /> {/* <--- 2. ¡AQUÍ ES DONDE FALTABA! */}
        
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}