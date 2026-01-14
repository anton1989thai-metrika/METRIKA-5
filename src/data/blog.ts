interface BlogPost {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readTime: string
  author: string
  category: string
  image?: string
  content?: string
}

export const blogPosts: BlogPost[] = [
  {
    title: "Как выбрать идеальную недвижимость для инвестиций",
    excerpt: "Подробное руководство по выбору недвижимости для инвестиций. Рассматриваем ключевые факторы, которые влияют на доходность и перспективы роста стоимости.",
    slug: "kak-vybrat-idealnuyu-nedvizhimost-dlya-investitsiy",
    publishedAt: "15 января 2024",
    readTime: "8 мин",
    author: "Анна Петрова",
    category: "Инвестиции",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center"
  },
  {
    title: "Тренды рынка недвижимости в 2024 году",
    excerpt: "Анализ основных тенденций рынка недвижимости в новом году. Прогнозы экспертов и рекомендации для покупателей и продавцов.",
    slug: "trendy-rynka-nedvizhimosti-v-2024-godu",
    publishedAt: "10 января 2024",
    readTime: "6 мин",
    author: "Михаил Соколов",
    category: "Аналитика",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center"
  },
  {
    title: "Оформление документов при покупке квартиры",
    excerpt: "Пошаговая инструкция по оформлению всех необходимых документов при покупке недвижимости. Список документов и сроки их получения.",
    slug: "oformlenie-dokumentov-pri-pokupke-kvartiry",
    publishedAt: "5 января 2024",
    readTime: "10 мин",
    author: "Елена Козлова",
    category: "Документы",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop&crop=center"
  },
  {
    title: "Ипотека: как получить лучшие условия",
    excerpt: "Секреты получения выгодной ипотеки. Сравнение банков, требования к заемщикам и способы снижения процентной ставки.",
    slug: "ipoteka-kak-poluchit-luchshie-usloviya",
    publishedAt: "2 января 2024",
    readTime: "7 мин",
    author: "Дмитрий Волков",
    category: "Ипотека",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center"
  },
  {
    title: "Ремонт квартиры: с чего начать",
    excerpt: "Практические советы по планированию и проведению ремонта. Бюджет, сроки, выбор материалов и подрядчиков.",
    slug: "remont-kvartiry-s-chego-nachat",
    publishedAt: "28 декабря 2023",
    readTime: "9 мин",
    author: "Ольга Морозова",
    category: "Ремонт",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center"
  },
  {
    title: "Налоги при продаже недвижимости",
    excerpt: "Все о налогообложении при продаже недвижимости. Налоговые вычеты, сроки владения и способы оптимизации налогов.",
    slug: "nalogi-pri-prodazhe-nedvizhimosti",
    publishedAt: "25 декабря 2023",
    readTime: "5 мин",
    author: "Сергей Новиков",
    category: "Налоги",
    image: "https://images.unsplash.com/photo-1554224154-26032fbc8d29?w=400&h=300&fit=crop&crop=center"
  }
]

export const categories = [
  "Все",
  "Инвестиции",
  "Аналитика", 
  "Документы",
  "Ипотека",
  "Ремонт",
  "Налоги"
]
