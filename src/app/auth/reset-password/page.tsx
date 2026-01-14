import ResetPasswordClient from './ResetPasswordClient'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string | string[] }>
}) {
  const resolvedParams = await searchParams
  const raw = resolvedParams?.token
  const token = Array.isArray(raw) ? raw[0] : raw || ''
  return <ResetPasswordClient token={token} />
}
