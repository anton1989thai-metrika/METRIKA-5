"use client"

import BurgerMenu from "@/components/BurgerMenu";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogPage() {
  const { t } = useLanguage()

  // Получаем статьи из переводов
  const articles = [
    { id: "1" },
    { id: "2" },
    { id: "3" }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-36 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">
            {t('blog.title')}
          </h1>
          
          <div className="space-y-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-black mb-2">
                  {t(`blog.articles.${article.id}.title`)}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  {t('blog.published')} {t(`blog.articles.${article.id}.date`)}
                </p>
                <p className="text-gray-700 mb-4">
                  {t(`blog.articles.${article.id}.excerpt`)}
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  {t('blog.readMore')}
                </button>
              </article>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              {t('blog.loadMore')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
