"use client"

import BurgerMenu from "@/components/BurgerMenu"
import Header from "@/components/Header"
import { FeatureCard, StatCard, TeamMember, ServiceItem, ContactItem } from "@/components/about/AboutComponents"
import { features, stats, teamMembers, services } from "@/data/about"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ArrowRight,
  Building2,
  Handshake
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BurgerMenu />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              О компании
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              МЕТРИКА АГЕНТСТВО НЕДВИЖИМОСТИ
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ваш надежный партнер в мире недвижимости. Мы помогаем воплощать мечты в реальность уже более 10 лет.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">
                Наши услуги
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Наши достижения
              </h2>
              <p className="text-lg text-muted-foreground">
                Цифры, которые говорят о качестве нашей работы
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  number={stat.number}
                  label={stat.label}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-lg text-muted-foreground">
                Мы предлагаем комплексный подход к работе с недвижимостью
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Services Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Наши услуги
              </h2>
              <p className="text-lg text-muted-foreground">
                Полный спектр услуг в сфере недвижимости
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5" />
                  Что мы предлагаем
                </CardTitle>
                <CardDescription>
                  Комплексные решения для всех ваших потребностей в недвижимости
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  {services.map((service, index) => (
                    <ServiceItem key={index} service={service} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Наша команда
              </h2>
              <p className="text-lg text-muted-foreground">
                Профессионалы с многолетним опытом работы
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={index}
                  name={member.name}
                  position={member.position}
                  image={member.image}
                  description={member.description}
                />
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Свяжитесь с нами
              </h2>
              <p className="text-lg text-muted-foreground">
                Готовы помочь вам найти идеальную недвижимость
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ContactItem
                icon={<Phone className="h-4 w-4" />}
                title="Телефон"
                value="+7 (XXX) XXX-XX-XX"
              />
              <ContactItem
                icon={<Mail className="h-4 w-4" />}
                title="Email"
                value="info@metrika.ru"
              />
              <ContactItem
                icon={<MapPin className="h-4 w-4" />}
                title="Адрес"
                value="Москва, ул. Примерная, д. 123"
              />
              <ContactItem
                icon={<Clock className="h-4 w-4" />}
                title="Часы работы"
                value="Пн-Пт: 9:00-18:00"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
