"use client"

import BurgerMenu from "@/components/BurgerMenu";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function KnowledgeBasePage() {
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
            База знаний
          </h1>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск в базе знаний..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Продажи
              </h3>
              <p className="text-gray-600 mb-4">
                Методики и техники продаж недвижимости
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Техника продаж</li>
                <li>• Работа с возражениями</li>
                <li>• Закрытие сделок</li>
                <li>• Презентация объектов</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Юридические вопросы
              </h3>
              <p className="text-gray-600 mb-4">
                Правовые аспекты работы с недвижимостью
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Документооборот</li>
                <li>• Проверка объектов</li>
                <li>• Сопровождение сделок</li>
                <li>• Риски и их минимизация</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Оценка недвижимости
              </h3>
              <p className="text-gray-600 mb-4">
                Методы и принципы оценки объектов
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Сравнительный анализ</li>
                <li>• Доходный подход</li>
                <li>• Затратный подход</li>
                <li>• Факторы влияния на цену</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Маркетинг
              </h3>
              <p className="text-gray-600 mb-4">
                Продвижение объектов и услуг
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Цифровой маркетинг</li>
                <li>• Работа с соцсетями</li>
                <li>• Email-рассылки</li>
                <li>• Контент-маркетинг</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                CRM и процессы
              </h3>
              <p className="text-gray-600 mb-4">
                Работа с клиентской базой и процессами
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ведение клиентской базы</li>
                <li>• Планирование встреч</li>
                <li>• Отчетность</li>
                <li>• Автоматизация процессов</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                Инструменты
              </h3>
              <p className="text-gray-600 mb-4">
                Полезные инструменты и ресурсы
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Калькуляторы</li>
                <li>• Шаблоны документов</li>
                <li>• Чек-листы</li>
                <li>• Полезные ссылки</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-black mb-4">
              Последние обновления
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Обновлен раздел &quot;Техника продаж&quot;</span>
                <span className="text-sm text-gray-500">15.01.2024</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Добавлены новые шаблоны документов</span>
                <span className="text-sm text-gray-500">12.01.2024</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Обновлен калькулятор ипотеки</span>
                <span className="text-sm text-gray-500">10.01.2024</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
