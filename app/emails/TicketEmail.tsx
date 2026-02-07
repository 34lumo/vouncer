import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface TicketEmailProps {
  eventName: string
  ticketId: string
  qrToken: string
  quantity: number
}

// 1. IMPORTANTE: Definimos la URL de tu proyecto para que el email encuentre la imagen
const baseUrl = 'https://vouncer-mvp.vercel.app'

export const TicketEmail = ({
  eventName,
  ticketId,
  qrToken,
  quantity,
}: TicketEmailProps) => {
  // Usamos una API externa rápida para generar la imagen del QR en el email
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrToken)}&bgcolor=ffffff`

  return (
    <Html>
      <Head />
      <Preview>Aquí tienes tus entradas para {eventName}</Preview>
      <Tailwind>
        <Body className="bg-black my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#333] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            
            {/* 2. AQUÍ EL CAMBIO: LOGO EN VEZ DE TEXTO */}
            <Section className="mt-[32px] mb-[20px]">
              <Img
                src={`${baseUrl}/logo.png`} // <--- Busca logo.png en tu web real
                width="160" // Ajusta el tamaño si lo ves muy grande o pequeño
                height="50"
                alt="VOUNCER"
                className="mx-auto object-contain"
              />
            </Section>

            {/* Mensaje Principal */}
            <Section className="text-center">
              <Heading className="text-white text-[20px] font-bold text-center p-0 my-[10px] mx-0">
                ¡Estás dentro!
              </Heading>
              <Text className="text-[#aaaaaa] text-[14px] leading-[24px]">
                Gracias por tu compra. Aquí tienes tu acceso para <strong>{eventName}</strong>.
              </Text>
            </Section>

            {/* Tarjeta del Ticket */}
            <Section className="bg-[#111] border border-[#333] rounded-lg p-6 my-6 text-center">
              <Text className="text-violet-400 font-bold text-[18px] uppercase tracking-wider m-0 mb-4">
                {eventName}
              </Text>

              <div className="mx-auto bg-white p-2 rounded-lg inline-block">
                <Img
                  src={qrUrl}
                  width="200"
                  height="200"
                  alt="QR de acceso"
                  className="block"
                />
              </div>

              <Text className="text-[#666] text-[12px] mt-4 mb-0 font-mono">
                ID: {ticketId.split('-')[0]}...
              </Text>
            </Section>

            <Text className="text-[#aaaaaa] text-[14px] leading-[24px] text-center">
              En puerta solo tendrás que mostrar este código QR desde tu móvil.
            </Text>

            <Section className="mt-[30px] border-t border-[#333] pt-[20px]">
              <Text className="text-[#666] text-[12px] text-center">
                © 2026 Vouncer Inc.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default TicketEmail