export interface ContentItem {
  id: number | string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: string
  featuredImage: string
  seoTitle: string
  seoDescription: string
  publishDate: string
  language: string
  createdAt: string
  updatedAt: string
  author: string
  views: number
}

export type ContentDraft = Partial<ContentItem> & { id?: number | string }
