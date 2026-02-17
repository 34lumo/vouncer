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

interface DemoRequestEmailProps {
    name: string;
    clubName: string;
    email: string;
    phone: string;
}

export const DemoRequestEmail = ({
    name = "Nombre del Solicitante",
    clubName = "Nombre del Venue",
    email = "email@ejemplo.com",
    phone = "+57 300 123 4567",
}: DemoRequestEmailProps) => {
    const baseUrl = "https://www.vouncer.com";

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
                <Preview>Nueva solicitud de demo de {clubName}</Preview>
                <Body className="bg-black text-white font-sans m-auto">
                    <Container className="border border-zinc-800 rounded-2xl my-[40px] mx-auto p-[20px] max-w-[465px] bg-zinc-950">

                        {/* LOGO */}
                        <Section className="mt-[32px] text-center">
                            <Link href={baseUrl}>
                                <Img
                                    src={`${baseUrl}/logo.png`}
                                    width="150"
                                    height="50"
                                    alt="Vouncer"
                                    className="mx-auto object-contain"
                                />
                            </Link>
                        </Section>

                        {/* TÍTULO */}
                        <Heading className="text-white text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                            🎯 Nueva Solicitud de Demo
                        </Heading>

                        <Text className="text-zinc-400 text-[14px] leading-[24px] text-center mb-8">
                            Un nuevo venue está interesado en conocer Vouncer.
                        </Text>

                        {/* DETALLES DE LA SOLICITUD */}
                        <Section className="px-6 py-6 border border-zinc-800 rounded-xl bg-zinc-900/50">

                            {/* Fila 1: Nombre */}
                            <Row className="mb-4">
                                <Column align="left" style={{ width: '35%' }}>
                                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Contacto</Text>
                                </Column>
                                <Column align="right">
                                    <Text className="text-white text-[14px] font-bold m-0">{name}</Text>
                                </Column>
                            </Row>

                            {/* Fila 2: Venue */}
                            <Row className="mb-4">
                                <Column align="left" style={{ width: '35%' }}>
                                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Venue</Text>
                                </Column>
                                <Column align="right">
                                    <Text className="text-white text-[14px] font-bold m-0">{clubName}</Text>
                                </Column>
                            </Row>

                            {/* Fila 3: Email */}
                            <Row className="mb-4">
                                <Column align="left" style={{ width: '35%' }}>
                                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Email</Text>
                                </Column>
                                <Column align="right">
                                    <Link href={`mailto:${email}`} className="text-sky-400 text-[14px] font-bold m-0 no-underline">
                                        {email}
                                    </Link>
                                </Column>
                            </Row>

                            {/* Fila 4: Teléfono */}
                            <Row>
                                <Column align="left" style={{ width: '35%' }}>
                                    <Text className="text-zinc-500 text-[12px] m-0 font-bold uppercase tracking-wider">Teléfono</Text>
                                </Column>
                                <Column align="right">
                                    <Link href={`tel:${phone}`} className="text-sky-400 text-[14px] font-bold m-0 no-underline">
                                        {phone}
                                    </Link>
                                </Column>
                            </Row>

                        </Section>

                        {/* BOTÓN DE ACCIÓN */}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                href={`mailto:${email}?subject=Demo%20Vouncer%20-%20${encodeURIComponent(clubName)}`}
                                className="bg-white rounded-lg px-5 py-3 text-black text-[14px] font-bold no-underline inline-block border-0 hover:bg-zinc-200"
                            >
                                Responder por Email
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

export default DemoRequestEmail;
