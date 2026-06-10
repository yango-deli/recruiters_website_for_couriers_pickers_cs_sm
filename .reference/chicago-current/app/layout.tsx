import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import PreloaderProvider from "@/providers/PreloaderProvider";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chicago Current — Paddling the Chicago River",
  description:
    "A 9-mile kayak journey down the Chicago River. Photography by Ryan Calacsan, words by Erica Zazo. Originally published in Mountain Gazette.",
  openGraph: {
    title: "Chicago Current — Paddling the Chicago River",
    description:
      "A 9-mile kayak journey down the Chicago River. A scroll-driven photo essay.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable}`}
    >
      <body>
        <PreloaderProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
