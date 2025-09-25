"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }
  
  if (!session || session.user?.role !== "admin") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Админ панель
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
              <div className="text-gray-600">Всего объектов</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24</div>
              <div className="text-gray-600">Активных клиентов</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
              <div className="text-gray-600">Сотрудников</div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-gray-600">Сделок в этом месяце</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Управление пользователями
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-black">Иван Петров</div>
                    <div className="text-sm text-gray-600">ivan@example.com</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Редактировать
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      Удалить
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-black">Мария Сидорова</div>
                    <div className="text-sm text-gray-600">maria@example.com</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Редактировать
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Добавить пользователя
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Управление объектами
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-black">2-комнатная квартира</div>
                    <div className="text-sm text-gray-600">ул. Ленина, д. 15</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Редактировать
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      Удалить
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-black">Частный дом</div>
                    <div className="text-sm text-gray-600">д. Подмосковная</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Редактировать
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Добавить объект
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-black mb-4">
              Системные настройки
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-black mb-3">Общие настройки</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Название компании</span>
                    <input
                      type="text"
                      defaultValue="МЕТРИКА"
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Email уведомлений</span>
                    <input
                      type="email"
                      defaultValue="admin@metrika.ru"
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Телефон поддержки</span>
                    <input
                      type="tel"
                      defaultValue="+7 (495) 123-45-67"
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-black mb-3">Настройки безопасности</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Минимальная длина пароля</span>
                    <input
                      type="number"
                      defaultValue="8"
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Автоблокировка (дней)</span>
                    <input
                      type="number"
                      defaultValue="30"
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Двухфакторная аутентификация</span>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Включить
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Сохранить настройки
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
