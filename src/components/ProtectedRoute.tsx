"use client"

// Авторизация отключена - компонент просто возвращает children без проверок
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  fallbackUrl?: string
}

export default function ProtectedRoute({ 
  children
}: ProtectedRouteProps) {
  // Авторизация отключена - просто возвращаем содержимое
  return <>{children}</>
}
