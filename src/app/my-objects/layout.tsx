import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/session'
import { hasSectionAccess } from '@/lib/permissions-core'

export default async function MyObjectsLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser()
  if (!user) redirect('/auth/signin')
  if (!hasSectionAccess(user, 'my-objects')) redirect('/')
  return children
}
