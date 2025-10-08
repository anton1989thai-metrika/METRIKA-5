"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
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
        className="fixed inset-0 w-full h-full bg-gray-300"
        style={{
          backgroundImage: baseUrl ? `url(${baseUrl}/images/hero-bg.jpg)` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      ></div>
      
      {/* Затемняющий слой для лучшей читаемости текста - убираем, чтобы увидеть изображение */}
      {/* <div className="fixed inset-0 bg-black bg-opacity-40 z-10"></div> */}
      
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Контент главной страницы будет добавлен позже */}
        </div>
      </main>
    </div>
  );
}
