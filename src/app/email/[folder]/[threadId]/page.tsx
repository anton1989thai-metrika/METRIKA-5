'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import BurgerMenu from '@/components/BurgerMenu'
import Header from '@/components/Header'
import Sidebar from '@/components/email/Sidebar'
import EmailView from '@/components/email/EmailView'
import { useState, useEffect } from 'react'
import { fetchJsonOrNull } from '@/lib/api-client'

interface Folder {
  id: string
  name: string
  slug: string
}

function EmailViewPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const folderSlug = params?.folder as string
  const emailId = params?.threadId as string // Actually email ID, not thread ID
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentEmail, setCurrentEmail] = useState<string>('')
  const [selectedMailbox, setSelectedMailbox] = useState<string>('')

  useEffect(() => {
    // Load admin/user email
    async function fetchUserData() {
      try {
        const userData = await fetchJsonOrNull<{ email?: string }>('/api/user')
        if (userData?.email) setCurrentEmail(userData.email)
      } catch {}
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    // selected mailbox from query ?mb= or localStorage
    const mb = searchParams.get('mb') || ''
    if (mb) {
      setSelectedMailbox(mb)
      try {
        localStorage.setItem('EMAIL_SELECTED_MAILBOX', mb)
      } catch {}
      return
    }
    try {
      const saved = localStorage.getItem('EMAIL_SELECTED_MAILBOX') || ''
      if (saved) setSelectedMailbox(saved)
    } catch {}
  }, [searchParams])

  useEffect(() => {
    async function fetchFolders() {
      const qs = new URLSearchParams()
      qs.set('folder', 'inbox')
      if (selectedMailbox) {
        qs.set('viewEmail', selectedMailbox)
      }
      const data = await fetchJsonOrNull<{ folders?: Folder[] }>(
        `/api/emails?${qs.toString()}`,
        {
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        }
      )
      if (data?.folders) {
        setFolders(data.folders)
      }
    }

    fetchFolders()
  }, [selectedMailbox, currentEmail])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-black">Почта METRIKA</h1>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <BurgerMenu />

      {/* Main Content */}
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-6">
            {/* Sidebar */}
            <Sidebar folders={folders} />

            {/* Email View */}
            <div className="flex-1">
              <EmailView
                emailId={emailId}
                folderSlug={folderSlug}
                currentEmail={currentEmail}
                selectedMailbox={selectedMailbox}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function EmailViewPage() {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <EmailViewPageContent />
    </Suspense>
  )
}
