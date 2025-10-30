"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function MyObjectsPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }
  
  // Авторизация отключена - доступ открыт для всех

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Мои объекты
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
              <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">Фото объекта</span>
              </div>
              
              <h3 className="text-lg font-semibold text-black mb-2">
                2-комнатная квартира
              </h3>
              
              <p className="text-gray-600 mb-2">
                ул. Ленина, д. 15, кв. 42
              </p>
              
              <p className="text-lg font-bold text-black mb-4">
                8 500 000 ₽
              </p>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  Редактировать
                </button>
                <button className="flex-1 px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  Удалить
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
              <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">Фото объекта</span>
              </div>
              
              <h3 className="text-lg font-semibold text-black mb-2">
                Частный дом
              </h3>
              
              <p className="text-gray-600 mb-2">
                д. Подмосковная, ул. Садовая, д. 7
              </p>
              
              <p className="text-lg font-bold text-black mb-4">
                15 200 000 ₽
              </p>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  Редактировать
                </button>
                <button className="flex-1 px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  Удалить
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
              <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">Фото объекта</span>
              </div>
              
              <h3 className="text-lg font-semibold text-black mb-2">
                Офисное помещение
              </h3>
              
              <p className="text-gray-600 mb-2">
                БЦ &quot;Центр&quot;, офис 301
              </p>
              
              <p className="text-lg font-bold text-black mb-4">
                25 000 000 ₽
              </p>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  Редактировать
                </button>
                <button className="flex-1 px-3 py-1 bg-white border border-gray-300 text-black text-sm rounded-lg shadow-sm hover:shadow-md transition-all">
                  Удалить
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button 
              className="px-6 py-3 text-black rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
              style={{backgroundColor: '#fff60b'}}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e6d90a'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fff60b'}
            >
              Добавить новый объект
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
