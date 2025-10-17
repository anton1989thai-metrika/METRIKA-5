import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-svh bg-white flex items-center justify-center">
      <div className="flex items-center justify-center w-full gap-[100px]">
        {/* Форма регистрации - слева от центра */}
        <div className="flex items-center justify-end" style={{ width: 'calc(50% - 100px)' }}>
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
        
        {/* Картинка - справа от центра */}
        <div className="flex items-center justify-start" style={{ width: 'calc(50% - 100px)' }}>
          <div className="h-[800px] w-[530px] bg-white overflow-hidden">
            <img
              src="/images/register-bg.jpg"
              alt="МЕТРИКА - Регистрация"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
