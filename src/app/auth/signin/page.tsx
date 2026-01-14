import Image from "next/image"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-white flex items-center justify-center">
      <div className="flex items-center justify-center w-full gap-[100px]">
        {/* Форма авторизации - слева от центра */}
        <div className="flex items-center justify-end" style={{ width: 'calc(50% - 100px)' }}>
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
        
        {/* Картинка - справа от центра */}
        <div className="flex items-center justify-start" style={{ width: 'calc(50% - 100px)' }}>
          <div className="h-[800px] w-[530px] bg-white overflow-hidden">
            <Image
              src="/images/login-bg.jpg"
              alt="МЕТРИКА - Авторизация"
              width={530}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
