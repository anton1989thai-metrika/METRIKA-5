"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  Target, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Heart,
  Building2,
  Handshake,
  FileText,
  Calculator
} from "lucide-react"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <div className="text-primary text-xl">
            {iconMap[icon]}
          </div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  number: string
  label: string
  icon: string
}

export function StatCard({ number, label, icon }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
        <div className="text-muted-foreground text-xl">
          {iconMap[icon]}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

interface TeamMemberProps {
  name: string
  position: string
  image?: string
  description: string
}

export function TeamMember({ name, position, image, description }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground text-sm">Фото</span>
            </div>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{name}</CardTitle>
        <Badge variant="secondary" className="w-fit">{position}</Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

interface ServiceItemProps {
  service: string
}

export function ServiceItem({ service }: ServiceItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
      <span className="text-sm">{service}</span>
    </div>
  )
}

interface ContactItemProps {
  icon: React.ReactNode
  title: string
  value: string
}

export function ContactItem({ icon, title, value }: ContactItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  )
}
