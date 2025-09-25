"use client"

import BurgerMenu from "@/components/BurgerMenu";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-white">
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Личный кабинет
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Информация о пользователе
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя:
                  </label>
                  <p className="text-black">{session.user?.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email:
                  </label>
                  <p className="text-black">{session.user?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Роль:
                  </label>
                  <p className="text-black capitalize">{session.user?.role}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Статистика
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Просмотренных объектов:</span>
                  <span className="font-semibold text-black">24</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Избранных объектов:</span>
                  <span className="font-semibold text-black">8</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Заявок подано:</span>
                  <span className="font-semibold text-black">3</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Дата регистрации:</span>
                  <span className="font-semibold text-black">15.12.2023</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-black mb-4">
              Быстрые действия
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Подать заявку
              </button>
              
              <button className="p-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Настроить уведомления
              </button>
              
              <button className="p-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Изменить данные
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
