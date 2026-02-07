import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full bg-black border-b border-[#333] p-4 flex justify-center sticky top-0 z-50">
      <Link href="/">
        <Image 
          src="/logo.png" 
          alt="VOUNCER Logo" 
          width={150} 
          height={40} 
          className="object-contain" 
          priority 
        />
      </Link>
    </nav>
  )
}