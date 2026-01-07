import ResetPasswordClient from './ResetPasswordClient'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string | string[] }
}) {
  const raw = searchParams?.token
  const token = Array.isArray(raw) ? raw[0] : raw || ''
  return <ResetPasswordClient token={token} />
}

