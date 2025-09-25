"use client"

import React, { createContext, useContext, useState } from 'react'

interface Translations {
  [key: string]: string | Translations
}

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Простые переводы
const translations: Record<string, Translations> = {
  ru: {
    header: {
      title: "МЕТРИКА",
      subtitle: "Агентство недвижимости"
    },
    home: {
      welcome: "Добро пожаловать в портал агентства недвижимости МЕТРИКА. Здесь вы найдете все необходимое для работы с недвижимостью.",
      realEstateObjects: "Объекты недвижимости",
      realEstateObjectsDesc: "Просматривайте и управляйте объектами недвижимости",
      interactiveMap: "Интерактивная карта",
      interactiveMapDesc: "Изучайте объекты на карте города",
      knowledgeBase: "База знаний",
      knowledgeBaseDesc: "Получайте доступ к экспертной информации",
      useMenu: "Используйте меню слева для навигации по порталу"
    }
  },
  en: {
    header: {
      title: "METRIKA",
      subtitle: "Real Estate Agency"
    },
    home: {
      welcome: "Welcome to the METRIKA real estate agency portal. Here you will find everything you need for working with real estate.",
      realEstateObjects: "Real Estate Objects",
      realEstateObjectsDesc: "View and manage real estate objects",
      interactiveMap: "Interactive Map",
      interactiveMapDesc: "Explore objects on the city map",
      knowledgeBase: "Knowledge Base",
      knowledgeBaseDesc: "Get access to expert information",
      useMenu: "Use the menu on the left to navigate the portal"
    }
  },
  th: {
    header: {
      title: "เมตริกา",
      subtitle: "บริษัทอสังหาริมทรัพย์"
    },
    home: {
      welcome: "ยินดีต้อนรับสู่พอร์ทัลบริษัทอสังหาริมทรัพย์เมตริกา ที่นี่คุณจะพบทุกสิ่งที่จำเป็นสำหรับการทำงานกับอสังหาริมทรัพย์",
      realEstateObjects: "อสังหาริมทรัพย์",
      realEstateObjectsDesc: "ดูและจัดการอสังหาริมทรัพย์",
      interactiveMap: "แผนที่แบบโต้ตอบ",
      interactiveMapDesc: "สำรวจอสังหาริมทรัพย์บนแผนที่เมือง",
      knowledgeBase: "ฐานความรู้",
      knowledgeBaseDesc: "เข้าถึงข้อมูลผู้เชี่ยวชาญ",
      useMenu: "ใช้เมนูทางซ้ายเพื่อนำทางในพอร์ทัล"
    }
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('ru')

  // Получаем перевод по ключу
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: string | Translations = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Возвращаем ключ если перевод не найден
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
