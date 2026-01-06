import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const myFont = localFont({
  src: [
    { path: "./fonts/TTNorms-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/TTNorms-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/TTNorms-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-myfont",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Indigo® | Alineadores invisibles",
    template: "%s | Indigo®",
  },
  description:
    "Indigo®: alineadores invisibles para ortodoncistas. Ortodoncia Digital precisa y clínica, con soporte experto, tecnología de punta y materiales certificados.",
  applicationName: "Indigo®",
  authors: [{ name: "Indigo®" }],
  creator: "Indigo®",
  publisher: "Indigo®",
  keywords: [
    "alineadores invisibles",
    "ortodoncia digital",
    "ortodoncistas",
    "tratamientos dentales",
    "planificación digital",
    "materiales certificados",
    "soporte clínico",
    "Indigo",
  ],
  category: "Health",
  openGraph: {
    title: "Indigo® | Alineadores invisibles",
    description:
      "De ortodoncistas para ortodoncistas. Servicio integral de diseño y fabricación de alineadores: precisión clínica, tecnología de punta y soporte experto.",
    url: "/",
    siteName: "Indigo®",
    type: "website",
    locale: "es_AR",
    images: [
      { url: "/images/desktop/common/logo.png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indigo® | Alineadores invisibles",
    description:
      "Ortodoncia Digital precisa y clínica. Alineadores invisibles con soporte experto y tecnología de punta.",
    images: [
      { url: "/images/desktop/common/logo.png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${myFont.className} overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
