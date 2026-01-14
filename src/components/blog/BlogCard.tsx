"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { useState } from "react"

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readTime: string
  author: string
  category: string
  image?: string
}

export function BlogCard({
  title,
  excerpt,
  slug,
  publishedAt,
  readTime,
  author,
  category,
  image
}: BlogCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {image && !imageError ? (
            <Image
              src={image}
              alt={title}
              width={600}
              height={192}
              unoptimized
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📰</span>
                </div>
                <span className="text-blue-600 text-sm font-medium">Статья</span>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{publishedAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
        
        <Link 
          href={`/blog/${slug}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Читать далее →
        </Link>
      </CardContent>
    </Card>
  )
}
