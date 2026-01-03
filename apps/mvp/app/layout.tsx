import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Providers from "./providers";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'], 
  display: 'swap',
});

export const metadata: Metadata = {
  title: "JobTrakify | Dashboard",
  description: "Track and manage your job applications"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`antialiased bg-background`}
      >
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
