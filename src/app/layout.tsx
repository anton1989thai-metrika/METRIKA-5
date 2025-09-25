import type { Metadata } from "next";
import "./globals.css";
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "МЕТРИКА - Агентство недвижимости",
  description: "Портал агентства недвижимости МЕТРИКА",
};

export default function RootLayout() {
  // Редиректим на русскую версию по умолчанию
  redirect('/ru')
}
