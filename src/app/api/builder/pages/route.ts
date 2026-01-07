import { NextResponse } from 'next/server'

// Список всех страниц для Builder.io
const pages = [
  { path: '/', title: 'Главная' },
  { path: '/about', title: 'О компании' },
  { path: '/objects', title: 'Объекты' },
  { path: '/map', title: 'Карта' },
  { path: '/contacts', title: 'Контакты' },
  { path: '/blog', title: 'Блог' },
  { path: '/profile', title: 'Личный кабинет' },
  { path: '/my-objects', title: 'Мои объекты' },
  { path: '/email', title: 'Email' },
  { path: '/academy', title: 'Академия' },
  { path: '/knowledge-base', title: 'База знаний' },
  { path: '/tasks', title: 'Менеджер задач' },
  { path: '/admin', title: 'Админ панель' },
  { path: '/chat', title: 'Чат' },
  { path: '/auth/signin', title: 'Вход' },
  { path: '/register', title: 'Регистрация' },
  { path: '/multi-step-form', title: 'Многошаговая форма' },
  { path: '/calendar-2', title: 'Календарь' },
  { path: '/call-video', title: 'Видеозвонок' },
  { path: '/hr', title: 'HR' },
  { path: '/all-tasks', title: 'Все задачи' },
  { path: '/my-tasks', title: 'Мои задачи' },
  { path: '/purchase-application', title: 'Заявка на покупку' },
]

export async function GET() {
  return NextResponse.json({
    pages,
    total: pages.length
  })
}

