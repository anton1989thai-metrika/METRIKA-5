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
    },
    menu: {
      home: "Главная",
      objects: "Объекты",
      map: "Карта",
      about: "О компании",
      contacts: "Контакты",
      blog: "Блог",
      profile: "Личный кабинет",
      myObjects: "Мои объекты",
      academy: "Академия",
      knowledgeBase: "База знаний",
      tasks: "Менеджер задач",
      admin: "Админ панель",
      login: "Войти",
      logout: "Выйти"
    },
    objects: {
      title: "Объекты недвижимости",
      filters: "Фильтры",
      propertyType: "Тип недвижимости",
      apartments: "Квартиры",
      houses: "Дома с участками",
      commercial: "Коммерческая",
      land: "Земельные участки",
      nonCapital: "Некапитальные",
      shares: "Доли",
      price: "Цена",
      priceFrom: "От",
      priceTo: "До",
      area: "Площадь (м²)",
      areaFrom: "От",
      areaTo: "До",
      district: "Район",
      allDistricts: "Все районы",
      central: "Центральный",
      northern: "Северный",
      southern: "Южный",
      eastern: "Восточный",
      western: "Западный",
      applyFilters: "Применить фильтры",
      reset: "Сбросить",
      found: "Найдено",
      objects: "объектов",
      sortBy: "По дате добавления",
      sortByPriceAsc: "По цене (возрастание)",
      sortByPriceDesc: "По цене (убывание)",
      sortByArea: "По площади",
      photo: "Фото",
      previous: "Назад",
      next: "Далее"
    },
    map: {
      title: "Интерактивная карта",
      description: "Изучайте объекты недвижимости на карте города",
      searchPlaceholder: "Поиск по адресу...",
      filters: "Фильтры",
      showAllObjects: "Показать все объекты",
      hideObjects: "Скрыть объекты",
      zoomIn: "Приблизить",
      zoomOut: "Отдалить",
      fullscreen: "Полный экран",
      legend: "Легенда",
      apartments: "Квартиры",
      houses: "Дома",
      commercial: "Коммерческая",
      land: "Земельные участки"
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
    },
    menu: {
      home: "Home",
      objects: "Objects",
      map: "Map",
      about: "About Us",
      contacts: "Contacts",
      blog: "Blog",
      profile: "Profile",
      myObjects: "My Objects",
      academy: "Academy",
      knowledgeBase: "Knowledge Base",
      tasks: "Task Manager",
      admin: "Admin Panel",
      login: "Login",
      logout: "Logout"
    },
    objects: {
      title: "Real Estate Objects",
      filters: "Filters",
      propertyType: "Property Type",
      apartments: "Apartments",
      houses: "Houses with Land",
      commercial: "Commercial",
      land: "Land Plots",
      nonCapital: "Non-Capital",
      shares: "Shares",
      price: "Price",
      priceFrom: "From",
      priceTo: "To",
      area: "Area (m²)",
      areaFrom: "From",
      areaTo: "To",
      district: "District",
      allDistricts: "All Districts",
      central: "Central",
      northern: "Northern",
      southern: "Southern",
      eastern: "Eastern",
      western: "Western",
      applyFilters: "Apply Filters",
      reset: "Reset",
      found: "Found",
      objects: "objects",
      sortBy: "By Date Added",
      sortByPriceAsc: "By Price (Ascending)",
      sortByPriceDesc: "By Price (Descending)",
      sortByArea: "By Area",
      photo: "Photo",
      previous: "Previous",
      next: "Next"
    },
    map: {
      title: "Interactive Map",
      description: "Explore real estate objects on the city map",
      searchPlaceholder: "Search by address...",
      filters: "Filters",
      showAllObjects: "Show All Objects",
      hideObjects: "Hide Objects",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      fullscreen: "Fullscreen",
      legend: "Legend",
      apartments: "Apartments",
      houses: "Houses",
      commercial: "Commercial",
      land: "Land Plots"
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
    },
    menu: {
      home: "หน้าแรก",
      objects: "อสังหาริมทรัพย์",
      map: "แผนที่",
      about: "เกี่ยวกับเรา",
      contacts: "ติดต่อ",
      blog: "บล็อก",
      profile: "โปรไฟล์",
      myObjects: "อสังหาริมทรัพย์ของฉัน",
      academy: "สถาบัน",
      knowledgeBase: "ฐานความรู้",
      tasks: "จัดการงาน",
      admin: "แผงควบคุมผู้ดูแล",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ"
    },
    objects: {
      title: "อสังหาริมทรัพย์",
      filters: "ตัวกรอง",
      propertyType: "ประเภทอสังหาริมทรัพย์",
      apartments: "อพาร์ตเมนต์",
      houses: "บ้านพร้อมที่ดิน",
      commercial: "เชิงพาณิชย์",
      land: "ที่ดิน",
      nonCapital: "ไม่ใช่ทุน",
      shares: "หุ้น",
      price: "ราคา",
      priceFrom: "จาก",
      priceTo: "ถึง",
      area: "พื้นที่ (ตร.ม.)",
      areaFrom: "จาก",
      areaTo: "ถึง",
      district: "เขต",
      allDistricts: "ทุกเขต",
      central: "กลาง",
      northern: "เหนือ",
      southern: "ใต้",
      eastern: "ตะวันออก",
      western: "ตะวันตก",
      applyFilters: "ใช้ตัวกรอง",
      reset: "รีเซ็ต",
      found: "พบ",
      objects: "รายการ",
      sortBy: "ตามวันที่เพิ่ม",
      sortByPriceAsc: "ตามราคา (น้อยไปมาก)",
      sortByPriceDesc: "ตามราคา (มากไปน้อย)",
      sortByArea: "ตามพื้นที่",
      photo: "รูปภาพ",
      previous: "ก่อนหน้า",
      next: "ถัดไป"
    },
    map: {
      title: "แผนที่แบบโต้ตอบ",
      description: "สำรวจอสังหาริมทรัพย์บนแผนที่เมือง",
      searchPlaceholder: "ค้นหาตามที่อยู่...",
      filters: "ตัวกรอง",
      showAllObjects: "แสดงอสังหาริมทรัพย์ทั้งหมด",
      hideObjects: "ซ่อนอสังหาริมทรัพย์",
      zoomIn: "ขยาย",
      zoomOut: "ย่อ",
      fullscreen: "เต็มหน้าจอ",
      legend: "คำอธิบาย",
      apartments: "อพาร์ตเมนต์",
      houses: "บ้าน",
      commercial: "เชิงพาณิชย์",
      land: "ที่ดิน"
    }
  },
  hy: {
    header: {
      title: "ՄԵՏՐԻԿԱ",
      subtitle: "Անշարժ գույքի գործակալություն"
    },
    home: {
      welcome: "Բարի գալուստ ՄԵՏՐԻԿԱ անշարժ գույքի գործակալության պորտալ: Այստեղ դուք կգտնեք անշարժ գույքի հետ աշխատելու համար անհրաժեշտ ամեն ինչ:",
      realEstateObjects: "Անշարժ գույքի օբյեկտներ",
      realEstateObjectsDesc: "Դիտեք և կառավարեք անշարժ գույքի օբյեկտները",
      interactiveMap: "Ինտերակտիվ քարտեզ",
      interactiveMapDesc: "Ուսումնասիրեք օբյեկտները քաղաքի քարտեզի վրա",
      knowledgeBase: "Գիտելիքների բազա",
      knowledgeBaseDesc: "Մուտք ստացեք փորձագիտական տեղեկատվությանը",
      useMenu: "Օգտագործեք ձախ մենյուն պորտալում նավարկելու համար"
    },
    menu: {
      home: "Գլխավոր",
      objects: "Օբյեկտներ",
      map: "Քարտեզ",
      about: "Մեր մասին",
      contacts: "Կապ",
      blog: "Բլոգ",
      profile: "Պրոֆիլ",
      myObjects: "Իմ օբյեկտները",
      academy: "Ակադեմիա",
      knowledgeBase: "Գիտելիքների բազա",
      tasks: "Առաջադրանքների կառավարիչ",
      admin: "Ադմինիստրատորի վահանակ",
      login: "Մուտք",
      logout: "Ելք"
    },
    objects: {
      title: "Անշարժ գույքի օբյեկտներ",
      filters: "Զտիչներ",
      propertyType: "Անշարժ գույքի տեսակ",
      apartments: "Բնակարաններ",
      houses: "Տներ հողամասերով",
      commercial: "Առևտրական",
      land: "Հողամասեր",
      nonCapital: "Ոչ կապիտալ",
      shares: "Մասնաբաժիններ",
      price: "Գին",
      priceFrom: "Սկսած",
      priceTo: "Մինչև",
      area: "Տարածք (մ²)",
      areaFrom: "Սկսած",
      areaTo: "Մինչև",
      district: "Շրջան",
      allDistricts: "Բոլոր շրջանները",
      central: "Կենտրոնական",
      northern: "Հյուսիսային",
      southern: "Հարավային",
      eastern: "Արևելյան",
      western: "Արևմտյան",
      applyFilters: "Կիրառել զտիչներ",
      reset: "Վերակայել",
      found: "Գտնված",
      objects: "օբյեկտներ",
      sortBy: "Ավելացման ամսաթվով",
      sortByPriceAsc: "Գնով (աճող)",
      sortByPriceDesc: "Գնով (նվազող)",
      sortByArea: "Տարածքով",
      photo: "Նկար",
      previous: "Նախորդ",
      next: "Հաջորդ"
    },
    map: {
      title: "Ինտերակտիվ քարտեզ",
      description: "Ուսումնասիրեք անշարժ գույքի օբյեկտները քաղաքի քարտեզի վրա",
      searchPlaceholder: "Որոնում հասցեով...",
      filters: "Զտիչներ",
      showAllObjects: "Ցույց տալ բոլոր օբյեկտները",
      hideObjects: "Թաքցնել օբյեկտները",
      zoomIn: "Մեծացնել",
      zoomOut: "Փոքրացնել",
      fullscreen: "Ամբողջ էկրան",
      legend: "Բացատրություն",
      apartments: "Բնակարաններ",
      houses: "Տներ",
      commercial: "Առևտրական",
      land: "Հողամասեր"
    }
  },
  az: {
    header: {
      title: "METRİKA",
      subtitle: "Əmlak Agentliyi"
    },
    home: {
      welcome: "METRİKA əmlak agentliyinin portalına xoş gəlmisiniz. Burada əmlakla işləmək üçün lazım olan hər şeyi tapacaqsınız.",
      realEstateObjects: "Əmlak obyektləri",
      realEstateObjectsDesc: "Əmlak obyektlərini görün və idarə edin",
      interactiveMap: "İnteraktiv xəritə",
      interactiveMapDesc: "Şəhər xəritəsində obyektləri araşdırın",
      knowledgeBase: "Bilik bazası",
      knowledgeBaseDesc: "Ekspert məlumatlarına çıxış əldə edin",
      useMenu: "Portalda naviqasiya üçün sol menyudan istifadə edin"
    },
    menu: {
      home: "Ana səhifə",
      objects: "Obyektlər",
      map: "Xəritə",
      about: "Haqqımızda",
      contacts: "Əlaqə",
      blog: "Bloq",
      profile: "Profil",
      myObjects: "Mənim obyektlərim",
      academy: "Akademiya",
      knowledgeBase: "Bilik bazası",
      tasks: "Tapşırıqlar meneceri",
      admin: "Admin paneli",
      login: "Daxil ol",
      logout: "Çıxış"
    },
    objects: {
      title: "Əmlak obyektləri",
      filters: "Filtrlər",
      propertyType: "Əmlak növü",
      apartments: "Mənzillər",
      houses: "Torpaq sahəsi olan evlər",
      commercial: "Kommersiya",
      land: "Torpaq sahələri",
      nonCapital: "Qeyri-kapital",
      shares: "Paylar",
      price: "Qiymət",
      priceFrom: "Başlayaraq",
      priceTo: "Qədər",
      area: "Sahə (m²)",
      areaFrom: "Başlayaraq",
      areaTo: "Qədər",
      district: "Rayon",
      allDistricts: "Bütün rayonlar",
      central: "Mərkəzi",
      northern: "Şimali",
      southern: "Cənubi",
      eastern: "Şərqi",
      western: "Qərbi",
      applyFilters: "Filtrləri tətbiq et",
      reset: "Sıfırla",
      found: "Tapıldı",
      objects: "obyekt",
      sortBy: "Əlavə tarixinə görə",
      sortByPriceAsc: "Qiymətə görə (artan)",
      sortByPriceDesc: "Qiymətə görə (azalan)",
      sortByArea: "Sahəyə görə",
      photo: "Şəkil",
      previous: "Əvvəlki",
      next: "Növbəti"
    },
    map: {
      title: "İnteraktiv xəritə",
      description: "Şəhər xəritəsində əmlak obyektlərini araşdırın",
      searchPlaceholder: "Ünvanla axtarış...",
      filters: "Filtrlər",
      showAllObjects: "Bütün obyektləri göstər",
      hideObjects: "Obyektləri gizlə",
      zoomIn: "Böyüt",
      zoomOut: "Kiçilt",
      fullscreen: "Tam ekran",
      legend: "Açıqlama",
      apartments: "Mənzillər",
      houses: "Evlər",
      commercial: "Kommersiya",
      land: "Torpaq sahələri"
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
