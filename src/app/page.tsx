"use client";

import Image from "next/image";
import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { BlurInText } from "@/components/ui/blur-in-text";

export default function HomePage() {
  const backgroundImageUrl = "/images/hero-bg.jpg";
  
  return (
    <div className="min-h-screen relative">
      <div id="preview-container" className="min-h-screen">
      {/* Фоновое изображение */}
      <div className="fixed inset-0 -z-20 w-full h-full bg-gray-300 pointer-events-none overflow-hidden">
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      
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
    </div>
  );
}
