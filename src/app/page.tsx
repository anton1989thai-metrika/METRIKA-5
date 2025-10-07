"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import Image from "next/image";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white relative">
      {/* Фоновое изображение */}
      <div 
        className="fixed inset-0 w-full h-full bg-gray-300"
        style={{
          backgroundImage: 'url(http://localhost:3000/images/hero-bg.jpg)',
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
