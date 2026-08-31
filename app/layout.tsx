import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Vouncer - Tu entrada al club",
  description: "Gestión de entradas y eventos. Compra, vende y valida tickets de forma segura.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  )
}