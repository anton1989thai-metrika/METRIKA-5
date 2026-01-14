'use client'

import { Inbox, Send, Star, Trash2, Archive, Folder, AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Folder {
  id: string
  name: string
  slug: string
  _count?: {
    emails: number
  }
}

interface SidebarProps {
  folders: Folder[]
}

export default function Sidebar({ folders }: SidebarProps) {
  const searchParams = useSearchParams()
  const currentFolder = searchParams.get('folder') || 'inbox'

  return (
    <div className="w-64 space-y-1">
      <Link
        href="/email?folder=inbox"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'inbox'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Inbox className="w-5 h-5" />
        <span className="font-medium">Входящие</span>
      </Link>

      <Link
        href="/email?folder=sent"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'sent'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Send className="w-5 h-5" />
        <span className="font-medium">Отправленные</span>
      </Link>

      <Link
        href="/email?folder=drafts"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'drafts'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="font-medium">Черновики</span>
      </Link>

      <Link
        href="/email?folder=starred"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'starred'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Star className="w-5 h-5" />
        <span className="font-medium">Важные</span>
      </Link>

      <Link
        href="/email?folder=spam"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'spam'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="font-medium">Спам</span>
      </Link>

      <Link
        href="/email?folder=archive"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'archive'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Archive className="w-5 h-5" />
        <span className="font-medium">Архив</span>
      </Link>

      <Link
        href="/email?folder=trash"
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
          currentFolder === 'trash'
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Trash2 className="w-5 h-5" />
        <span className="font-medium">Корзина</span>
      </Link>

      {folders.length > 0 && (
        <>
          <div className="border-t border-gray-200 my-2" />
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
            Папки
          </div>
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/email?folder=${folder.slug}`}
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                currentFolder === folder.slug
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Folder className="w-5 h-5" />
                <span className="font-medium">{folder.name}</span>
              </div>
              {folder._count && folder._count.emails > 0 && (
                <span
                  className={`text-xs ${
                    currentFolder === folder.slug
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {folder._count.emails}
                </span>
              )}
            </Link>
          ))}
        </>
      )}
    </div>
  )
}
