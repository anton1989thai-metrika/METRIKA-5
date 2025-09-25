import BurgerMenu from "@/components/BurgerMenu";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <BurgerMenu />
      
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            Блог
          </h1>
          
          <div className="space-y-8">
            <article className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-2">
                Как правильно выбрать квартиру в новостройке
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Опубликовано: 15 января 2024
              </p>
              <p className="text-gray-700 mb-4">
                При выборе квартиры в новостройке важно обратить внимание на множество факторов: 
                от планировки до репутации застройщика. В этой статье мы расскажем о ключевых 
                моментах, которые помогут сделать правильный выбор...
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Читать далее →
              </button>
            </article>
            
            <article className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-2">
                Тренды рынка недвижимости в 2024 году
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Опубликовано: 10 января 2024
              </p>
              <p className="text-gray-700 mb-4">
                Анализ текущих тенденций рынка недвижимости показывает интересные изменения 
                в предпочтениях покупателей и ценовой динамике. Рассмотрим основные тренды 
                нового года...
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Читать далее →
              </button>
            </article>
            
            <article className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-2">
                Ипотека в 2024: что изменилось?
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Опубликовано: 5 января 2024
              </p>
              <p className="text-gray-700 mb-4">
                Новые условия ипотечного кредитования в 2024 году принесли как положительные, 
                так и отрицательные изменения для потенциальных заемщиков. Разбираем все 
                нововведения...
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Читать далее →
              </button>
            </article>
          </div>
          
          <div className="mt-8 text-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Загрузить еще статьи
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
