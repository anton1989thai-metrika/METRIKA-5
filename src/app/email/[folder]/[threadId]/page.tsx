'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import BurgerMenu from '@/components/BurgerMenu'
import Sidebar from '@/components/email/Sidebar'
import EmailView from '@/components/email/EmailView'
import { useState, useEffect } from 'react'

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
        const userResponse = await fetch('/api/user')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.email) setCurrentEmail(userData.email)
        }
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
      try {
        const qs = new URLSearchParams()
        qs.set('folder', 'inbox')
        if (selectedMailbox && currentEmail && selectedMailbox !== currentEmail) {
          qs.set('viewEmail', selectedMailbox)
        }
        const response = await fetch(`/api/emails?${qs.toString()}`, {
          headers: currentEmail ? { 'x-user-email': currentEmail } : undefined,
        })
        if (response.ok) {
          const data = await response.json()
          setFolders(data.folders || [])
        }
      } catch (error) {
        console.error('Error fetching folders:', error)
      }
    }

    fetchFolders()
  }, [selectedMailbox, currentEmail])

  return (
    <div className="min-h-screen bg-gray-50">
      <BurgerMenu />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-black">Почта METRIKA</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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

