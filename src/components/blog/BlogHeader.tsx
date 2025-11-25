"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BlogHeaderProps {
  title: string
  description: string
  onSearch?: (query: string) => void
}

export function BlogHeader({ title, description, onSearch }: BlogHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      
      {onSearch && (
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Поиск статей..."
              className="pl-10 pr-4 py-2 w-full"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
