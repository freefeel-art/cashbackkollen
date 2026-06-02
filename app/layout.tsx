import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cashbackkollen",
  description:
    "Sveriges guide till cashback, erbjudanden och smartare online shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex gap-6">
            <a href="/">Hem</a>
            <a href="/guider">Guider</a>
            <a href="/recensioner">Recensioner</a>
            <a href="/butiker">Butiker</a>
            <a href="/kampanjer">Kampanjer</a>
            <a href="/om-oss">Om oss</a>
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
