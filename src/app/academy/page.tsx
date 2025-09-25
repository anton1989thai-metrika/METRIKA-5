"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AcademyPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }
  
  if (!session || (session.user?.role !== "employee" && session.user?.role !== "admin")) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Академия МЕТРИКА
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Основы недвижимости
              </h3>
              <p className="text-gray-600 mb-4">
                Базовый курс для новых сотрудников
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Прогресс: 75%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Продолжить обучение
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Работа с клиентами
              </h3>
              <p className="text-gray-600 mb-4">
                Техники продаж и обслуживания клиентов
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Прогресс: 45%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Продолжить обучение
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Юридические аспекты
              </h3>
              <p className="text-gray-600 mb-4">
                Правовые основы сделок с недвижимостью
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Статус: Не начат
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gray-400 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Начать обучение
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-black mb-4">
              Тесты и сертификация
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold text-black mb-2">
                  Тест по основам недвижимости
                </h3>
                <p className="text-gray-600 mb-3">
                  Оценка: 85/100
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Пройти повторно
                </button>
              </div>
              
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold text-black mb-2">
                  Тест по работе с клиентами
                </h3>
                <p className="text-gray-600 mb-3">
                  Оценка: 92/100
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Пройти повторно
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
