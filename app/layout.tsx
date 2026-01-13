import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Afiliados - Agência You On",
  description:
    "Agência de marketing completa, especializada em criação de sites, gestão de redes sociais e tráfego pago. Impulsione seu negócio com estratégias digitais, design responsivo e SEO avançado para gerar resultados reais.",
  keywords: [
    "agência de marketing",
    "marketing digital",
    "criação de sites",
    "sites institucionais",
    "landing pages",
    "ecommerce",
    "loja virtual",
    "gestão de redes sociais",
    "social media",
    "tráfego pago",
    "campanhas online",
    "SEO",
    "design responsivo",
    "marketing completo",
    "geração de leads",
    "performance digital",
    "anúncios pagos",
    "publicidade online",
    "presença online",
    "marketing estratégico",
    "site profissional",
    "marketing para empresas",
    "criar meu site",
  ],
  authors: [{ name: "Agência You On" }],
  icons: {
    icon: "/iconyon.png",
  },
  openGraph: {
    title: "You On Agência – Marketing Digital Completo, Sites e Social Media",
    type: "website",
    url: "https://www.agenciayouon.com",
    description:
      "Agência de marketing completa, especializada em criação de sites, gestão de redes sociais e tráfego pago. Transforme seu negócio com estratégias digitais, design responsivo e SEO avançado.",
    images: ["/logoYo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "You On Agência – Marketing Digital Completo, Sites e Social Media",
    description:
      "Agência de marketing completa, especializada em criação de sites, gestão de redes sociais e tráfego pago. Transforme seu negócio com estratégias digitais, design responsivo e SEO avançado.",
    images: ["/logoYo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Se quiser manter fontes externas via link (não obrigatório se usar next/font) */}
       
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* GTM Script (header) */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N9Z7SV8K');
          `}
        </Script>

        {/* Google Ads / gtag */}
        <Script
          id="gtag-js"
          src="https://www.googletagmanager.com/gtag/js?id=AW-16815965106"
          strategy="afterInteractive"
        />
        <Script id="gtag-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16815965106');
          `}
        </Script>

        {/* GTM noscript (body) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N9Z7SV8K"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
