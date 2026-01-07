import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import BuilderEditorBridge from "@/components/BuilderEditorBridge";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "МЕТРИКА - Агентство недвижимости",
  description: "Портал агентства недвижимости МЕТРИКА",
  icons: {
    icon: "/favicon.ico",
  },
};

const fontVariables: CSSProperties = {
  ["--font-geist-sans" as string]:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  ["--font-geist-mono" as string]:
    "'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased text-black" style={fontVariables}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <BuilderEditorBridge />
      </body>
    </html>
  );
}
