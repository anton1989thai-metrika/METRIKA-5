import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-white relative hidden lg:block flex items-center justify-center">
        <img
          src="/images/login-bg.jpg"
          alt="МЕТРИКА - Авторизация"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  )
}
