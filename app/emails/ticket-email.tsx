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
  Button,
} from "@react-email/components";
import * as React from "react";

interface TicketEmailProps {
  userEmail: string;
  userName?: string;
  eventName: string;
  quantity: number;
  // Static QR value — MUST be qr_token ?? ticket.id from DB.
  // Only used when quantity === 1 to render QR inline.
  // For quantity > 1, omit (users follow the CTA link).
  qrToken?: string;
  ticketId?: string;
  // Magic-link URL containing all purchased ticket IDs.
  // Always included so the CTA is always rendered.
  ticketsUrl: string;
  eventDate: string;
  eventLocation: string;
  price: string;
  ticketTypeName?: string;
  drinksIncluded?: number;
}

export const TicketEmail = ({
  userEmail = "cliente@ejemplo.com",
  userName = "Vouncer Guest",
  eventName = "Evento Vouncer",
  quantity = 1,
  qrToken,
  ticketId,
  ticketsUrl = "https://www.vouncer.com/mis-entradas",
  eventDate = "Fecha por confirmar",
  eventLocation = "Ubicación secreta",
  price = "$0",
  ticketTypeName = "General",
  drinksIncluded = 0,
}: TicketEmailProps) => {
  const baseUrl = "https://www.vouncer.com";
  const isSingle = quantity === 1;
  const entradaLabel = isSingle ? "entrada" : "entradas";

  // ⚠️ STATIC QR — use DB value only, never generate at runtime.
  const qrValue = qrToken ?? ticketId ?? "";
  const qrImageUrl = qrValue
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrValue)}`
    : "";

  const displayId = ticketId
    ? `VNC-${ticketId.slice(0, 8).toUpperCase()}`
    : "";

  const previewText = isSingle
    ? `Tu entrada para ${eventName} — preséntala en la puerta`
    : `¡Has comprado ${quantity} entradas para ${eventName}!`;

  const totalDrinks = drinksIncluded * quantity;

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              zinc: {
                50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7",
                300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a",
                600: "#52525b", 700: "#3f3f46", 800: "#27272a",
                900: "#18181b", 950: "#09090b",
              },
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-black text-white font-sans m-auto">
          <Container className="border border-zinc-800 rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px] bg-zinc-950">

            {/* LOGO */}
            <Section className="mt-[32px] text-center">
              <Link href={baseUrl}>
                <Img
                  src={`${baseUrl}/logo.png`}
                  width="150" height="50"
                  alt="Vouncer"
                  className="mx-auto object-contain"
                />
              </Link>
            </Section>

            {/* GREETING */}
            <Heading className="text-white text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              ¡Hola, {userName.split(' ')[0]}! 🦍
            </Heading>

            {/* ─── BRANCH A: qty === 1 → inline QR ─────────────── */}
            {isSingle && qrImageUrl ? (
              <>
                <Text className="text-zinc-400 text-[14px] leading-[24px] text-center mb-4">
                  Tu acceso para <strong className="text-white">{eventName}</strong>.{' '}
                  Preséntalo en la puerta.
                </Text>

                {/* White QR card */}
                <Section className="my-[20px] mx-auto bg-white rounded-2xl p-6 text-center max-w-[300px] border border-zinc-200">
                  <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1 m-0">
                    {eventName}
                  </Text>
                  <Heading className="text-black text-2xl font-black m-0 mb-4">
                    {ticketTypeName.toUpperCase()}
                  </Heading>
                  <Img
                    src={qrImageUrl}
                    width="200" height="200"
                    alt="QR Acceso"
                    className="mx-auto rounded-lg border-2 border-zinc-100 p-2 block"
                  />
                  {displayId && (
                    <Text className="text-zinc-400 text-[12px] font-mono mt-4 mb-0 tracking-widest">
                      {displayId}
                    </Text>
                  )}
                </Section>

                {drinksIncluded > 0 && (
                  <Section className="my-4 mx-auto max-w-[300px] bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
                    <Text className="text-zinc-400 text-[11px] uppercase tracking-widest m-0 mb-1">Incluye</Text>
                    <Text className="text-sky-400 text-[20px] font-black m-0">
                      🍹 {drinksIncluded} {drinksIncluded === 1 ? "consumición" : "consumiciones"}
                    </Text>
                  </Section>
                )}
              </>
            ) : (
              /* ─── BRANCH B: qty > 1 → summary card ──────────── */
              <>
                <Text className="text-zinc-400 text-[14px] leading-[24px] text-center mb-4">
                  {`¡Has comprado `}
                  <strong className="text-white">{quantity} {entradaLabel}</strong>
                  {` para `}
                  <strong className="text-white">{eventName}</strong>!
                </Text>

                {/* Quantity summary card */}
                <Section className="my-[20px] mx-auto bg-white rounded-2xl p-6 text-center max-w-[300px] border border-zinc-200">
                  <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1 m-0">
                    {eventName}
                  </Text>
                  <Heading className="text-black text-2xl font-black m-0 mb-2">
                    {ticketTypeName.toUpperCase()}
                  </Heading>
                  <Text className="text-black text-[64px] font-black leading-none m-0">
                    ×{quantity}
                  </Text>
                  <Text className="text-zinc-500 text-[12px] font-bold uppercase tracking-wider mt-1 m-0">
                    {entradaLabel}
                  </Text>
                </Section>

                {totalDrinks > 0 && (
                  <Section className="my-4 mx-auto max-w-[300px] bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
                    <Text className="text-zinc-400 text-[11px] uppercase tracking-widest m-0 mb-1">Total consumiciones</Text>
                    <Text className="text-sky-400 text-[20px] font-black m-0">
                      🍹 {totalDrinks} ({drinksIncluded} × {quantity})
                    </Text>
                  </Section>
                )}
              </>
            )}

            {/* ─── CTA — ALWAYS rendered (both branches) ───────── */}
            <Section className="text-center mt-[24px] mb-[16px]">
              <Text className="text-zinc-500 text-[12px] mb-4">
                {isSingle
                  ? "Accede también desde el navegador:"
                  : "Toca el botón para ver el QR de cada entrada:"}
              </Text>
              <Button
                href={ticketsUrl}
                className="bg-white rounded-lg px-6 py-3 text-black text-[14px] font-bold no-underline"
              >
                Ver Mis Entradas →
              </Button>
            </Section>

            {/* ─── SHARED EVENT DETAILS ─────────────────────────── */}
            <Section className="px-6 py-6 border-t border-zinc-800 mt-6">
              <Row className="mb-4">
                <Column align="left" style={{ width: '30%' }}>
                  <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Titular</Text>
                </Column>
                <Column align="right">
                  <Text className="text-white text-[14px] font-bold m-0">{userName}</Text>
                </Column>
              </Row>
              <Row className="mb-4">
                <Column align="left" style={{ width: '30%' }}>
                  <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Fecha</Text>
                </Column>
                <Column align="right">
                  <Text className="text-white text-[12px] font-bold m-0">{eventDate}</Text>
                </Column>
              </Row>
              <Row className="mb-4">
                <Column align="left" style={{ width: '30%' }}>
                  <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Lugar</Text>
                </Column>
                <Column align="right">
                  <Text className="text-white text-[12px] font-bold m-0">{eventLocation}</Text>
                </Column>
              </Row>
              <Row>
                <Column align="left" style={{ width: '30%' }}>
                  <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">
                    {isSingle ? "Total" : "Por entrada"}
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-green-400 text-[14px] font-bold m-0">{price}</Text>
                </Column>
              </Row>
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