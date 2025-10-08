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
    <div className="min-h-screen bg-white relative flex flex-col">
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
      
      <main className="pt-32 px-4 relative z-20 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Контент главной страницы будет добавлен позже */}
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-black text-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* О компании */}
            <div>
              <h3 className="text-xl font-bold mb-4">МЕТРИКА</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Агентство недвижимости с многолетним опытом работы на рынке. 
                Мы помогаем нашим клиентам найти идеальное жилье и выгодно продать недвижимость.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Услуги */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Наши услуги</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Продажа недвижимости</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Аренда квартир</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Коммерческая недвижимость</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Зарубежная недвижимость</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Юридическое сопровождение</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Оценка недвижимости</a></li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Москва, ул. Примерная, д. 123</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@metrika.ru</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Пн-Пт: 9:00-19:00, Сб: 10:00-16:00</span>
                </div>
              </div>
            </div>

            {/* Новости */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Подписка на новости</h3>
              <p className="text-gray-300 text-sm mb-4">
                Получайте актуальную информацию о новых объектах и изменениях на рынке недвижимости
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="flex-1 px-3 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-r-md hover:bg-yellow-300 transition-colors">
                  Подписаться
                </button>
              </div>
            </div>
          </div>

          {/* Нижняя часть футера */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © 2024 МЕТРИКА. Все права защищены.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                <a href="#" className="hover:text-white transition-colors">Условия использования</a>
                <a href="#" className="hover:text-white transition-colors">Карта сайта</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
