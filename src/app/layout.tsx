import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://j4sistema.com.br"),
  title: {
    default:
      "J4 Sistema | Desenvolvimento de Software Personalizado em São Paulo",
    template: "%s | J4 Sistema",
  },
  description:
    "Empresa de desenvolvimento de software personalizado. Criamos sistemas web, aplicativos mobile, ERPs e soluções sob medida para empresas. Consultoria em TI e transformação digital.",
  keywords: [
    "desenvolvimento de software",
    "software personalizado",
    "desenvolvimento web",
    "aplicativo mobile",
    "sistema ERP",
    "consultoria TI",
    "desenvolvimento de aplicativos",
    "sistema de gestão",
    "empresa de software",
    "programador freelance",
    "desenvolvimento sob medida",
    "automação de processos",
    "transformação digital",
    "software para empresa",
    "desenvolvimento de sistemas",
    "São Paulo",
    "SP",
    "Brasil",
  ],
  authors: [{ name: "J4 Sistema", url: "https://j4sistema.com.br" }],
  creator: "J4 Sistema",
  publisher: "J4 Sistema",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://j4sistema.com.br",
    siteName: "J4 Sistema",
    title: "J4 Sistema | Desenvolvimento de Software Personalizado",
    description:
      "Desenvolvemos soluções de software personalizadas que transformam a gestão do seu negócio. Sistemas web, apps mobile, ERP e mais.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "J4 Sistema - Desenvolvimento de Software Personalizado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "J4 Sistema | Desenvolvimento de Software Personalizado",
    description:
      "Desenvolvemos soluções de software personalizadas que transformam a gestão do seu negócio.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://j4sistema.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "J4 Sistema",
              url: "https://j4sistema.com.br",
              logo: "https://j4sistema.com.br/logo.png",
              description:
                "Empresa de desenvolvimento de software personalizado. Criamos sistemas web, aplicativos mobile, ERPs e soluções sob medida.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "São Paulo",
                addressRegion: "SP",
                addressCountry: "BR",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+55-41-99744-0255",
                contactType: "customer service",
                email: "contato@j4sistema.com.br",
              },
              sameAs: [
                "https://instagram.com/j4sistema",
                "https://linkedin.com/company/j4sistema",
                "https://github.com/j4sistema",
              ],
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "BRL",
                lowPrice: "5000",
                highPrice: "200000",
                offerCount: "10",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "87",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-900 text-white">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}