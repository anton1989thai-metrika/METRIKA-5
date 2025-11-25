"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";

const CalendarClient = dynamic(() => import("@/components/calendar-2/Calendar"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-lg text-muted-foreground">Загрузка календаря...</div>
    </div>
  )
});

export default function Calendar2Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <BurgerMenu />
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Календарь</h1>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-lg text-muted-foreground">Загрузка календаря...</div>
            </div>
          }>
            <CalendarClient />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

