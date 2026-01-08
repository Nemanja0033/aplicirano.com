import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'], 
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Aplicirano | Skup Alata Lakse Trazenje Posla",
  description:
    "Pratite i upravljajte svojim prijavama za posao na jednom mestu. Aplicirano vam pomaže da ostanete organizovani, steknete uvide i poboljšate potragu za poslom uz pametnu analitiku i AI podršku.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="google-site-verification" content="wxR0W49xsfoSQqLV_UXyQKjTTqX4rxQ0yBMmTFSP-G4" />
      </head>
      <body
        className={`antialiased bg-background`}
      >
      <Toaster position="top-center" />  
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
