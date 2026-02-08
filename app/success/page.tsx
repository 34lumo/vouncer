import Link from 'next/link'
import { CheckCircle, ArrowRight, Ticket } from 'lucide-react'
import QRCode from "react-qr-code"; 

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  const userEmail = email || 'tu correo'
  
  const ticketId = `VNC-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Fondo Ambiental */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">
        
        {/* Cabecera de Éxito */}
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4 ring-1 ring-green-500/50">
                <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">¡Pago Confirmado!</h1>
            <p className="text-zinc-400 text-sm">
              Hemos enviado una copia a <span className="text-white">{userEmail}</span>.
            </p>
        </div>

        {/* --- TICKET DIGITAL VISUAL --- */}
        <div className="w-full bg-white text-black rounded-3xl p-6 shadow-2xl shadow-green-900/20 relative overflow-hidden">
            {/* Muescas del ticket (Efecto visual) */}
            <div className="absolute top-2/3 -left-3 w-6 h-6 bg-[#050505] rounded-full" />
            <div className="absolute top-2/3 -right-3 w-6 h-6 bg-[#050505] rounded-full" />
            
            {/* Cabecera del Ticket */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">VOUNCER PASS</p>
                    <h2 className="text-xl font-black mt-1">ACCESO GENERAL</h2>
                </div>
                <Ticket className="w-6 h-6 text-zinc-300" />
            </div>

            {/* EL CÓDIGO QR */}
            <div className="flex flex-col items-center justify-center py-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="bg-white p-2 rounded-lg">
                    <QRCode 
                        value={ticketId} 
                        size={160}
                        viewBox={`0 0 256 256`}
                        fgColor="#000000"
                        bgColor="#ffffff"
                    />
                </div>
                <p className="text-[10px] font-mono text-zinc-400 mt-2 tracking-widest">{ticketId}</p>
            </div>
            
            {/* Footer del Ticket */}
            <div className="mt-8 pt-4 border-t border-dashed border-zinc-300 flex justify-between items-center">
                <div className="text-left">
                    <p className="text-[10px] uppercase text-zinc-400 font-bold">Estado</p>
                    <p className="font-bold text-sm text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        ACTIVO
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase text-zinc-400 font-bold">Válido para</p>
                    <p className="font-bold text-sm">1 Persona</p>
                </div>
            </div>
        </div>

        {/* Botón Volver */}
        <div className="mt-8 w-full">
            <Link 
                href="/"
                className="flex items-center justify-center gap-2 w-full text-zinc-500 hover:text-white py-3 transition-colors text-sm hover:bg-white/5 rounded-xl"
            >
                Volver al inicio <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

      </div>
    </div>
  )
}