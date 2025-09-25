"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "tg", name: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "kk", name: "Қазақша", flag: "🇰🇿" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" }
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]) // Русский по умолчанию

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    // Здесь можно добавить логику смены языка
    console.log(`Selected language: ${language.name} (${language.code})`)
  }

  return (
    <div className="relative">
      {/* Кнопка выбора языка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="text-sm font-medium text-black">{selectedLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <>
          {/* Оверлей для закрытия меню */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Меню языков */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Выберите язык</h3>
              
              {/* Два столбца */}
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`flex items-center gap-3 p-3 rounded-md text-left hover:bg-gray-50 transition-colors ${
                      selectedLanguage.code === language.code ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-black">{language.name}</div>
                      <div className="text-xs text-gray-500">{language.code.toUpperCase()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
