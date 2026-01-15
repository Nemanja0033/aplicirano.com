import { Inter } from "next/font/google";
import { Metadata } from "next";
import  "../globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import Providers from "../providers";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aplicirano | Skup Alata Za Lakse Trazenje Posla",
  description:
    "Pratite i upravljajte svojim prijavama za posao na jednom mestu. Aplicirano vam pomaže da ostanete organizovani, steknete uvide i poboljšate potragu za poslom uz pametnu analitiku i AI podršku.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({
    locale
  });

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta
          name="google-site-verification"
          content="wxR0W49xsfoSQqLV_UXyQKjTTqX4rxQ0yBMmTFSP-G4"
        />
      </head>
      <body className={`antialiased bg-background`}>
        <Toaster position="top-center" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
