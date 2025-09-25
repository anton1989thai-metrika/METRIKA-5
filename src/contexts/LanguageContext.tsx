"use client"

import React, { createContext, useContext, useState } from 'react'

interface Translations {
  [key: string]: string | Translations | any
}

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string | any
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
    },
    about: {
      title: "О компании",
      description: "МЕТРИКА - ведущее агентство недвижимости",
      mission: "Наша миссия",
      missionText: "Предоставлять качественные услуги в сфере недвижимости",
      values: "Наши ценности",
      valuesList: [
        "Профессионализм",
        "Честность",
        "Надежность",
        "Индивидуальный подход"
      ],
      team: "Наша команда",
      teamText: "Опытные специалисты с многолетним стажем",
      experience: "Опыт работы",
      experienceText: "Более 10 лет на рынке недвижимости"
    },
    contacts: {
      title: "Контакты",
      description: "Свяжитесь с нами любым удобным способом",
      phone: "Телефон",
      email: "Email",
      address: "Адрес",
      workingHours: "Режим работы",
      workingHoursText: "Пн-Пт: 9:00-18:00, Сб-Вс: 10:00-16:00",
      office: "Офис",
      officeAddress: "г. Москва, ул. Тверская, д. 15",
      support: "Техническая поддержка",
      supportEmail: "support@metrika.ru"
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
    },
    about: {
      title: "About Us",
      description: "METRIKA - leading real estate agency",
      mission: "Our Mission",
      missionText: "To provide quality services in real estate",
      values: "Our Values",
      valuesList: [
        "Professionalism",
        "Honesty",
        "Reliability",
        "Individual Approach"
      ],
      team: "Our Team",
      teamText: "Experienced specialists with many years of experience",
      experience: "Work Experience",
      experienceText: "More than 10 years in real estate market"
    },
    contacts: {
      title: "Contacts",
      description: "Contact us in any convenient way",
      phone: "Phone",
      email: "Email",
      address: "Address",
      workingHours: "Working Hours",
      workingHoursText: "Mon-Fri: 9:00-18:00, Sat-Sun: 10:00-16:00",
      office: "Office",
      officeAddress: "Moscow, Tverskaya St., 15",
      support: "Technical Support",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2-room apartment",
        address: "Tverskaya St., 15, apt. 42",
        material: "Brick"
      },
      "2": {
        title: "Private house",
        address: "Podmoskovnaya village, Sadovaya St., 7",
        material: "6 acres plot"
      },
      "3": {
        title: "Office space",
        address: "BC \"Center\", office 301",
        material: "Concrete"
      },
      "4": {
        title: "1-room apartment",
        address: "Lenin St., 25, apt. 15",
        material: "Panel"
      },
      "5": {
        title: "Land plot",
        address: "SNT \"Sunny\", plot 12",
        material: "Electricity"
      },
      "6": {
        title: "3-room apartment",
        address: "Peace Ave., 8, apt. 67",
        material: "Monolith"
      },
      "7": {
        title: "Studio",
        address: "Arbat St., 12, apt. 3",
        material: "Brick"
      },
      "8": {
        title: "Cottage",
        address: "Rublevo settlement, Lesnaya St., 45",
        material: "10 acres plot"
      },
      "9": {
        title: "Retail space",
        address: "TC \"Mega\", pavilion 15",
        material: "Shopping center"
      },
      "10": {
        title: "4-room apartment",
        address: "Red Square St., 1, apt. 100",
        material: "Monolith"
      },
      "11": {
        title: "Garage",
        address: "Industrial St., 5, box 12",
        material: "Concrete"
      },
      "12": {
        title: "2-room apartment",
        address: "Sadovaya St., 30, apt. 25",
        material: "Panel"
      },
      "13": {
        title: "Warehouse",
        address: "Industrial St., 15, warehouse 3",
        material: "Metal structure"
      },
      "14": {
        title: "1-room apartment",
        address: "Novaya St., 7, apt. 8",
        material: "Brick"
      },
      "15": {
        title: "Townhouse",
        address: "Zarechny settlement, Central St., 12",
        material: "4 acres plot"
      },
      "16": {
        title: "Office",
        address: "BC \"Modern\", office 505",
        material: "Glass/concrete"
      },
      "17": {
        title: "3-room apartment",
        address: "Moskovskaya St., 22, apt. 45",
        material: "Monolith"
      },
      "18": {
        title: "Land plot",
        address: "SNT \"Daisy\", plot 8",
        material: "Gas, electricity"
      },
      "19": {
        title: "Studio",
        address: "Molodezhnaya St., 18, apt. 2",
        material: "Panel"
      },
      "20": {
        title: "Private house",
        address: "Zelenoe village, Dachnaya St., 3",
        material: "8 acres plot"
      },
      "21": {
        title: "2-room apartment",
        address: "Parkovaya St., 14, apt. 33",
        material: "Brick"
      },
      "22": {
        title: "Industrial space",
        address: "Zavodskaya St., 25, workshop 2",
        material: "Metal structure"
      },
      "23": {
        title: "1-room apartment",
        address: "Shkolnaya St., 9, apt. 12",
        material: "Panel"
      },
      "24": {
        title: "Cottage",
        address: "Lesnoy settlement, Sosnovaya St., 7",
        material: "12 acres plot"
      },
      "25": {
        title: "Office space",
        address: "BC \"Business\", office 201",
        material: "Concrete"
      },
      "26": {
        title: "3-room apartment",
        address: "Vesennyaya St., 11, apt. 56",
        material: "Monolith"
      },
      "27": {
        title: "Garage",
        address: "Avtomobilnaya St., 3, box 7",
        material: "Brick"
      },
      "28": {
        title: "Studio",
        address: "Studencheskaya St., 5, apt. 1",
        material: "Brick"
      },
      "29": {
        title: "Land plot",
        address: "SNT \"Harvest\", plot 25",
        material: "All utilities"
      },
      "30": {
        title: "Townhouse",
        address: "Solnechny settlement, Yasnaya St., 9",
        material: "5 acres plot"
      }
    },
    blog: {
      title: "Blog",
      loadMore: "Load more articles",
      readMore: "Read more →",
      published: "Published:",
      articles: {
        "1": {
          title: "How to choose the right apartment in a new building",
          date: "January 15, 2024",
          excerpt: "When choosing an apartment in a new building, it's important to pay attention to many factors: from layout to developer reputation. In this article, we'll tell you about the key points that will help you make the right choice..."
        },
        "2": {
          title: "Real estate market trends in 2024",
          date: "January 10, 2024",
          excerpt: "Analysis of current real estate market trends shows interesting changes in buyer preferences and price dynamics. Let's look at the main trends of the new year..."
        },
        "3": {
          title: "Mortgage in 2024: what has changed?",
          date: "January 5, 2024",
          excerpt: "New mortgage lending conditions in 2024 brought both positive and negative changes for potential borrowers. Let's analyze all the innovations..."
        }
      }
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
    },
    about: {
      title: "เกี่ยวกับเรา",
      description: "เมตริกา - บริษัทอสังหาริมทรัพย์ชั้นนำ",
      mission: "พันธกิจของเรา",
      missionText: "ให้บริการคุณภาพในด้านอสังหาริมทรัพย์",
      values: "ค่านิยมของเรา",
      valuesList: [
        "ความเป็นมืออาชีพ",
        "ความซื่อสัตย์",
        "ความน่าเชื่อถือ",
        "แนวทางเฉพาะบุคคล"
      ],
      team: "ทีมของเรา",
      teamText: "ผู้เชี่ยวชาญที่มีประสบการณ์หลายปี",
      experience: "ประสบการณ์การทำงาน",
      experienceText: "มากกว่า 10 ปีในตลาดอสังหาริมทรัพย์"
    },
    contacts: {
      title: "ติดต่อ",
      description: "ติดต่อเราด้วยวิธีที่สะดวก",
      phone: "โทรศัพท์",
      email: "อีเมล",
      address: "ที่อยู่",
      workingHours: "เวลาทำการ",
      workingHoursText: "จ-ศ: 9:00-18:00, ส-อา: 10:00-16:00",
      office: "สำนักงาน",
      officeAddress: "กรุงมอสโก ถนน Tverskaya 15",
      support: "ฝ่ายสนับสนุนเทคนิค",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "ห้องชุด 2 ห้อง",
        address: "ถนน Tverskaya 15 ห้อง 42",
        material: "อิฐ"
      },
      "2": {
        title: "บ้านส่วนตัว",
        address: "หมู่บ้าน Podmoskovnaya ถนน Sadovaya 7",
        material: "ที่ดิน 6 ไร่"
      },
      "3": {
        title: "พื้นที่สำนักงาน",
        address: "BC \"Center\" สำนักงาน 301",
        material: "คอนกรีต"
      },
      "4": {
        title: "ห้องชุด 1 ห้อง",
        address: "ถนน Lenin 25 ห้อง 15",
        material: "แผง"
      },
      "5": {
        title: "ที่ดิน",
        address: "SNT \"Sunny\" แปลง 12",
        material: "ไฟฟ้า"
      },
      "6": {
        title: "ห้องชุด 3 ห้อง",
        address: "ถนน Peace 8 ห้อง 67",
        material: "โมโนลิธ"
      },
      "7": {
        title: "สตูดิโอ",
        address: "ถนน Arbat 12 ห้อง 3",
        material: "อิฐ"
      },
      "8": {
        title: "คอทเทจ",
        address: "หมู่บ้าน Rublevo ถนน Lesnaya 45",
        material: "ที่ดิน 10 ไร่"
      },
      "9": {
        title: "พื้นที่ค้าปลีก",
        address: "TC \"Mega\" พาวิลเลียน 15",
        material: "ศูนย์การค้า"
      },
      "10": {
        title: "ห้องชุด 4 ห้อง",
        address: "ถนน Red Square 1 ห้อง 100",
        material: "โมโนลิธ"
      },
      "11": {
        title: "โรงจอดรถ",
        address: "ถนน Industrial 5 กล่อง 12",
        material: "คอนกรีต"
      },
      "12": {
        title: "ห้องชุด 2 ห้อง",
        address: "ถนน Sadovaya 30 ห้อง 25",
        material: "แผง"
      },
      "13": {
        title: "คลังสินค้า",
        address: "ถนน Industrial 15 คลัง 3",
        material: "โครงสร้างโลหะ"
      },
      "14": {
        title: "ห้องชุด 1 ห้อง",
        address: "ถนน Novaya 7 ห้อง 8",
        material: "อิฐ"
      },
      "15": {
        title: "ทาวน์เฮาส์",
        address: "หมู่บ้าน Zarechny ถนน Central 12",
        material: "ที่ดิน 4 ไร่"
      },
      "16": {
        title: "สำนักงาน",
        address: "BC \"Modern\" สำนักงาน 505",
        material: "กระจก/คอนกรีต"
      },
      "17": {
        title: "ห้องชุด 3 ห้อง",
        address: "ถนน Moskovskaya 22 ห้อง 45",
        material: "โมโนลิธ"
      },
      "18": {
        title: "ที่ดิน",
        address: "SNT \"Daisy\" แปลง 8",
        material: "แก๊ส ไฟฟ้า"
      },
      "19": {
        title: "สตูดิโอ",
        address: "ถนน Molodezhnaya 18 ห้อง 2",
        material: "แผง"
      },
      "20": {
        title: "บ้านส่วนตัว",
        address: "หมู่บ้าน Zelenoe ถนน Dachnaya 3",
        material: "ที่ดิน 8 ไร่"
      },
      "21": {
        title: "ห้องชุด 2 ห้อง",
        address: "ถนน Parkovaya 14 ห้อง 33",
        material: "อิฐ"
      },
      "22": {
        title: "พื้นที่อุตสาหกรรม",
        address: "ถนน Zavodskaya 25 โรงงาน 2",
        material: "โครงสร้างโลหะ"
      },
      "23": {
        title: "ห้องชุด 1 ห้อง",
        address: "ถนน Shkolnaya 9 ห้อง 12",
        material: "แผง"
      },
      "24": {
        title: "คอทเทจ",
        address: "หมู่บ้าน Lesnoy ถนน Sosnovaya 7",
        material: "ที่ดิน 12 ไร่"
      },
      "25": {
        title: "พื้นที่สำนักงาน",
        address: "BC \"Business\" สำนักงาน 201",
        material: "คอนกรีต"
      },
      "26": {
        title: "ห้องชุด 3 ห้อง",
        address: "ถนน Vesennyaya 11 ห้อง 56",
        material: "โมโนลิธ"
      },
      "27": {
        title: "โรงจอดรถ",
        address: "ถนน Avtomobilnaya 3 กล่อง 7",
        material: "อิฐ"
      },
      "28": {
        title: "สตูดิโอ",
        address: "ถนน Studencheskaya 5 ห้อง 1",
        material: "อิฐ"
      },
      "29": {
        title: "ที่ดิน",
        address: "SNT \"Harvest\" แปลง 25",
        material: "สาธารณูปโภคทั้งหมด"
      },
      "30": {
        title: "ทาวน์เฮาส์",
        address: "หมู่บ้าน Solnechny ถนน Yasnaya 9",
        material: "ที่ดิน 5 ไร่"
      }
    },
    blog: {
      title: "บล็อก",
      loadMore: "โหลดบทความเพิ่มเติม",
      readMore: "อ่านต่อ →",
      published: "เผยแพร่:",
      articles: {
        "1": {
          title: "วิธีเลือกอพาร์ตเมนต์ในอาคารใหม่ให้ถูกต้อง",
          date: "15 มกราคม 2024",
          excerpt: "เมื่อเลือกอพาร์ตเมนต์ในอาคารใหม่ สิ่งสำคัญคือต้องใส่ใจกับหลายปัจจัย: ตั้งแต่การจัดวางไปจนถึงชื่อเสียงของนักพัฒนา ในบทความนี้เราจะบอกคุณเกี่ยวกับประเด็นสำคัญที่จะช่วยให้คุณเลือกได้อย่างถูกต้อง..."
        },
        "2": {
          title: "แนวโน้มตลาดอสังหาริมทรัพย์ในปี 2024",
          date: "10 มกราคม 2024",
          excerpt: "การวิเคราะห์แนวโน้มปัจจุบันของตลาดอสังหาริมทรัพย์แสดงให้เห็นการเปลี่ยนแปลงที่น่าสนใจในความชอบของผู้ซื้อและพลวัตของราคา มาดูแนวโน้มหลักของปีใหม่..."
        },
        "3": {
          title: "สินเชื่อบ้านในปี 2024: อะไรที่เปลี่ยนไป?",
          date: "5 มกราคม 2024",
          excerpt: "เงื่อนไขการให้สินเชื่อบ้านใหม่ในปี 2024 นำมาซึ่งการเปลี่ยนแปลงทั้งในเชิงบวกและเชิงลบสำหรับผู้กู้ที่อาจเกิดขึ้น มาวิเคราะห์นวัตกรรมทั้งหมด..."
        }
      }
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
    },
    about: {
      title: "Մեր մասին",
      description: "ՄԵՏՐԻԿԱ - առաջատար անշարժ գույքի գործակալություն",
      mission: "Մեր առաքելությունը",
      missionText: "Տրամադրել որակյալ ծառայություններ անշարժ գույքի ոլորտում",
      values: "Մեր արժեքները",
      valuesList: [
        "Մասնագիտականություն",
        "Անկեղծություն",
        "Հուսալիություն",
        "Անհատական մոտեցում"
      ],
      team: "Մեր թիմը",
      teamText: "Փորձառու մասնագետներ բազմամյա փորձով",
      experience: "Աշխատանքային փորձ",
      experienceText: "Ավելի քան 10 տարի անշարժ գույքի շուկայում"
    },
    contacts: {
      title: "Կապ",
      description: "Կապվեք մեզ հետ ցանկացած հարմար եղանակով",
      phone: "Հեռախոս",
      email: "Էլ. փոստ",
      address: "Հասցե",
      workingHours: "Աշխատանքային ժամեր",
      workingHoursText: "Երկ-Ուրբ: 9:00-18:00, Շաբ-Կիր: 10:00-16:00",
      office: "Գրասենյակ",
      officeAddress: "Մոսկվա, Տվերսկայա փողոց, 15",
      support: "Տեխնիկական աջակցություն",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2-սենյակ բնակարան",
        address: "Տվերսկայա փողոց, 15, բն. 42",
        material: "Աղյուս"
      },
      "2": {
        title: "Մասնավոր տուն",
        address: "Podmoskovnaya գյուղ, Sadovaya փողոց, 7",
        material: "6 հեկտար հողամաս"
      },
      "3": {
        title: "Գրասենյակային տարածք",
        address: "BC \"Center\", գրասենյակ 301",
        material: "Բետոն"
      },
      "4": {
        title: "1-սենյակ բնակարան",
        address: "Լենինի փողոց, 25, բն. 15",
        material: "Պանել"
      },
      "5": {
        title: "Հողամաս",
        address: "SNT \"Sunny\", հողամաս 12",
        material: "Էլեկտրականություն"
      },
      "6": {
        title: "3-սենյակ բնակարան",
        address: "Խաղաղության պողոտա, 8, բն. 67",
        material: "Մոնոլիտ"
      },
      "7": {
        title: "Ստուդիա",
        address: "Արբատ փողոց, 12, բն. 3",
        material: "Աղյուս"
      },
      "8": {
        title: "Կոթեջ",
        address: "Rublevo բնակավայր, Lesnaya փողոց, 45",
        material: "10 հեկտար հողամաս"
      },
      "9": {
        title: "Առևտրային տարածք",
        address: "TC \"Mega\", տաղավար 15",
        material: "Առևտրական կենտրոն"
      },
      "10": {
        title: "4-սենյակ բնակարան",
        address: "Կարմիր հրապարակ փողոց, 1, բն. 100",
        material: "Մոնոլիտ"
      },
      "11": {
        title: "Ավտոտնակ",
        address: "Արդյունաբերական փողոց, 5, տուփ 12",
        material: "Բետոն"
      },
      "12": {
        title: "2-սենյակ բնակարան",
        address: "Sadovaya փողոց, 30, բն. 25",
        material: "Պանել"
      },
      "13": {
        title: "Պահեստային տարածք",
        address: "Արդյունաբերական փողոց, 15, պահեստ 3",
        material: "Մետաղական կառուցվածք"
      },
      "14": {
        title: "1-սենյակ բնակարան",
        address: "Novaya փողոց, 7, բն. 8",
        material: "Աղյուս"
      },
      "15": {
        title: "Թաունհաուս",
        address: "Zarechny բնակավայր, Կենտրոնական փողոց, 12",
        material: "4 հեկտար հողամաս"
      },
      "16": {
        title: "Գրասենյակ",
        address: "BC \"Modern\", գրասենյակ 505",
        material: "Ապակի/բետոն"
      },
      "17": {
        title: "3-սենյակ բնակարան",
        address: "Moskovskaya փողոց, 22, բն. 45",
        material: "Մոնոլիտ"
      },
      "18": {
        title: "Հողամաս",
        address: "SNT \"Daisy\", հողամաս 8",
        material: "Գազ, էլեկտրականություն"
      },
      "19": {
        title: "Ստուդիա",
        address: "Molodezhnaya փողոց, 18, բն. 2",
        material: "Պանել"
      },
      "20": {
        title: "Մասնավոր տուն",
        address: "Zelenoe գյուղ, Dachnaya փողոց, 3",
        material: "8 հեկտար հողամաս"
      },
      "21": {
        title: "2-սենյակ բնակարան",
        address: "Parkovaya փողոց, 14, բն. 33",
        material: "Աղյուս"
      },
      "22": {
        title: "Արդյունաբերական տարածք",
        address: "Zavodskaya փողոց, 25, արտադրամաս 2",
        material: "Մետաղական կառուցվածք"
      },
      "23": {
        title: "1-սենյակ բնակարան",
        address: "Shkolnaya փողոց, 9, բն. 12",
        material: "Պանել"
      },
      "24": {
        title: "Կոթեջ",
        address: "Lesnoy բնակավայր, Sosnovaya փողոց, 7",
        material: "12 հեկտար հողամաս"
      },
      "25": {
        title: "Գրասենյակային տարածք",
        address: "BC \"Business\", գրասենյակ 201",
        material: "Բետոն"
      },
      "26": {
        title: "3-սենյակ բնակարան",
        address: "Vesennyaya փողոց, 11, բն. 56",
        material: "Մոնոլիտ"
      },
      "27": {
        title: "Ավտոտնակ",
        address: "Avtomobilnaya փողոց, 3, տուփ 7",
        material: "Աղյուս"
      },
      "28": {
        title: "Ստուդիա",
        address: "Studencheskaya փողոց, 5, բն. 1",
        material: "Աղյուս"
      },
      "29": {
        title: "Հողամաս",
        address: "SNT \"Harvest\", հողամաս 25",
        material: "Բոլոր կոմունալ ծառայություններ"
      },
      "30": {
        title: "Թաունհաուս",
        address: "Solnechny բնակավայր, Yasnaya փողոց, 9",
        material: "5 հեկտար հողամաս"
      }
    },
    blog: {
      title: "Բլոգ",
      loadMore: "Բեռնել ավելի շատ հոդվածներ",
      readMore: "Կարդալ ավելին →",
      published: "Հրապարակված:",
      articles: {
        "1": {
          title: "Ինչպես ճիշտ ընտրել բնակարան նոր շենքում",
          date: "15 հունվարի 2024",
          excerpt: "Նոր շենքում բնակարան ընտրելիս կարևոր է ուշադրություն դարձնել բազմաթիվ գործոնների՝ սկսած հատակագծից մինչև շինարարի համբավը: Այս հոդվածում մենք կպատմենք հիմնական կետերի մասին, որոնք կօգնեն ճիշտ ընտրություն կատարել..."
        },
        "2": {
          title: "Անշարժ գույքի շուկայի միտումները 2024 թվականին",
          date: "10 հունվարի 2024",
          excerpt: "Անշարժ գույքի շուկայի ընթացիկ միտումների վերլուծությունը ցույց է տալիս հետաքրքիր փոփոխություններ գնորդների նախասիրություններում և գնային դինամիկայում: Դիտարկենք նոր տարվա հիմնական միտումները..."
        },
        "3": {
          title: "Հիփոթեք 2024-ում: ի՞նչ է փոխվել:",
          date: "5 հունվարի 2024",
          excerpt: "2024 թվականի հիփոթեքային վարկավորման նոր պայմանները բերեցին ինչպես դրական, այնպես էլ բացասական փոփոխություններ պոտենցիալ վարկառուների համար: Վերլուծենք բոլոր նորարարությունները..."
        }
      }
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
    },
    about: {
      title: "Haqqımızda",
      description: "METRİKA - aparıcı əmlak agentliyi",
      mission: "Missiyamız",
      missionText: "Əmlak sahəsində keyfiyyətli xidmətlər təqdim etmək",
      values: "Dəyərlərimiz",
      valuesList: [
        "Peşəkarlıq",
        "Dürüstlük",
        "Etibarlılıq",
        "Fərdi yanaşma"
      ],
      team: "Komandamız",
      teamText: "Çoxillik təcrübəsi olan təcrübəli mütəxəssislər",
      experience: "İş təcrübəsi",
      experienceText: "Əmlak bazarında 10 ildən çox"
    },
    contacts: {
      title: "Əlaqə",
      description: "Bizə istənilən rahat üsulla müraciət edin",
      phone: "Telefon",
      email: "E-poçt",
      address: "Ünvan",
      workingHours: "İş saatları",
      workingHoursText: "B.E: 9:00-18:00, Ş.B: 10:00-16:00",
      office: "Ofis",
      officeAddress: "Moskva, Tverskaya küçəsi, 15",
      support: "Texniki dəstək",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2 otaqlı mənzil",
        address: "Tverskaya küçəsi, 15, mənzil 42",
        material: "Kərpic"
      },
      "2": {
        title: "Şəxsi ev",
        address: "Podmoskovnaya kəndi, Sadovaya küçəsi, 7",
        material: "6 hektar torpaq sahəsi"
      },
      "3": {
        title: "Ofis sahəsi",
        address: "BC \"Center\", ofis 301",
        material: "Beton"
      },
      "4": {
        title: "1 otaqlı mənzil",
        address: "Lenin küçəsi, 25, mənzil 15",
        material: "Panel"
      },
      "5": {
        title: "Torpaq sahəsi",
        address: "SNT \"Sunny\", sahə 12",
        material: "Elektrik"
      },
      "6": {
        title: "3 otaqlı mənzil",
        address: "Sülh prospekti, 8, mənzil 67",
        material: "Monolit"
      },
      "7": {
        title: "Studiya",
        address: "Arbat küçəsi, 12, mənzil 3",
        material: "Kərpic"
      },
      "8": {
        title: "Kottec",
        address: "Rublevo yaşayış məntəqəsi, Lesnaya küçəsi, 45",
        material: "10 hektar torpaq sahəsi"
      },
      "9": {
        title: "Ticarət sahəsi",
        address: "TC \"Mega\", pavilyon 15",
        material: "Ticarət mərkəzi"
      },
      "10": {
        title: "4 otaqlı mənzil",
        address: "Qırmızı meydan küçəsi, 1, mənzil 100",
        material: "Monolit"
      },
      "11": {
        title: "Qaraj",
        address: "Sənaye küçəsi, 5, qutu 12",
        material: "Beton"
      },
      "12": {
        title: "2 otaqlı mənzil",
        address: "Sadovaya küçəsi, 30, mənzil 25",
        material: "Panel"
      },
      "13": {
        title: "Anbar sahəsi",
        address: "Sənaye küçəsi, 15, anbar 3",
        material: "Metal konstruksiya"
      },
      "14": {
        title: "1 otaqlı mənzil",
        address: "Novaya küçəsi, 7, mənzil 8",
        material: "Kərpic"
      },
      "15": {
        title: "Taunhaus",
        address: "Zarechny yaşayış məntəqəsi, Mərkəzi küçə, 12",
        material: "4 hektar torpaq sahəsi"
      },
      "16": {
        title: "Ofis",
        address: "BC \"Modern\", ofis 505",
        material: "Şüşə/beton"
      },
      "17": {
        title: "3 otaqlı mənzil",
        address: "Moskovskaya küçəsi, 22, mənzil 45",
        material: "Monolit"
      },
      "18": {
        title: "Torpaq sahəsi",
        address: "SNT \"Daisy\", sahə 8",
        material: "Qaz, elektrik"
      },
      "19": {
        title: "Studiya",
        address: "Molodezhnaya küçəsi, 18, mənzil 2",
        material: "Panel"
      },
      "20": {
        title: "Şəxsi ev",
        address: "Zelenoe kəndi, Dachnaya küçəsi, 3",
        material: "8 hektar torpaq sahəsi"
      },
      "21": {
        title: "2 otaqlı mənzil",
        address: "Parkovaya küçəsi, 14, mənzil 33",
        material: "Kərpic"
      },
      "22": {
        title: "Sənaye sahəsi",
        address: "Zavodskaya küçəsi, 25, emalatxana 2",
        material: "Metal konstruksiya"
      },
      "23": {
        title: "1 otaqlı mənzil",
        address: "Shkolnaya küçəsi, 9, mənzil 12",
        material: "Panel"
      },
      "24": {
        title: "Kottec",
        address: "Lesnoy yaşayış məntəqəsi, Sosnovaya küçəsi, 7",
        material: "12 hektar torpaq sahəsi"
      },
      "25": {
        title: "Ofis sahəsi",
        address: "BC \"Business\", ofis 201",
        material: "Beton"
      },
      "26": {
        title: "3 otaqlı mənzil",
        address: "Vesennyaya küçəsi, 11, mənzil 56",
        material: "Monolit"
      },
      "27": {
        title: "Qaraj",
        address: "Avtomobilnaya küçəsi, 3, qutu 7",
        material: "Kərpic"
      },
      "28": {
        title: "Studiya",
        address: "Studencheskaya küçəsi, 5, mənzil 1",
        material: "Kərpic"
      },
      "29": {
        title: "Torpaq sahəsi",
        address: "SNT \"Harvest\", sahə 25",
        material: "Bütün kommunal xidmətlər"
      },
      "30": {
        title: "Taunhaus",
        address: "Solnechny yaşayış məntəqəsi, Yasnaya küçəsi, 9",
        material: "5 hektar torpaq sahəsi"
      }
    },
    blog: {
      title: "Bloq",
      loadMore: "Daha çox məqalə yüklə",
      readMore: "Daha çox oxu →",
      published: "Dərc edilib:",
      articles: {
        "1": {
          title: "Yeni binada mənzil seçməyin düzgün yolu",
          date: "15 yanvar 2024",
          excerpt: "Yeni binada mənzil seçərkən çoxlu amillərə diqqət yetirmək vacibdir: planlaşdırmadan tutmuş inkişafçının nüfuzuna qədər. Bu məqalədə biz sizə düzgün seçim etməyə kömək edəcək əsas məqamlar haqqında danışacağıq..."
        },
        "2": {
          title: "2024-cü ildə əmlak bazarının tendensiyaları",
          date: "10 yanvar 2024",
          excerpt: "Əmlak bazarının mövcud tendensiyalarının təhlili alıcıların üstünlüklərində və qiymət dinamikasında maraqlı dəyişikliklər göstərir. Yeni ilin əsas tendensiyalarına baxaq..."
        },
        "3": {
          title: "2024-cü ildə ipoteka: nə dəyişdi?",
          date: "5 yanvar 2024",
          excerpt: "2024-cü ildə ipoteka kreditləşdirməsinin yeni şərtləri potensial borcalanlar üçün həm müsbət, həm də mənfi dəyişikliklər gətirdi. Bütün yenilikləri təhlil edək..."
        }
      }
    }
  },
  zh: {
    header: {
      title: "METRIKA",
      subtitle: "房地产代理"
    },
    home: {
      welcome: "欢迎来到METRIKA房地产代理门户。在这里您将找到房地产工作所需的一切。",
      realEstateObjects: "房地产对象",
      realEstateObjectsDesc: "查看和管理房地产对象",
      interactiveMap: "交互式地图",
      interactiveMapDesc: "在城市地图上探索对象",
      knowledgeBase: "知识库",
      knowledgeBaseDesc: "获取专家信息访问权限",
      useMenu: "使用左侧菜单导航门户"
    },
    menu: {
      home: "首页",
      objects: "对象",
      map: "地图",
      about: "关于我们",
      contacts: "联系方式",
      blog: "博客",
      profile: "个人资料",
      myObjects: "我的对象",
      academy: "学院",
      knowledgeBase: "知识库",
      tasks: "任务管理器",
      admin: "管理面板",
      login: "登录",
      logout: "退出"
    },
    objects: {
      title: "房地产对象",
      filters: "过滤器",
      propertyType: "房产类型",
      apartments: "公寓",
      houses: "带土地的房屋",
      commercial: "商业",
      land: "土地",
      nonCapital: "非资本",
      shares: "股份",
      price: "价格",
      priceFrom: "从",
      priceTo: "到",
      area: "面积 (m²)",
      areaFrom: "从",
      areaTo: "到",
      district: "区域",
      allDistricts: "所有区域",
      central: "中心",
      northern: "北部",
      southern: "南部",
      eastern: "东部",
      western: "西部",
      applyFilters: "应用过滤器",
      reset: "重置",
      found: "找到",
      objects: "对象",
      sortBy: "按添加日期",
      sortByPriceAsc: "按价格（升序）",
      sortByPriceDesc: "按价格（降序）",
      sortByArea: "按面积",
      photo: "照片",
      previous: "上一页",
      next: "下一页"
    },
    map: {
      title: "交互式地图",
      description: "在城市地图上探索房地产对象",
      searchPlaceholder: "按地址搜索...",
      filters: "过滤器",
      showAllObjects: "显示所有对象",
      hideObjects: "隐藏对象",
      zoomIn: "放大",
      zoomOut: "缩小",
      fullscreen: "全屏",
      legend: "图例",
      apartments: "公寓",
      houses: "房屋",
      commercial: "商业",
      land: "土地"
    },
    about: {
      title: "关于我们",
      description: "METRIKA - 领先的房地产代理",
      mission: "我们的使命",
      missionText: "在房地产领域提供优质服务",
      values: "我们的价值观",
      valuesList: [
        "专业性",
        "诚实",
        "可靠性",
        "个性化方法"
      ],
      team: "我们的团队",
      teamText: "经验丰富的专家，多年经验",
      experience: "工作经验",
      experienceText: "在房地产市场超过10年"
    },
    contacts: {
      title: "联系方式",
      description: "以任何方便的方式联系我们",
      phone: "电话",
      email: "电子邮件",
      address: "地址",
      workingHours: "工作时间",
      workingHoursText: "周一至周五: 9:00-18:00, 周六至周日: 10:00-16:00",
      office: "办公室",
      officeAddress: "莫斯科，特维尔大街，15号",
      support: "技术支持",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2室公寓",
        address: "特维尔大街15号，42室",
        material: "砖"
      },
      "2": {
        title: "私人住宅",
        address: "Podmoskovnaya村，Sadovaya街7号",
        material: "6英亩地块"
      },
      "3": {
        title: "办公空间",
        address: "BC \"Center\"，301办公室",
        material: "混凝土"
      },
      "4": {
        title: "1室公寓",
        address: "列宁街25号，15室",
        material: "面板"
      },
      "5": {
        title: "土地",
        address: "SNT \"Sunny\"，12号地块",
        material: "电力"
      },
      "6": {
        title: "3室公寓",
        address: "和平大道8号，67室",
        material: "单体"
      },
      "7": {
        title: "工作室",
        address: "Arbat街12号，3室",
        material: "砖"
      },
      "8": {
        title: "别墅",
        address: "Rublevo定居点，Lesnaya街45号",
        material: "10英亩地块"
      },
      "9": {
        title: "零售空间",
        address: "TC \"Mega\"，15号展馆",
        material: "购物中心"
      },
      "10": {
        title: "4室公寓",
        address: "红场街1号，100室",
        material: "单体"
      },
      "11": {
        title: "车库",
        address: "工业街5号，12号车位",
        material: "混凝土"
      },
      "12": {
        title: "2室公寓",
        address: "Sadovaya街30号，25室",
        material: "面板"
      },
      "13": {
        title: "仓库空间",
        address: "工业街15号，3号仓库",
        material: "金属结构"
      },
      "14": {
        title: "1室公寓",
        address: "Novaya街7号，8室",
        material: "砖"
      },
      "15": {
        title: "联排别墅",
        address: "Zarechny定居点，中央街12号",
        material: "4英亩地块"
      },
      "16": {
        title: "办公室",
        address: "BC \"Modern\"，505办公室",
        material: "玻璃/混凝土"
      },
      "17": {
        title: "3室公寓",
        address: "Moskovskaya街22号，45室",
        material: "单体"
      },
      "18": {
        title: "土地",
        address: "SNT \"Daisy\"，8号地块",
        material: "天然气，电力"
      },
      "19": {
        title: "工作室",
        address: "Molodezhnaya街18号，2室",
        material: "面板"
      },
      "20": {
        title: "私人住宅",
        address: "Zelenoe村，Dachnaya街3号",
        material: "8英亩地块"
      },
      "21": {
        title: "2室公寓",
        address: "Parkovaya街14号，33室",
        material: "砖"
      },
      "22": {
        title: "工业空间",
        address: "Zavodskaya街25号，2号车间",
        material: "金属结构"
      },
      "23": {
        title: "1室公寓",
        address: "Shkolnaya街9号，12室",
        material: "面板"
      },
      "24": {
        title: "别墅",
        address: "Lesnoy定居点，Sosnovaya街7号",
        material: "12英亩地块"
      },
      "25": {
        title: "办公空间",
        address: "BC \"Business\"，201办公室",
        material: "混凝土"
      },
      "26": {
        title: "3室公寓",
        address: "Vesennyaya街11号，56室",
        material: "单体"
      },
      "27": {
        title: "车库",
        address: "Avtomobilnaya街3号，7号车位",
        material: "砖"
      },
      "28": {
        title: "工作室",
        address: "Studencheskaya街5号，1室",
        material: "砖"
      },
      "29": {
        title: "土地",
        address: "SNT \"Harvest\"，25号地块",
        material: "所有公用设施"
      },
      "30": {
        title: "联排别墅",
        address: "Solnechny定居点，Yasnaya街9号",
        material: "5英亩地块"
      }
    },
    blog: {
      title: "博客",
      loadMore: "加载更多文章",
      readMore: "阅读更多 →",
      published: "发布时间：",
      articles: {
        "1": {
          title: "如何正确选择新房公寓",
          date: "2024年1月15日",
          excerpt: "选择新房公寓时，重要的是要注意许多因素：从布局到开发商的声誉。在这篇文章中，我们将告诉您关键要点，这些要点将帮助您做出正确的选择..."
        },
        "2": {
          title: "2024年房地产市场趋势",
          date: "2024年1月10日",
          excerpt: "对当前房地产市场趋势的分析显示了买家偏好和价格动态的有趣变化。让我们看看新年的主要趋势..."
        },
        "3": {
          title: "2024年抵押贷款：发生了什么变化？",
          date: "2024年1月5日",
          excerpt: "2024年抵押贷款的新条件为潜在借款人带来了积极和消极的变化。让我们分析所有创新..."
        }
      }
    }
  },
  ko: {
    header: {
      title: "METRIKA",
      subtitle: "부동산 대행사"
    },
    home: {
      welcome: "METRIKA 부동산 대행사 포털에 오신 것을 환영합니다. 여기에서 부동산 작업에 필요한 모든 것을 찾을 수 있습니다.",
      realEstateObjects: "부동산 객체",
      realEstateObjectsDesc: "부동산 객체 보기 및 관리",
      interactiveMap: "대화형 지도",
      interactiveMapDesc: "도시 지도에서 객체 탐색",
      knowledgeBase: "지식 베이스",
      knowledgeBaseDesc: "전문가 정보에 대한 액세스",
      useMenu: "왼쪽 메뉴를 사용하여 포털 탐색"
    },
    menu: {
      home: "홈",
      objects: "객체",
      map: "지도",
      about: "회사 소개",
      contacts: "연락처",
      blog: "블로그",
      profile: "프로필",
      myObjects: "내 객체",
      academy: "아카데미",
      knowledgeBase: "지식 베이스",
      tasks: "작업 관리자",
      admin: "관리자 패널",
      login: "로그인",
      logout: "로그아웃"
    },
    objects: {
      title: "부동산 객체",
      filters: "필터",
      propertyType: "부동산 유형",
      apartments: "아파트",
      houses: "토지가 있는 주택",
      commercial: "상업용",
      land: "토지",
      nonCapital: "비자본",
      shares: "주식",
      price: "가격",
      priceFrom: "부터",
      priceTo: "까지",
      area: "면적 (m²)",
      areaFrom: "부터",
      areaTo: "까지",
      district: "지역",
      allDistricts: "모든 지역",
      central: "중앙",
      northern: "북부",
      southern: "남부",
      eastern: "동부",
      western: "서부",
      applyFilters: "필터 적용",
      reset: "재설정",
      found: "발견됨",
      objects: "객체",
      sortBy: "추가 날짜별",
      sortByPriceAsc: "가격별 (오름차순)",
      sortByPriceDesc: "가격별 (내림차순)",
      sortByArea: "면적별",
      photo: "사진",
      previous: "이전",
      next: "다음"
    },
    map: {
      title: "대화형 지도",
      description: "도시 지도에서 부동산 객체 탐색",
      searchPlaceholder: "주소로 검색...",
      filters: "필터",
      showAllObjects: "모든 객체 표시",
      hideObjects: "객체 숨기기",
      zoomIn: "확대",
      zoomOut: "축소",
      fullscreen: "전체 화면",
      legend: "범례",
      apartments: "아파트",
      houses: "주택",
      commercial: "상업용",
      land: "토지"
    },
    about: {
      title: "회사 소개",
      description: "METRIKA - 선도적인 부동산 대행사",
      mission: "우리의 미션",
      missionText: "부동산 분야에서 품질 서비스 제공",
      values: "우리의 가치",
      valuesList: [
        "전문성",
        "정직성",
        "신뢰성",
        "개별 접근법"
      ],
      team: "우리 팀",
      teamText: "다년간 경험을 가진 숙련된 전문가",
      experience: "작업 경험",
      experienceText: "부동산 시장에서 10년 이상"
    },
    contacts: {
      title: "연락처",
      description: "편리한 방법으로 저희에게 연락하세요",
      phone: "전화",
      email: "이메일",
      address: "주소",
      workingHours: "근무 시간",
      workingHoursText: "월-금: 9:00-18:00, 토-일: 10:00-16:00",
      office: "사무실",
      officeAddress: "모스크바, 트베르스카야 거리, 15번",
      support: "기술 지원",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2룸 아파트",
        address: "트베르스카야 거리 15, 42호",
        material: "벽돌"
      },
      "2": {
        title: "개인 주택",
        address: "Podmoskovnaya 마을, Sadovaya 거리 7",
        material: "6에이커 부지"
      },
      "3": {
        title: "사무 공간",
        address: "BC \"Center\", 301호 사무실",
        material: "콘크리트"
      },
      "4": {
        title: "1룸 아파트",
        address: "레닌 거리 25, 15호",
        material: "패널"
      },
      "5": {
        title: "토지",
        address: "SNT \"Sunny\", 12번 부지",
        material: "전기"
      },
      "6": {
        title: "3룸 아파트",
        address: "평화대로 8, 67호",
        material: "모놀리트"
      },
      "7": {
        title: "스튜디오",
        address: "알바트 거리 12, 3호",
        material: "벽돌"
      },
      "8": {
        title: "코티지",
        address: "Rublevo 정착지, Lesnaya 거리 45",
        material: "10에이커 부지"
      },
      "9": {
        title: "소매 공간",
        address: "TC \"Mega\", 15번 파빌리온",
        material: "쇼핑센터"
      },
      "10": {
        title: "4룸 아파트",
        address: "붉은 광장 거리 1, 100호",
        material: "모놀리트"
      },
      "11": {
        title: "주차장",
        address: "산업 거리 5, 12번 박스",
        material: "콘크리트"
      },
      "12": {
        title: "2룸 아파트",
        address: "Sadovaya 거리 30, 25호",
        material: "패널"
      },
      "13": {
        title: "창고 공간",
        address: "산업 거리 15, 3번 창고",
        material: "금속 구조"
      },
      "14": {
        title: "1룸 아파트",
        address: "Novaya 거리 7, 8호",
        material: "벽돌"
      },
      "15": {
        title: "타운하우스",
        address: "Zarechny 정착지, 중앙 거리 12",
        material: "4에이커 부지"
      },
      "16": {
        title: "사무실",
        address: "BC \"Modern\", 505호 사무실",
        material: "유리/콘크리트"
      },
      "17": {
        title: "3룸 아파트",
        address: "Moskovskaya 거리 22, 45호",
        material: "모놀리트"
      },
      "18": {
        title: "토지",
        address: "SNT \"Daisy\", 8번 부지",
        material: "가스, 전기"
      },
      "19": {
        title: "스튜디오",
        address: "Molodezhnaya 거리 18, 2호",
        material: "패널"
      },
      "20": {
        title: "개인 주택",
        address: "Zelenoe 마을, Dachnaya 거리 3",
        material: "8에이커 부지"
      },
      "21": {
        title: "2룸 아파트",
        address: "Parkovaya 거리 14, 33호",
        material: "벽돌"
      },
      "22": {
        title: "산업 공간",
        address: "Zavodskaya 거리 25, 2번 작업장",
        material: "금속 구조"
      },
      "23": {
        title: "1룸 아파트",
        address: "Shkolnaya 거리 9, 12호",
        material: "패널"
      },
      "24": {
        title: "코티지",
        address: "Lesnoy 정착지, Sosnovaya 거리 7",
        material: "12에이커 부지"
      },
      "25": {
        title: "사무 공간",
        address: "BC \"Business\", 201호 사무실",
        material: "콘크리트"
      },
      "26": {
        title: "3룸 아파트",
        address: "Vesennyaya 거리 11, 56호",
        material: "모놀리트"
      },
      "27": {
        title: "주차장",
        address: "Avtomobilnaya 거리 3, 7번 박스",
        material: "벽돌"
      },
      "28": {
        title: "스튜디오",
        address: "Studencheskaya 거리 5, 1호",
        material: "벽돌"
      },
      "29": {
        title: "토지",
        address: "SNT \"Harvest\", 25번 부지",
        material: "모든 공공 시설"
      },
      "30": {
        title: "타운하우스",
        address: "Solnechny 정착지, Yasnaya 거리 9",
        material: "5에이커 부지"
      }
    },
    blog: {
      title: "블로그",
      loadMore: "더 많은 기사 로드",
      readMore: "더 읽기 →",
      published: "게시됨:",
      articles: {
        "1": {
          title: "신축 건물에서 아파트를 올바르게 선택하는 방법",
          date: "2024년 1월 15일",
          excerpt: "신축 건물에서 아파트를 선택할 때는 레이아웃부터 개발업체의 평판까지 많은 요소에 주의를 기울이는 것이 중요합니다. 이 기사에서는 올바른 선택을 하는 데 도움이 될 핵심 포인트에 대해 알려드리겠습니다..."
        },
        "2": {
          title: "2024년 부동산 시장 트렌드",
          date: "2024년 1월 10일",
          excerpt: "현재 부동산 시장 트렌드 분석은 구매자 선호도와 가격 역학에서 흥미로운 변화를 보여줍니다. 새해의 주요 트렌드를 살펴보겠습니다..."
        },
        "3": {
          title: "2024년 모기지: 무엇이 바뀌었나?",
          date: "2024년 1월 5일",
          excerpt: "2024년 모기지 대출의 새로운 조건은 잠재적 차용인에게 긍정적이고 부정적인 변화를 모두 가져왔습니다. 모든 혁신을 분석해보겠습니다..."
        }
      }
    }
  },
  ja: {
    header: {
      title: "METRIKA",
      subtitle: "不動産代理店"
    },
    home: {
      welcome: "METRIKA不動産代理店ポータルへようこそ。ここで不動産作業に必要なすべてを見つけることができます。",
      realEstateObjects: "不動産オブジェクト",
      realEstateObjectsDesc: "不動産オブジェクトの表示と管理",
      interactiveMap: "インタラクティブマップ",
      interactiveMapDesc: "都市地図でオブジェクトを探索",
      knowledgeBase: "ナレッジベース",
      knowledgeBaseDesc: "専門家情報へのアクセス",
      useMenu: "左側のメニューを使用してポータルをナビゲート"
    },
    menu: {
      home: "ホーム",
      objects: "オブジェクト",
      map: "マップ",
      about: "会社概要",
      contacts: "連絡先",
      blog: "ブログ",
      profile: "プロフィール",
      myObjects: "マイオブジェクト",
      academy: "アカデミー",
      knowledgeBase: "ナレッジベース",
      tasks: "タスクマネージャー",
      admin: "管理者パネル",
      login: "ログイン",
      logout: "ログアウト"
    },
    objects: {
      title: "不動産オブジェクト",
      filters: "フィルター",
      propertyType: "不動産タイプ",
      apartments: "アパート",
      houses: "土地付き住宅",
      commercial: "商業用",
      land: "土地",
      nonCapital: "非資本",
      shares: "株式",
      price: "価格",
      priceFrom: "から",
      priceTo: "まで",
      area: "面積 (m²)",
      areaFrom: "から",
      areaTo: "まで",
      district: "地区",
      allDistricts: "すべての地区",
      central: "中央",
      northern: "北部",
      southern: "南部",
      eastern: "東部",
      western: "西部",
      applyFilters: "フィルターを適用",
      reset: "リセット",
      found: "見つかりました",
      objects: "オブジェクト",
      sortBy: "追加日順",
      sortByPriceAsc: "価格順（昇順）",
      sortByPriceDesc: "価格順（降順）",
      sortByArea: "面積順",
      photo: "写真",
      previous: "前へ",
      next: "次へ"
    },
    map: {
      title: "インタラクティブマップ",
      description: "都市地図で不動産オブジェクトを探索",
      searchPlaceholder: "住所で検索...",
      filters: "フィルター",
      showAllObjects: "すべてのオブジェクトを表示",
      hideObjects: "オブジェクトを非表示",
      zoomIn: "ズームイン",
      zoomOut: "ズームアウト",
      fullscreen: "フルスクリーン",
      legend: "凡例",
      apartments: "アパート",
      houses: "住宅",
      commercial: "商業用",
      land: "土地"
    },
    about: {
      title: "会社概要",
      description: "METRIKA - リーディング不動産代理店",
      mission: "私たちのミッション",
      missionText: "不動産分野で質の高いサービスを提供",
      values: "私たちの価値観",
      valuesList: [
        "プロフェッショナリズム",
        "誠実さ",
        "信頼性",
        "個別アプローチ"
      ],
      team: "私たちのチーム",
      teamText: "多年の経験を持つ熟練専門家",
      experience: "作業経験",
      experienceText: "不動産市場で10年以上"
    },
    contacts: {
      title: "連絡先",
      description: "便利な方法でお問い合わせください",
      phone: "電話",
      email: "メール",
      address: "住所",
      workingHours: "営業時間",
      workingHoursText: "月-金: 9:00-18:00, 土-日: 10:00-16:00",
      office: "オフィス",
      officeAddress: "モスクワ、トゥヴェルスカヤ通り、15番",
      support: "技術サポート",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2LDKマンション",
        address: "トゥヴェルスカヤ通り15, 42号室",
        material: "レンガ"
      },
      "2": {
        title: "個人住宅",
        address: "Podmoskovnaya村, Sadovaya通り7",
        material: "6エーカーの土地"
      },
      "3": {
        title: "オフィススペース",
        address: "BC \"Center\", 301号オフィス",
        material: "コンクリート"
      },
      "4": {
        title: "1LDKマンション",
        address: "レーニン通り25, 15号室",
        material: "パネル"
      },
      "5": {
        title: "土地",
        address: "SNT \"Sunny\", 12番地",
        material: "電気"
      },
      "6": {
        title: "3LDKマンション",
        address: "平和通り8, 67号室",
        material: "モノリシック"
      },
      "7": {
        title: "スタジオ",
        address: "アルバート通り12, 3号室",
        material: "レンガ"
      },
      "8": {
        title: "コテージ",
        address: "ルブレヴォ居住区, Lesnaya通り45",
        material: "10エーカーの土地"
      },
      "9": {
        title: "小売スペース",
        address: "TC \"Mega\", 15番パビリオン",
        material: "ショッピングセンター"
      },
      "10": {
        title: "4LDKマンション",
        address: "赤の広場通り1, 100号室",
        material: "モノリシック"
      },
      "11": {
        title: "ガレージ",
        address: "工業通り5, 12番ボックス",
        material: "コンクリート"
      },
      "12": {
        title: "2LDKマンション",
        address: "Sadovaya通り30, 25号室",
        material: "パネル"
      },
      "13": {
        title: "倉庫スペース",
        address: "工業通り15, 3番倉庫",
        material: "金属構造"
      },
      "14": {
        title: "1LDKマンション",
        address: "Novaya通り7, 8号室",
        material: "レンガ"
      },
      "15": {
        title: "タウンハウス",
        address: "Zarechny居住区, 中央通り12",
        material: "4エーカーの土地"
      },
      "16": {
        title: "オフィス",
        address: "BC \"Modern\", 505号オフィス",
        material: "ガラス/コンクリート"
      },
      "17": {
        title: "3LDKマンション",
        address: "Moskovskaya通り22, 45号室",
        material: "モノリシック"
      },
      "18": {
        title: "土地",
        address: "SNT \"Daisy\", 8番地",
        material: "ガス、電気"
      },
      "19": {
        title: "スタジオ",
        address: "Molodezhnaya通り18, 2号室",
        material: "パネル"
      },
      "20": {
        title: "個人住宅",
        address: "Zelenoe村, Dachnaya通り3",
        material: "8エーカーの土地"
      },
      "21": {
        title: "2LDKマンション",
        address: "Parkovaya通り14, 33号室",
        material: "レンガ"
      },
      "22": {
        title: "工業スペース",
        address: "Zavodskaya通り25, 2番工場",
        material: "金属構造"
      },
      "23": {
        title: "1LDKマンション",
        address: "Shkolnaya通り9, 12号室",
        material: "パネル"
      },
      "24": {
        title: "コテージ",
        address: "Lesnoy居住区, Sosnovaya通り7",
        material: "12エーカーの土地"
      },
      "25": {
        title: "オフィススペース",
        address: "BC \"Business\", 201号オフィス",
        material: "コンクリート"
      },
      "26": {
        title: "3LDKマンション",
        address: "Vesennyaya通り11, 56号室",
        material: "モノリシック"
      },
      "27": {
        title: "ガレージ",
        address: "Avtomobilnaya通り3, 7番ボックス",
        material: "レンガ"
      },
      "28": {
        title: "スタジオ",
        address: "Studencheskaya通り5, 1号室",
        material: "レンガ"
      },
      "29": {
        title: "土地",
        address: "SNT \"Harvest\", 25番地",
        material: "すべての公共施設"
      },
      "30": {
        title: "タウンハウス",
        address: "Solnechny居住区, Yasnaya通り9",
        material: "5エーカーの土地"
      }
    },
    blog: {
      title: "ブログ",
      loadMore: "さらに記事を読み込む",
      readMore: "続きを読む →",
      published: "公開日:",
      articles: {
        "1": {
          title: "新築マンションでアパートを正しく選ぶ方法",
          date: "2024年1月15日",
          excerpt: "新築マンションでアパートを選ぶ際は、レイアウトから開発業者の評判まで、多くの要因に注意を払うことが重要です。この記事では、正しい選択をするのに役立つ重要なポイントについてお話しします..."
        },
        "2": {
          title: "2024年の不動産市場トレンド",
          date: "2024年1月10日",
          excerpt: "現在の不動産市場トレンドの分析は、購入者の好みと価格動向に興味深い変化を示しています。新年の主要トレンドを見てみましょう..."
        },
        "3": {
          title: "2024年の住宅ローン：何が変わったのか？",
          date: "2024年1月5日",
          excerpt: "2024年の住宅ローンの新しい条件は、潜在的な借り手にとってプラスとマイナスの両方の変化をもたらしました。すべての革新を分析してみましょう..."
        }
      }
    }
  },
  kk: {
    header: {
      title: "METRIKA",
      subtitle: "Жылжымайтын мүлік агенттігі"
    },
    home: {
      welcome: "METRIKA жылжымайтын мүлік агенттігі порталына қош келдіңіз. Мұнда жылжымайтын мүлікпен жұмыс істеуге қажетті барлық нәрсені табасыз.",
      realEstateObjects: "Жылжымайтын мүлік объектілері",
      realEstateObjectsDesc: "Жылжымайтын мүлік объектілерін көру және басқару",
      interactiveMap: "Интерактивті карта",
      interactiveMapDesc: "Қала картасында объектілерді зерттеу",
      knowledgeBase: "Білім базасы",
      knowledgeBaseDesc: "Сарапшы ақпаратына қол жеткізу",
      useMenu: "Порталыда навигация үшін сол мәзірді пайдаланыңыз"
    },
    menu: {
      home: "Басты бет",
      objects: "Объектілер",
      map: "Карта",
      about: "Біз туралы",
      contacts: "Байланыс",
      blog: "Блог",
      profile: "Профиль",
      myObjects: "Менің объектілерім",
      academy: "Академия",
      knowledgeBase: "Білім базасы",
      tasks: "Тапсырмалар менеджері",
      admin: "Админ панелі",
      login: "Кіру",
      logout: "Шығу"
    },
    objects: {
      title: "Жылжымайтын мүлік объектілері",
      filters: "Сүзгілер",
      propertyType: "Жылжымайтын мүлік түрі",
      apartments: "Пәтерлер",
      houses: "Жер учаскесі бар үйлер",
      commercial: "Коммерциялық",
      land: "Жер учаскелері",
      nonCapital: "Капиталды емес",
      shares: "Акциялар",
      price: "Баға",
      priceFrom: "Байланысты",
      priceTo: "Дейін",
      area: "Ауданы (м²)",
      areaFrom: "Байланысты",
      areaTo: "Дейін",
      district: "Аудан",
      allDistricts: "Барлық аудандар",
      central: "Орталық",
      northern: "Солтүстік",
      southern: "Оңтүстік",
      eastern: "Шығыс",
      western: "Батыс",
      applyFilters: "Сүзгілерді қолдану",
      reset: "Қалпына келтіру",
      found: "Табылды",
      objects: "объекті",
      sortBy: "Қосылған күні бойынша",
      sortByPriceAsc: "Баға бойынша (өсу)",
      sortByPriceDesc: "Баға бойынша (төмендеу)",
      sortByArea: "Аудан бойынша",
      photo: "Фото",
      previous: "Алдыңғы",
      next: "Келесі"
    },
    map: {
      title: "Интерактивті карта",
      description: "Қала картасында жылжымайтын мүлік объектілерін зерттеу",
      searchPlaceholder: "Мекенжай бойынша іздеу...",
      filters: "Сүзгілер",
      showAllObjects: "Барлық объектілерді көрсету",
      hideObjects: "Объектілерді жасыру",
      zoomIn: "Үлкейту",
      zoomOut: "Кішірейту",
      fullscreen: "Толық экран",
      legend: "Анықтама",
      apartments: "Пәтерлер",
      houses: "Үйлер",
      commercial: "Коммерциялық",
      land: "Жер учаскелері"
    },
    about: {
      title: "Біз туралы",
      description: "METRIKA - жылжымайтын мүлік саласындағы жетекші агенттік",
      mission: "Біздің миссиямыз",
      missionText: "Жылжымайтын мүлік саласында сапалы қызмет көрсету",
      values: "Біздің құндылықтарымыз",
      valuesList: [
        "Кәсібилік",
        "Шынайылық",
        "Сенімділік",
        "Жеке тұлғаға деген көзқарас"
      ],
      team: "Біздің командамыз",
      teamText: "Көпжылдық тәжірибесі бар тәжірибелі мамандар",
      experience: "Жұмыс тәжірибесі",
      experienceText: "Жылжымайтын мүлік нарығында 10 жылдан астам"
    },
    contacts: {
      title: "Байланыс",
      description: "Бізге ыңғайлы кез келген тәсілмен хабарласыңыз",
      phone: "Телефон",
      email: "Электрондық пошта",
      address: "Мекенжай",
      workingHours: "Жұмыс уақыты",
      workingHoursText: "Дүйсен-Жұма: 9:00-18:00, Сенбі-Жексен: 10:00-16:00",
      office: "Кеңсе",
      officeAddress: "Мәскеу, Тверская көшесі, 15-ші үй",
      support: "Техникалық қолдау",
      supportEmail: "support@metrika.ru"
    }
  },
  uz: {
    header: {
      title: "METRIKA",
      subtitle: "Ko'chmas mulk agentligi"
    },
    home: {
      welcome: "METRIKA ko'chmas mulk agentligi portaliiga xush kelibsiz. Bu yerda ko'chmas mulk bilan ishlash uchun kerakli barcha narsalarni topasiz.",
      realEstateObjects: "Ko'chmas mulk ob'ektlari",
      realEstateObjectsDesc: "Ko'chmas mulk ob'ektlarini ko'rish va boshqarish",
      interactiveMap: "Interaktiv xarita",
      interactiveMapDesc: "Shahar xaritasida ob'ektlarni o'rganish",
      knowledgeBase: "Bilim bazasi",
      knowledgeBaseDesc: "Ekspert ma'lumotlariga kirish",
      useMenu: "Portalda navigatsiya uchun chap menyudan foydalaning"
    },
    menu: {
      home: "Bosh sahifa",
      objects: "Ob'ektlar",
      map: "Xarita",
      about: "Biz haqimizda",
      contacts: "Aloqa",
      blog: "Blog",
      profile: "Profil",
      myObjects: "Mening ob'ektlarim",
      academy: "Akademiya",
      knowledgeBase: "Bilim bazasi",
      tasks: "Vazifalar menejeri",
      admin: "Admin paneli",
      login: "Kirish",
      logout: "Chiqish"
    },
    objects: {
      title: "Ko'chmas mulk ob'ektlari",
      filters: "Filtrlar",
      propertyType: "Ko'chmas mulk turi",
      apartments: "Kvartiralar",
      houses: "Er uchastkasi bilan uylar",
      commercial: "Savdo",
      land: "Er uchastkalari",
      nonCapital: "Kapital bo'lmagan",
      shares: "Aksiyalar",
      price: "Narx",
      priceFrom: "Dan",
      priceTo: "Gacha",
      area: "Maydon (m²)",
      areaFrom: "Dan",
      areaTo: "Gacha",
      district: "Tuman",
      allDistricts: "Barcha tumanlar",
      central: "Markaziy",
      northern: "Shimoliy",
      southern: "Janubiy",
      eastern: "Sharqiy",
      western: "G'arbiy",
      applyFilters: "Filtrlarni qo'llash",
      reset: "Qayta o'rnatish",
      found: "Topildi",
      objects: "ob'ekt",
      sortBy: "Qo'shilgan sana bo'yicha",
      sortByPriceAsc: "Narx bo'yicha (o'sish)",
      sortByPriceDesc: "Narx bo'yicha (pasayish)",
      sortByArea: "Maydon bo'yicha",
      photo: "Rasm",
      previous: "Oldingi",
      next: "Keyingi"
    },
    map: {
      title: "Interaktiv xarita",
      description: "Shahar xaritasida ko'chmas mulk ob'ektlarini o'rganish",
      searchPlaceholder: "Manzil bo'yicha qidirish...",
      filters: "Filtrlar",
      showAllObjects: "Barcha ob'ektlarni ko'rsatish",
      hideObjects: "Ob'ektlarni yashirish",
      zoomIn: "Kattalashtirish",
      zoomOut: "Kichiklashtirish",
      fullscreen: "To'liq ekran",
      legend: "Tushuntirish",
      apartments: "Kvartiralar",
      houses: "Uylar",
      commercial: "Savdo",
      land: "Er uchastkalari"
    },
    about: {
      title: "Biz haqimizda",
      description: "METRIKA - ko'chmas mulk sohasidagi yetakchi agentlik",
      mission: "Bizning missiyamiz",
      missionText: "Ko'chmas mulk sohasida sifatli xizmatlar ko'rsatish",
      values: "Bizning qadriyatlarimiz",
      valuesList: [
        "Professionalizm",
        "Halollik",
        "Ishonchlilik",
        "Individual yondashuv"
      ],
      team: "Bizning jamoamiz",
      teamText: "Ko'p yillik tajribaga ega tajribali mutaxassislar",
      experience: "Ish tajribasi",
      experienceText: "Ko'chmas mulk bozorida 10 yildan ortiq"
    },
    contacts: {
      title: "Aloqa",
      description: "Bizga qulay bo'lgan har qanday usul bilan bog'laning",
      phone: "Telefon",
      email: "Elektron pochta",
      address: "Manzil",
      workingHours: "Ish vaqti",
      workingHoursText: "Dush-Yak: 9:00-18:00, Shan-Yak: 10:00-16:00",
      office: "Ofis",
      officeAddress: "Moskva, Tverskaya ko'chasi, 15-uy",
      support: "Texnik yordam",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2 xonali kvartira",
        address: "Tverskaya ko'chasi 15, 42-xona",
        material: "G'isht"
      },
      "2": {
        title: "Shaxsiy uy",
        address: "Podmoskovnaya qishlog'i, Sadovaya ko'chasi 7",
        material: "6 akr yer uchastkasi"
      },
      "3": {
        title: "Ofis maydoni",
        address: "BC \"Center\", 301-ofis",
        material: "Beton"
      },
      "4": {
        title: "1 xonali kvartira",
        address: "Lenin ko'chasi 25, 15-xona",
        material: "Panel"
      },
      "5": {
        title: "Yer uchastkasi",
        address: "SNT \"Sunny\", 12-uchastka",
        material: "Elektrik"
      },
      "6": {
        title: "3 xonali kvartira",
        address: "Tinchlik prospekti 8, 67-xona",
        material: "Monolit"
      },
      "7": {
        title: "Studiya",
        address: "Arbat ko'chasi 12, 3-xona",
        material: "G'isht"
      },
      "8": {
        title: "Kottej",
        address: "Rublevo turar joy, Lesnaya ko'chasi 45",
        material: "10 akr yer uchastkasi"
      },
      "9": {
        title: "Sotuv maydoni",
        address: "TC \"Mega\", 15-pavilon",
        material: "Savdo markazi"
      },
      "10": {
        title: "4 xonali kvartira",
        address: "Qizil maydon ko'chasi 1, 100-xona",
        material: "Monolit"
      },
      "11": {
        title: "Garaj",
        address: "Sanoat ko'chasi 5, 12-quti",
        material: "Beton"
      },
      "12": {
        title: "2 xonali kvartira",
        address: "Sadovaya ko'chasi 30, 25-xona",
        material: "Panel"
      },
      "13": {
        title: "Ombor maydoni",
        address: "Sanoat ko'chasi 15, 3-ombor",
        material: "Metall konstruksiya"
      },
      "14": {
        title: "1 xonali kvartira",
        address: "Novaya ko'chasi 7, 8-xona",
        material: "G'isht"
      },
      "15": {
        title: "Taunhaus",
        address: "Zarechny turar joy, Markaziy ko'cha 12",
        material: "4 akr yer uchastkasi"
      },
      "16": {
        title: "Ofis",
        address: "BC \"Modern\", 505-ofis",
        material: "Shisha/beton"
      },
      "17": {
        title: "3 xonali kvartira",
        address: "Moskovskaya ko'chasi 22, 45-xona",
        material: "Monolit"
      },
      "18": {
        title: "Yer uchastkasi",
        address: "SNT \"Daisy\", 8-uchastka",
        material: "Gaz, elektrik"
      },
      "19": {
        title: "Studiya",
        address: "Molodezhnaya ko'chasi 18, 2-xona",
        material: "Panel"
      },
      "20": {
        title: "Shaxsiy uy",
        address: "Zelenoe qishlog'i, Dachnaya ko'chasi 3",
        material: "8 akr yer uchastkasi"
      },
      "21": {
        title: "2 xonali kvartira",
        address: "Parkovaya ko'chasi 14, 33-xona",
        material: "G'isht"
      },
      "22": {
        title: "Sanoat maydoni",
        address: "Zavodskaya ko'chasi 25, 2-ustaxona",
        material: "Metall konstruksiya"
      },
      "23": {
        title: "1 xonali kvartira",
        address: "Shkolnaya ko'chasi 9, 12-xona",
        material: "Panel"
      },
      "24": {
        title: "Kottej",
        address: "Lesnoy turar joy, Sosnovaya ko'chasi 7",
        material: "12 akr yer uchastkasi"
      },
      "25": {
        title: "Ofis maydoni",
        address: "BC \"Business\", 201-ofis",
        material: "Beton"
      },
      "26": {
        title: "3 xonali kvartira",
        address: "Vesennyaya ko'chasi 11, 56-xona",
        material: "Monolit"
      },
      "27": {
        title: "Garaj",
        address: "Avtomobilnaya ko'chasi 3, 7-quti",
        material: "G'isht"
      },
      "28": {
        title: "Studiya",
        address: "Studencheskaya ko'chasi 5, 1-xona",
        material: "G'isht"
      },
      "29": {
        title: "Yer uchastkasi",
        address: "SNT \"Harvest\", 25-uchastka",
        material: "Barcha kommunal xizmatlar"
      },
      "30": {
        title: "Taunhaus",
        address: "Solnechny turar joy, Yasnaya ko'chasi 9",
        material: "5 akr yer uchastkasi"
      }
    },
    blog: {
      title: "Blog",
      loadMore: "Ko'proq maqolalar yuklash",
      readMore: "Ko'proq o'qish →",
      published: "Nashr etilgan:",
      articles: {
        "1": {
          title: "Yangi binoda kvartirani to'g'ri tanlash usuli",
          date: "2024 yil 15 yanvar",
          excerpt: "Yangi binoda kvartira tanlashda, rejalashtirishdan tortib rivojlantiruvchining obro'sigacha ko'plab omillarga e'tibor berish muhimdir. Ushbu maqolada biz to'g'ri tanlov qilishga yordam beradigan asosiy nuqtalar haqida gapirib beramiz..."
        },
        "2": {
          title: "2024 yilda ko'chmas mulk bozorining tendensiyalari",
          date: "2024 yil 10 yanvar",
          excerpt: "Ko'chmas mulk bozorining hozirgi tendensiyalarini tahlil qilish xaridorlarning afzalliklari va narx dinamikasida qiziqarli o'zgarishlarni ko'rsatadi. Yangi yilning asosiy tendensiyalarini ko'rib chiqamiz..."
        },
        "3": {
          title: "2024 yilda ipoteka: nima o'zgardi?",
          date: "2024 yil 5 yanvar",
          excerpt: "2024 yilda ipoteka kreditlashning yangi shartlari potensial qarz oluvchilar uchun ijobiy va salbiy o'zgarishlarni olib keldi. Barcha yangilanishlarni tahlil qilamiz..."
        }
      }
    }
  },
  tg: {
    header: {
      title: "METRIKA",
      subtitle: "Агентии амлок"
    },
    home: {
      welcome: "Ба METRIKA агентии амлок портал хуш омадед. Дар ин ҷо ҳама чизеро, ки барои кор бо амлок лозим аст, меёбед.",
      realEstateObjects: "Объектҳои амлок",
      realEstateObjectsDesc: "Дидани ва идора кардани объектҳои амлок",
      interactiveMap: "Харитаи интерактивӣ",
      interactiveMapDesc: "Омӯхтани объектҳо дар харитаи шаҳр",
      knowledgeBase: "Пойгоҳи дониш",
      knowledgeBaseDesc: "Дастрасӣ ба маълумоти мутахассис",
      useMenu: "Барои навигатсия дар портал аз менюи чап истифода баред"
    },
    menu: {
      home: "Саҳифаи асосӣ",
      objects: "Объектҳо",
      map: "Харита",
      about: "Дар бораи мо",
      contacts: "Тамос",
      blog: "Блог",
      profile: "Профил",
      myObjects: "Объектҳои ман",
      academy: "Академия",
      knowledgeBase: "Пойгоҳи дониш",
      tasks: "Менеҷери вазифаҳо",
      admin: "Панели админ",
      login: "Ворид шудан",
      logout: "Баромадан"
    },
    objects: {
      title: "Объектҳои амлок",
      filters: "Филтрҳо",
      propertyType: "Навъи амлок",
      apartments: "Хонаҳо",
      houses: "Хонаҳо бо замин",
      commercial: "Тиҷоратӣ",
      land: "Қитъаҳои замин",
      nonCapital: "Капиталӣ нест",
      shares: "Саҳмияҳо",
      price: "Нарх",
      priceFrom: "Аз",
      priceTo: "То",
      area: "Масоҳат (м²)",
      areaFrom: "Аз",
      areaTo: "То",
      district: "Ноҳия",
      allDistricts: "Ҳамаи ноҳияҳо",
      central: "Марказӣ",
      northern: "Шимолӣ",
      southern: "Ҷанубӣ",
      eastern: "Шарқӣ",
      western: "Ғарбӣ",
      applyFilters: "Татбиқи филтрҳо",
      reset: "Бозсозӣ",
      found: "Ёфт шуд",
      objects: "объект",
      sortBy: "Тартиби илова кардани сана",
      sortByPriceAsc: "Тартиби нарх (афзоиш)",
      sortByPriceDesc: "Тартиби нарх (камшавӣ)",
      sortByArea: "Тартиби масоҳат",
      photo: "Акс",
      previous: "Қаблӣ",
      next: "Оянда"
    },
    map: {
      title: "Харитаи интерактивӣ",
      description: "Омӯхтани объектҳои амлок дар харитаи шаҳр",
      searchPlaceholder: "Ҷустуҷӯ бо суроға...",
      filters: "Филтрҳо",
      showAllObjects: "Нишон додани ҳамаи объектҳо",
      hideObjects: "Пинҳон кардани объектҳо",
      zoomIn: "Калон кардан",
      zoomOut: "Хурд кардан",
      fullscreen: "Экрани пурра",
      legend: "Тавзеҳот",
      apartments: "Хонаҳо",
      houses: "Хонаҳо",
      commercial: "Тиҷоратӣ",
      land: "Қитъаҳои замин"
    },
    about: {
      title: "Дар бораи мо",
      description: "METRIKA - агентии пешрафтаи амлок",
      mission: "Миссияи мо",
      missionText: "Таъмин кардани хизматҳои сифатӣ дар соҳаи амлок",
      values: "Арзишҳои мо",
      valuesList: [
        "Касбият",
        "Ростӣ",
        "Эътимод",
        "Равияи шахсӣ"
      ],
      team: "Дастаи мо",
      teamText: "Мутахассисони таҷрибадор бо таҷрибаи солҳои зиёд",
      experience: "Таҷрибаи кор",
      experienceText: "Зиёда аз 10 сол дар бозори амлок"
    },
    contacts: {
      title: "Тамос",
      description: "Бо мо бо ҳар гуна роҳи қулай тамос гиред",
      phone: "Телефон",
      email: "Почтаи электронӣ",
      address: "Суроға",
      workingHours: "Вақти кор",
      workingHoursText: "Душанбе-Ҷумъа: 9:00-18:00, Шанбе-Якшанбе: 10:00-16:00",
      office: "Офис",
      officeAddress: "Москва, кӯчаи Тверская, 15",
      support: "Дастгирии техникӣ",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "Хонаи 2 ҳуҷра",
        address: "Кӯчаи Тверская 15, ҳуҷраи 42",
        material: "Хишт"
      },
      "2": {
        title: "Хонаи шахсӣ",
        address: "Деҳаи Podmoskovnaya, кӯчаи Sadovaya 7",
        material: "Замин 6 акр"
      },
      "3": {
        title: "Фазои офис",
        address: "BC \"Center\", офис 301",
        material: "Бетон"
      },
      "4": {
        title: "Хонаи 1 ҳуҷра",
        address: "Кӯчаи Ленин 25, ҳуҷраи 15",
        material: "Панел"
      },
      "5": {
        title: "Замин",
        address: "SNT \"Sunny\", қисми 12",
        material: "Барқ"
      },
      "6": {
        title: "Хонаи 3 ҳуҷра",
        address: "Проспекти Сулҳ 8, ҳуҷраи 67",
        material: "Монолит"
      },
      "7": {
        title: "Студия",
        address: "Кӯчаи Арбат 12, ҳуҷраи 3",
        material: "Хишт"
      },
      "8": {
        title: "Коттедж",
        address: "Ҷойи истиқомати Rublevo, кӯчаи Lesnaya 45",
        material: "Замин 10 акр"
      },
      "9": {
        title: "Фазои тиҷоратӣ",
        address: "TC \"Mega\", павилион 15",
        material: "Маркази тиҷоратӣ"
      },
      "10": {
        title: "Хонаи 4 ҳуҷра",
        address: "Кӯчаи Майдони Сурх 1, ҳуҷраи 100",
        material: "Монолит"
      },
      "11": {
        title: "Гараж",
        address: "Кӯчаи саноатӣ 5, қутти 12",
        material: "Бетон"
      },
      "12": {
        title: "Хонаи 2 ҳуҷра",
        address: "Кӯчаи Sadovaya 30, ҳуҷраи 25",
        material: "Панел"
      },
      "13": {
        title: "Фазои анбор",
        address: "Кӯчаи саноатӣ 15, анбор 3",
        material: "Сохти металлӣ"
      },
      "14": {
        title: "Хонаи 1 ҳуҷра",
        address: "Кӯчаи Novaya 7, ҳуҷраи 8",
        material: "Хишт"
      },
      "15": {
        title: "Таунхаус",
        address: "Ҷойи истиқомати Zarechny, кӯчаи марказӣ 12",
        material: "Замин 4 акр"
      },
      "16": {
        title: "Офис",
        address: "BC \"Modern\", офис 505",
        material: "Шиша/бетон"
      },
      "17": {
        title: "Хонаи 3 ҳуҷра",
        address: "Кӯчаи Moskovskaya 22, ҳуҷраи 45",
        material: "Монолит"
      },
      "18": {
        title: "Замин",
        address: "SNT \"Daisy\", қисми 8",
        material: "Газ, барқ"
      },
      "19": {
        title: "Студия",
        address: "Кӯчаи Molodezhnaya 18, ҳуҷраи 2",
        material: "Панел"
      },
      "20": {
        title: "Хонаи шахсӣ",
        address: "Деҳаи Zelenoe, кӯчаи Dachnaya 3",
        material: "Замин 8 акр"
      },
      "21": {
        title: "Хонаи 2 ҳуҷра",
        address: "Кӯчаи Parkovaya 14, ҳуҷраи 33",
        material: "Хишт"
      },
      "22": {
        title: "Фазои саноатӣ",
        address: "Кӯчаи Zavodskaya 25, корхонаи 2",
        material: "Сохти металлӣ"
      },
      "23": {
        title: "Хонаи 1 ҳуҷра",
        address: "Кӯчаи Shkolnaya 9, ҳуҷраи 12",
        material: "Панел"
      },
      "24": {
        title: "Коттедж",
        address: "Ҷойи истиқомати Lesnoy, кӯчаи Sosnovaya 7",
        material: "Замин 12 акр"
      },
      "25": {
        title: "Фазои офис",
        address: "BC \"Business\", офис 201",
        material: "Бетон"
      },
      "26": {
        title: "Хонаи 3 ҳуҷра",
        address: "Кӯчаи Vesennyaya 11, ҳуҷраи 56",
        material: "Монолит"
      },
      "27": {
        title: "Гараж",
        address: "Кӯчаи Avtomobilnaya 3, қутти 7",
        material: "Хишт"
      },
      "28": {
        title: "Студия",
        address: "Кӯчаи Studencheskaya 5, ҳуҷраи 1",
        material: "Хишт"
      },
      "29": {
        title: "Замин",
        address: "SNT \"Harvest\", қисми 25",
        material: "Ҳамаи хизматрасониҳои коммуналӣ"
      },
      "30": {
        title: "Таунхаус",
        address: "Ҷойи истиқомати Solnechny, кӯчаи Yasnaya 9",
        material: "Замин 5 акр"
      }
    },
    blog: {
      title: "Блог",
      loadMore: "Мақолаҳои бештар боргирӣ",
      readMore: "Бештар хонед →",
      published: "Нашр шуда:",
      articles: {
        "1": {
          title: "Роҳи дуруст интихоб кардани хона дар бинои нав",
          date: "15 январи 2024",
          excerpt: "Ҳангоми интихоб кардани хона дар бинои нав, муҳим аст ба омилҳои зиёд диққат додан - аз тарҳрезӣ то шӯҳрати ронданда. Дар ин мақола мо дар бораи нуқтаҳои асосӣ, ки ба интихоби дуруст кӯмак мекунанд, сухан мегӯем..."
        },
        "2": {
          title: "Тенденсияҳои бозори амлок дар соли 2024",
          date: "10 январи 2024",
          excerpt: "Таҳлили тенденсияҳои ҷории бозори амлок тағйироти ҷолибро дар афзалиятҳои харидор ва динамикаи нарх нишон медиҳад. Биёед тенденсияҳои асосии соли навро дида бароем..."
        },
        "3": {
          title: "Ипотека дар соли 2024: чӣ тағйир ёфт?",
          date: "5 январи 2024",
          excerpt: "Шартҳои нави қарздиҳии ипотека дар соли 2024 тағйироти мусбат ва манфӣ барои қарзгирандагони эҳтимолӣ овард. Биёед ҳамаи навовариҳоро таҳлил кунем..."
        }
      }
    }
  },
  hi: {
    header: {
      title: "METRIKA",
      subtitle: "रियल एस्टेट एजेंसी"
    },
    home: {
      welcome: "METRIKA रियल एस्टेट एजेंसी पोर्टल में आपका स्वागत है। यहाँ आपको रियल एस्टेट के साथ काम करने के लिए आवश्यक सब कुछ मिलेगा।",
      realEstateObjects: "रियल एस्टेट ऑब्जेक्ट्स",
      realEstateObjectsDesc: "रियल एस्टेट ऑब्जेक्ट्स देखें और प्रबंधित करें",
      interactiveMap: "इंटरैक्टिव मैप",
      interactiveMapDesc: "शहर के नक्शे पर ऑब्जेक्ट्स का अन्वेषण करें",
      knowledgeBase: "ज्ञान आधार",
      knowledgeBaseDesc: "विशेषज्ञ जानकारी तक पहुंच प्राप्त करें",
      useMenu: "पोर्टल में नेविगेट करने के लिए बाएं मेनू का उपयोग करें"
    },
    menu: {
      home: "होम",
      objects: "ऑब्जेक्ट्स",
      map: "मैप",
      about: "हमारे बारे में",
      contacts: "संपर्क",
      blog: "ब्लॉग",
      profile: "प्रोफाइल",
      myObjects: "मेरे ऑब्जेक्ट्स",
      academy: "अकादमी",
      knowledgeBase: "ज्ञान आधार",
      tasks: "टास्क मैनेजर",
      admin: "एडमिन पैनल",
      login: "लॉगिन",
      logout: "लॉगआउट"
    },
    objects: {
      title: "रियल एस्टेट ऑब्जेक्ट्स",
      filters: "फिल्टर",
      propertyType: "संपत्ति प्रकार",
      apartments: "अपार्टमेंट",
      houses: "जमीन के साथ घर",
      commercial: "व्यावसायिक",
      land: "भूमि प्लॉट",
      nonCapital: "गैर-पूंजी",
      shares: "शेयर",
      price: "मूल्य",
      priceFrom: "से",
      priceTo: "तक",
      area: "क्षेत्र (m²)",
      areaFrom: "से",
      areaTo: "तक",
      district: "जिला",
      allDistricts: "सभी जिले",
      central: "केंद्रीय",
      northern: "उत्तरी",
      southern: "दक्षिणी",
      eastern: "पूर्वी",
      western: "पश्चिमी",
      applyFilters: "फिल्टर लागू करें",
      reset: "रीसेट",
      found: "मिला",
      objects: "ऑब्जेक्ट्स",
      sortBy: "तिथि जोड़ने के अनुसार",
      sortByPriceAsc: "मूल्य के अनुसार (आरोही)",
      sortByPriceDesc: "मूल्य के अनुसार (अवरोही)",
      sortByArea: "क्षेत्र के अनुसार",
      photo: "फोटो",
      previous: "पिछला",
      next: "अगला"
    },
    map: {
      title: "इंटरैक्टिव मैप",
      description: "शहर के नक्शे पर रियल एस्टेट ऑब्जेक्ट्स का अन्वेषण करें",
      searchPlaceholder: "पते से खोजें...",
      filters: "फिल्टर",
      showAllObjects: "सभी ऑब्जेक्ट्स दिखाएं",
      hideObjects: "ऑब्जेक्ट्स छुपाएं",
      zoomIn: "ज़ूम इन",
      zoomOut: "ज़ूम आउट",
      fullscreen: "फुलस्क्रीन",
      legend: "किंवदंती",
      apartments: "अपार्टमेंट",
      houses: "घर",
      commercial: "व्यावसायिक",
      land: "भूमि प्लॉट"
    },
    about: {
      title: "हमारे बारे में",
      description: "METRIKA - अग्रणी रियल एस्टेट एजेंसी",
      mission: "हमारा मिशन",
      missionText: "रियल एस्टेट क्षेत्र में गुणवत्तापूर्ण सेवाएं प्रदान करना",
      values: "हमारे मूल्य",
      valuesList: [
        "व्यावसायिकता",
        "ईमानदारी",
        "विश्वसनीयता",
        "व्यक्तिगत दृष्टिकोण"
      ],
      team: "हमारी टीम",
      teamText: "कई वर्षों के अनुभव के साथ अनुभवी विशेषज्ञ",
      experience: "कार्य अनुभव",
      experienceText: "रियल एस्टेट बाजार में 10 से अधिक वर्ष"
    },
    contacts: {
      title: "संपर्क",
      description: "किसी भी सुविधाजनक तरीके से हमसे संपर्क करें",
      phone: "फोन",
      email: "ईमेल",
      address: "पता",
      workingHours: "कार्य समय",
      workingHoursText: "सोम-शुक्र: 9:00-18:00, शनि-रवि: 10:00-16:00",
      office: "कार्यालय",
      officeAddress: "मॉस्को, टवरस्काया स्ट्रीट, 15",
      support: "तकनीकी सहायता",
      supportEmail: "support@metrika.ru"
    },
    realEstateObjects: {
      "1": {
        title: "2 कमरे का अपार्टमेंट",
        address: "टवरस्काया स्ट्रीट 15, अपार्टमेंट 42",
        material: "ईंट"
      },
      "2": {
        title: "निजी घर",
        address: "Podmoskovnaya गाँव, Sadovaya स्ट्रीट 7",
        material: "6 एकड़ भूमि"
      },
      "3": {
        title: "कार्यालय स्थान",
        address: "BC \"Center\", कार्यालय 301",
        material: "कंक्रीट"
      },
      "4": {
        title: "1 कमरे का अपार्टमेंट",
        address: "लेनिन स्ट्रीट 25, अपार्टमेंट 15",
        material: "पैनल"
      },
      "5": {
        title: "भूमि",
        address: "SNT \"Sunny\", प्लॉट 12",
        material: "बिजली"
      },
      "6": {
        title: "3 कमरे का अपार्टमेंट",
        address: "शांति एवेन्यू 8, अपार्टमेंट 67",
        material: "मोनोलिथ"
      },
      "7": {
        title: "स्टूडियो",
        address: "अरबत स्ट्रीट 12, अपार्टमेंट 3",
        material: "ईंट"
      },
      "8": {
        title: "कॉटेज",
        address: "Rublevo बस्ती, Lesnaya स्ट्रीट 45",
        material: "10 एकड़ भूमि"
      },
      "9": {
        title: "खुदरा स्थान",
        address: "TC \"Mega\", पैवेलियन 15",
        material: "शॉपिंग सेंटर"
      },
      "10": {
        title: "4 कमरे का अपार्टमेंट",
        address: "रेड स्क्वायर स्ट्रीट 1, अपार्टमेंट 100",
        material: "मोनोलिथ"
      },
      "11": {
        title: "गैराज",
        address: "औद्योगिक स्ट्रीट 5, बॉक्स 12",
        material: "कंक्रीट"
      },
      "12": {
        title: "2 कमरे का अपार्टमेंट",
        address: "Sadovaya स्ट्रीट 30, अपार्टमेंट 25",
        material: "पैनल"
      },
      "13": {
        title: "गोदाम स्थान",
        address: "औद्योगिक स्ट्रीट 15, गोदाम 3",
        material: "धातु संरचना"
      },
      "14": {
        title: "1 कमरे का अपार्टमेंट",
        address: "Novaya स्ट्रीट 7, अपार्टमेंट 8",
        material: "ईंट"
      },
      "15": {
        title: "टाउनहाउस",
        address: "Zarechny बस्ती, केंद्रीय स्ट्रीट 12",
        material: "4 एकड़ भूमि"
      },
      "16": {
        title: "कार्यालय",
        address: "BC \"Modern\", कार्यालय 505",
        material: "कांच/कंक्रीट"
      },
      "17": {
        title: "3 कमरे का अपार्टमेंट",
        address: "Moskovskaya स्ट्रीट 22, अपार्टमेंट 45",
        material: "मोनोलिथ"
      },
      "18": {
        title: "भूमि",
        address: "SNT \"Daisy\", प्लॉट 8",
        material: "गैस, बिजली"
      },
      "19": {
        title: "स्टूडियो",
        address: "Molodezhnaya स्ट्रीट 18, अपार्टमेंट 2",
        material: "पैनल"
      },
      "20": {
        title: "निजी घर",
        address: "Zelenoe गाँव, Dachnaya स्ट्रीट 3",
        material: "8 एकड़ भूमि"
      },
      "21": {
        title: "2 कमरे का अपार्टमेंट",
        address: "Parkovaya स्ट्रीट 14, अपार्टमेंट 33",
        material: "ईंट"
      },
      "22": {
        title: "औद्योगिक स्थान",
        address: "Zavodskaya स्ट्रीट 25, कारखाना 2",
        material: "धातु संरचना"
      },
      "23": {
        title: "1 कमरे का अपार्टमेंट",
        address: "Shkolnaya स्ट्रीट 9, अपार्टमेंट 12",
        material: "पैनल"
      },
      "24": {
        title: "कॉटेज",
        address: "Lesnoy बस्ती, Sosnovaya स्ट्रीट 7",
        material: "12 एकड़ भूमि"
      },
      "25": {
        title: "कार्यालय स्थान",
        address: "BC \"Business\", कार्यालय 201",
        material: "कंक्रीट"
      },
      "26": {
        title: "3 कमरे का अपार्टमेंट",
        address: "Vesennyaya स्ट्रीट 11, अपार्टमेंट 56",
        material: "मोनोलिथ"
      },
      "27": {
        title: "गैराज",
        address: "Avtomobilnaya स्ट्रीट 3, बॉक्स 7",
        material: "ईंट"
      },
      "28": {
        title: "स्टूडियो",
        address: "Studencheskaya स्ट्रीट 5, अपार्टमेंट 1",
        material: "ईंट"
      },
      "29": {
        title: "भूमि",
        address: "SNT \"Harvest\", प्लॉट 25",
        material: "सभी सार्वजनिक सुविधाएं"
      },
      "30": {
        title: "टाउनहाउस",
        address: "Solnechny बस्ती, Yasnaya स्ट्रीट 9",
        material: "5 एकड़ भूमि"
      }
    },
    blog: {
      title: "ब्लॉग",
      loadMore: "और लेख लोड करें",
      readMore: "और पढ़ें →",
      published: "प्रकाशित:",
      articles: {
        "1": {
          title: "नई इमारत में अपार्टमेंट सही तरीके से कैसे चुनें",
          date: "15 जनवरी 2024",
          excerpt: "नई इमारत में अपार्टमेंट चुनते समय, लेआउट से लेकर डेवलपर की प्रतिष्ठा तक कई कारकों पर ध्यान देना महत्वपूर्ण है। इस लेख में हम उन मुख्य बिंदुओं के बारे में बताएंगे जो सही चुनाव करने में मदद करेंगे..."
        },
        "2": {
          title: "2024 में रियल एस्टेट बाजार के रुझान",
          date: "10 जनवरी 2024",
          excerpt: "रियल एस्टेट बाजार के वर्तमान रुझानों का विश्लेषण खरीदारों की प्राथमिकताओं और मूल्य गतिशीलता में दिलचस्प बदलाव दिखाता है। आइए नए साल के मुख्य रुझानों को देखें..."
        },
        "3": {
          title: "2024 में मॉर्गेज: क्या बदला?",
          date: "5 जनवरी 2024",
          excerpt: "2024 में मॉर्गेज ऋण की नई शर्तों ने संभावित उधारकर्ताओं के लिए सकारात्मक और नकारात्मक दोनों बदलाव लाए हैं। आइए सभी नवाचारों का विश्लेषण करें..."
        }
      }
    }
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('ru')

  // Получаем перевод по ключу
  const t = (key: string): string | any => {
    const keys = key.split('.')
    let value: string | Translations | any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Возвращаем ключ если перевод не найден
      }
    }
    
    return value
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
