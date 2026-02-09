import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface TicketEmailProps {
  userEmail: string;
  userName?: string;
  eventName: string;
  ticketId: string;
  qrCodeUrl: string;
  eventDate: string;
  eventLocation: string;
  price: string;
}

export const TicketEmail = ({
  userEmail = "cliente@ejemplo.com",
  userName = "Vouncer Guest", 
  eventName = "Evento Vouncer",
  ticketId = "VNC-000000",
  qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO",
  eventDate = "Fecha por confirmar",
  eventLocation = "Ubicación secreta",
  price = "$0",
}: TicketEmailProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              zinc: {
                50: "#fafafa",
                100: "#f4f4f5",
                200: "#e4e4e7",
                300: "#d4d4d8",
                400: "#a1a1aa",
                500: "#71717a",
                600: "#52525b",
                700: "#3f3f46",
                800: "#27272a",
                900: "#18181b",
                950: "#09090b",
              },
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>Tu entrada para {eventName}</Preview>
        <Body className="bg-black text-white font-sans m-auto">
          <Container className="border border-zinc-800 rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px] bg-zinc-950">
            
            {/* LOGO */}
            <Section className="mt-[32px] text-center">
              <Link href="https://vouncer-mvp.vercel.app">
                <Img
                  src="https://vouncer-mvp.vercel.app/logo.png"
                  width="150"
                  height="50"
                  alt="Vouncer"
                  className="mx-auto object-contain"
                />
              </Link>
            </Section>

            {/* SALUDO */}
            <Heading className="text-white text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              ¡Hola, {userName.split(' ')[0]}! 🦍
            </Heading>
            
            <Text className="text-zinc-400 text-[14px] leading-[24px] text-center mb-8">
              Aquí tienes tu acceso oficial. Presenta este código en la puerta.
            </Text>

            {/* TARJETA QR BLANCA */}
            <Section className="my-[20px] mx-auto bg-white rounded-2xl p-6 text-center max-w-[300px] border border-zinc-800">
               <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2 m-0">
                  {eventName}
               </Text>
               <Heading className="text-black text-2xl font-black m-0 mb-4">
                  GENERAL
               </Heading>
               
               <Img
                  src={qrCodeUrl}
                  width="200"
                  height="200"
                  alt="QR Acceso"
                  className="mx-auto rounded-lg border-2 border-zinc-100 p-2 block"
               />
               
               <Text className="text-zinc-400 text-[12px] font-mono mt-4 mb-0 tracking-widest">
                  ID: {ticketId}
               </Text>
            </Section>

            {/* --- DETALLES DEL EVENTO (TABLA ROBUSTA) --- */}
            <Section className="px-6 py-6 border-t border-zinc-800 mt-8">
               
               {/* Fila 1: Titular (NUEVO) */}
               <Row className="mb-4">
                 <Column align="left" style={{ width: '30%' }}>
                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Titular</Text>
                 </Column>
                 <Column align="right">
                    <Text className="text-white text-[14px] font-bold m-0">{userName}</Text>
                 </Column>
               </Row>

               {/* Fila 2: Fecha */}
               <Row className="mb-4">
                 <Column align="left" style={{ width: '30%' }}>
                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Fecha</Text>
                 </Column>
                 <Column align="right">
                    <Text className="text-white text-[12px] font-bold m-0">{eventDate}</Text>
                 </Column>
               </Row>

               {/* Fila 3: Lugar */}
               <Row className="mb-4">
                 <Column align="left" style={{ width: '30%' }}>
                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Lugar</Text>
                 </Column>
                 <Column align="right">
                    <Text className="text-white text-[12px] font-bold m-0">{eventLocation}</Text>
                 </Column>
               </Row>

               {/* Fila 4: Precio */}
               <Row>
                 <Column align="left" style={{ width: '30%' }}>
                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Total</Text>
                 </Column>
                 <Column align="right">
                    <Text className="text-green-400 text-[14px] font-bold m-0">{price}</Text>
                 </Column>
               </Row>

            </Section>

            {/* BOTÓN DE ACCIÓN */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href="https://vouncer-mvp.vercel.app" 
                className="bg-zinc-800 rounded-lg px-5 py-3 text-white text-[12px] font-bold no-underline block w-full max-w-[200px] mx-auto border border-zinc-700 hover:bg-zinc-700"
              >
                Ver mis entradas
              </Link>
            </Section>
            
            <Text className="text-zinc-600 text-[10px] text-center mt-4">
              © 2026 Vouncer Inc. Bogotá, Colombia.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default TicketEmail;