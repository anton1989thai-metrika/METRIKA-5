import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BuilderEditorBridge from "@/components/BuilderEditorBridge";
import PlasmicRootProviderWrapper from "@/components/PlasmicRootProviderWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "МЕТРИКА - Агентство недвижимости",
  description: "Портал агентства недвижимости МЕТРИКА",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-black`}
      >
        <PlasmicRootProviderWrapper>
          <Providers>
            {children}
            <Toaster />
          </Providers>
          <BuilderEditorBridge />
        </PlasmicRootProviderWrapper>
      </body>
    </html>
  );
}