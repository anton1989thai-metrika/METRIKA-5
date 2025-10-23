export interface TeamMember {
  name: string
  position: string
  image?: string
  description: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface Stat {
  number: string
  label: string
  icon: string
}

export const features: Feature[] = [
  {
    icon: "Target",
    title: "Наша миссия",
    description: "Помогаем каждому клиенту найти идеальную недвижимость, обеспечивая максимальное качество услуг и индивидуальный подход."
  },
  {
    icon: "Star",
    title: "Наши ценности",
    description: "Честность, профессионализм, прозрачность и клиентоориентированность — основа нашей работы с каждым клиентом."
  },
  {
    icon: "TrendingUp",
    title: "Наш опыт",
    description: "Более 10 лет успешной работы на рынке недвижимости с командой экспертов и глубоким знанием рынка."
  },
  {
    icon: "Shield",
    title: "Наша надежность",
    description: "Полное юридическое сопровождение сделок, страхование рисков и гарантии качества предоставляемых услуг."
  }
]

export const stats: Stat[] = [
  {
    number: "500+",
    label: "Успешных сделок",
    icon: "Building2"
  },
  {
    number: "1000+",
    label: "Довольных клиентов",
    icon: "Users"
  },
  {
    number: "10+",
    label: "Лет опыта",
    icon: "Award"
  },
  {
    number: "24/7",
    label: "Поддержка клиентов",
    icon: "Phone"
  }
]

export const teamMembers: TeamMember[] = [
  {
    name: "Анна Петрова",
    position: "Генеральный директор",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    description: "Эксперт с 15-летним опытом работы в сфере недвижимости. Специализируется на элитной недвижимости и инвестиционных проектах."
  },
  {
    name: "Михаил Соколов",
    position: "Руководитель отдела продаж",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    description: "Профессиональный риелтор с глубоким знанием рынка недвижимости. Помогает клиентам найти идеальное жилье."
  },
  {
    name: "Елена Козлова",
    position: "Юрист-консультант",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    description: "Опытный юрист, специализирующийся на сопровождении сделок с недвижимостью и решении правовых вопросов."
  },
  {
    name: "Дмитрий Волков",
    position: "Специалист по ипотеке",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    description: "Эксперт по ипотечному кредитованию. Помогает клиентам получить выгодные условия кредитования."
  }
]

export const services = [
  "Продажа и покупка недвижимости",
  "Аренда жилых и коммерческих помещений",
  "Оценка недвижимости",
  "Консультации по недвижимости",
  "Юридическое сопровождение сделок",
  "Ипотечное кредитование",
  "Управление недвижимостью",
  "Инвестиционные консультации"
]
