"use client"

import { useState, useMemo } from "react"
import BurgerMenu from "@/components/BurgerMenu"
import Header from "@/components/Header"
import { BlogList } from "@/components/blog/BlogList"
import { blogPosts, categories } from "@/data/blog"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Все")

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Фильтр по категории
    if (selectedCategory !== "Все") {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    return filtered
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок с шрифтом Geist Sans */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 uppercase">
              БЛОГ О НЕДВИЖИМОСТИ
            </h1>
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Список статей */}
          {filteredPosts.length > 0 ? (
            <BlogList posts={filteredPosts} />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Статьи не найдены
              </h3>
              <p className="text-gray-600 mb-4">
                Попробуйте выбрать другую категорию
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("Все")}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}

          {/* Пагинация */}
          {filteredPosts.length > 0 && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="px-8"
              >
                Загрузить еще
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
