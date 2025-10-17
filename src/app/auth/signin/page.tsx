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
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/images/login-bg.jpg"
          alt="МЕТРИКА - Авторизация"
          className="absolute inset-x-0 top-[500px] bottom-[500px] h-auto w-full object-contain"
        />
      </div>
    </div>
  )
}
