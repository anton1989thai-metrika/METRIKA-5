"use client"

'use client';

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { BlurInText } from "@/components/ui/blur-in-text";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    // Получаем текущий URL для динамического определения базового пути
    setBaseUrl(window.location.origin)
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      {/* Фоновое изображение */}
      <div
        className="fixed inset-0 -z-20 w-full h-full bg-gray-300 pointer-events-none"
        style={{
          backgroundImage: baseUrl ? `url(${baseUrl}/images/hero-bg.jpg)` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Затемняющий слой 25% */}
      <div className="fixed inset-0 -z-10 bg-black/25 pointer-events-none" aria-hidden="true"></div>

      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4 relative z-20">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ marginTop: '-160px' }}>
          <BlurInText 
            text="МЕТРИКА"
            className="text-center text-6xl font-bold text-white md:text-[8.5rem] md:leading-[7rem]"
            direction="in"
            wordDelay={0.2}
            delay={2}
          />
          <BlurInText 
            text="индивидуальные решения, созданные"
            className="text-center text-4xl font-bold text-white md:text-7xl md:leading-[5rem] block whitespace-normal"
            direction="in"
            wordDelay={0.2}
            delay={3}
          />
          <BlurInText 
            text="профессионалами"
            className="text-center text-4xl font-bold text-white md:text-7xl md:leading-[5rem] block"
            direction="in"
            wordDelay={0.2}
            delay={3.6}
          />
        </div>
      </main>
    </div>
  );
}
