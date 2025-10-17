import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-white flex items-center justify-center">
      <div 
        className="flex items-center justify-center gap-[100px] p-[50px]"
        style={{
          border: '3px solid #d1d5db'
        }}
      >
        {/* Форма авторизации - слева от центра */}
        <div className="flex items-center justify-end" style={{ width: 'calc(50% - 100px)' }}>
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
        
        {/* Картинка - справа от центра */}
        <div className="flex items-center justify-start" style={{ width: 'calc(50% - 100px)' }}>
          <img
            src="/images/login-bg.jpg"
            alt="МЕТРИКА - Авторизация"
            className="h-[800px] w-[530px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
