import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Providers from "../providers";
import "../globals.css";
import MaintenancePage from "@/src/components/MaintenancePage";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("Seo");

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      languages: {
        en: "https://www.aplicirano.com/en",
        sr: "https://www.aplicirano.com/sr",
        "x-default": "https://www.aplicirano.com",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: params.locale,
      url: `https://www.aplicirano.com/${params.locale}`,
      siteName: "Aplicirano",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale: params.locale });
  const isProdReady = false;

  return (
    <html lang={params.locale} className={inter.className}>
      <body className="antialiased bg-background">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
