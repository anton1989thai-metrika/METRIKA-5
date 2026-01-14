"use client"

import Image from "next/image"
import BurgerMenu from "@/components/BurgerMenu"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ArrowRight,
  Building2,
  Handshake,
  Users,
  Award,
  Target,
  Star,
  TrendingUp,
  Shield,
  CheckCircle,
  Globe,
  Zap,
  Heart,
  Briefcase,
  Rocket
} from "lucide-react"

const stats = [
  { number: "500+", label: "Успешных сделок", icon: Building2 },
  { number: "1000+", label: "Довольных клиентов", icon: Users },
  { number: "10+", label: "Лет опыта", icon: Award },
  { number: "24/7", label: "Поддержка клиентов", icon: Phone }
]

const features = [
  {
    icon: Target,
    title: "Наша миссия",
    description: "Помогаем каждому клиенту найти идеальную недвижимость, обеспечивая максимальное качество услуг и индивидуальный подход."
  },
  {
    icon: Star,
    title: "Наши ценности",
    description: "Честность, профессионализм, прозрачность и клиентоориентированность — основа нашей работы с каждым клиентом."
  },
  {
    icon: TrendingUp,
    title: "Наш опыт",
    description: "Более 10 лет успешной работы на рынке недвижимости с командой экспертов и глубоким знанием рынка."
  },
  {
    icon: Shield,
    title: "Наша надежность",
    description: "Полное юридическое сопровождение сделок, страхование рисков и гарантии качества предоставляемых услуг."
  }
]

const services = [
  "Продажа и покупка недвижимости",
  "Аренда жилых и коммерческих помещений",
  "Оценка недвижимости",
  "Консультации по недвижимости",
  "Юридическое сопровождение сделок",
  "Ипотечное кредитование",
  "Управление недвижимостью",
  "Инвестиционные консультации"
]

const teamMembers = [
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

const values = [
  { icon: Heart, title: "Клиентоориентированность", description: "Каждый клиент для нас уникален" },
  { icon: Shield, title: "Надежность", description: "Гарантируем качество услуг" },
  { icon: Zap, title: "Эффективность", description: "Быстрые и точные решения" },
  { icon: Globe, title: "Инновации", description: "Используем современные технологии" }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div id="preview-container">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32">
        {/* Hero Section - Enterprise Style */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} />
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
              <Rocket className="w-4 h-4 mr-2" />
              Enterprise Solution
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              МЕТРИКА
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
              АГЕНТСТВО НЕДВИЖИМОСТИ
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ваш надежный партнер в мире недвижимости. Мы помогаем воплощать мечты в реальность уже более 10 лет, используя передовые технологии и глубокую экспертизу рынка.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Briefcase className="mr-2 h-5 w-5" />
                Наши услуги
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300">
                <Phone className="mr-2 h-5 w-5" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section - Enterprise Grid */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                Наши достижения
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Цифры, которые говорят о качестве нашей работы и доверии клиентов
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Enterprise Cards */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                Почему выбирают нас
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Мы предлагаем комплексный подход к работе с недвижимостью, основанный на инновациях и многолетнем опыте
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                Наши ценности
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Принципы, которые лежат в основе нашей работы
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - Enterprise Style */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                Наши услуги
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Полный спектр услуг в сфере недвижимости для решения любых задач
              </p>
            </div>
            
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                  Что мы предлагаем
                </CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  Комплексные решения для всех ваших потребностей в недвижимости
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section - Enterprise Grid */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
                Наша команда
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Профессионалы с многолетним опытом работы в сфере недвижимости
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white">
                  <div className="relative">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={400}
                        height={256}
                        unoptimized
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Users className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">{member.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800">
                      {member.position}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {member.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section - Enterprise Style */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Свяжитесь с нами
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Готовы помочь вам найти идеальную недвижимость? Давайте обсудим ваши потребности
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Телефон</h3>
                <p className="text-blue-100 text-lg">+7 (XXX) XXX-XX-XX</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Email</h3>
                <p className="text-blue-100 text-lg">info@metrika.ru</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Адрес</h3>
                <p className="text-blue-100 text-lg">Москва, ул. Примерная, д. 123</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Часы работы</h3>
                <p className="text-blue-100 text-lg">Пн-Пт: 9:00-18:00</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>
    </div>
  )
}
