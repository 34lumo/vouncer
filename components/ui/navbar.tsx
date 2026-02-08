import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    // CAMBIOS CLAVE:
    // 1. bg-black/60 + backdrop-blur-xl: El efecto cristal oscuro.
    // 2. border-b border-white/5: Una línea muy sutil abajo para separar.
    // 3. h-24: He ajustado un poco la altura para que sea una barra elegante, no un bloque gigante.
    <nav className="fixed top-0 inset-x-0 z-50 h-24 flex items-center justify-center px-6 bg-black/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      
      <Link href="/" className="relative group cursor-pointer">
        
        {/* Aura de luz trasera (Glow Azul) */}
        {/* Ajustada para que brille dentro de la barra */}
        <div className="absolute -inset-4 bg-sky-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Logo con Drop Shadow Neón */}
        <Image 
            src="/logo.png" 
            alt="Vouncer" 
            width={140} 
            height={45} 
            priority
            className="object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-500 group-hover:scale-105"
        />
      </Link>
    </nav>
  )
}