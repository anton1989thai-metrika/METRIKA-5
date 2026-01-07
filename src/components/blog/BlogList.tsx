"use client"

import { BlogCard } from "./BlogCard"

interface BlogListProps {
  posts: Array<{
    title: string
    excerpt: string
    slug: string
    publishedAt: string
    readTime: string
    author: string
    category: string
    image?: string
  }>
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          excerpt={post.excerpt}
          slug={post.slug}
          publishedAt={post.publishedAt}
          readTime={post.readTime}
          author={post.author}
          category={post.category}
          image={post.image}
        />
      ))}
    </div>
  )
}
