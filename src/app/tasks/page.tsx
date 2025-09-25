"use client"

import BurgerMenu from "@/components/BurgerMenu";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function TasksPage() {
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
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Менеджер задач
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Мои задачи
              </h2>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-black mb-1">
                    Показать квартиру клиенту
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ул. Ленина, д. 15, кв. 42
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-600 font-medium">
                      Высокий приоритет
                    </span>
                    <span className="text-xs text-gray-500">
                      Сегодня, 15:00
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-black mb-1">
                    Подготовить документы
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Для сделки по дому на Садовой
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-yellow-600 font-medium">
                      Средний приоритет
                    </span>
                    <span className="text-xs text-gray-500">
                      Завтра, 10:00
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-black mb-1">
                    Обновить базу объектов
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Добавить новые фотографии
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-medium">
                      Низкий приоритет
                    </span>
                    <span className="text-xs text-gray-500">
                      До пятницы
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                В процессе
              </h2>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-black mb-1">
                    Встреча с клиентом
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Обсуждение требований к квартире
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-600 font-medium">
                      В процессе
                    </span>
                    <span className="text-xs text-gray-500">
                      Сейчас
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-black mb-1">
                    Оценка объекта
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Квартира на Тверской
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-600 font-medium">
                      В процессе
                    </span>
                    <span className="text-xs text-gray-500">
                      2 часа назад
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Выполнено
              </h2>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border opacity-75">
                  <h3 className="font-medium text-black mb-1">
                    Звонок клиенту
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Уточнение деталей сделки
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-medium">
                      Выполнено
                    </span>
                    <span className="text-xs text-gray-500">
                      Вчера
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border opacity-75">
                  <h3 className="font-medium text-black mb-1">
                    Отправка документов
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Клиенту на email
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600 font-medium">
                      Выполнено
                    </span>
                    <span className="text-xs text-gray-500">
                      2 дня назад
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-black mb-4">
              Создать новую задачу
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название задачи
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название задачи"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Описание задачи"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Приоритет
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Срок выполнения
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Создать задачу
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
