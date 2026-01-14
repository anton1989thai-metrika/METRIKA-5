export type ApiErrorPayload = {
  error?: string
  message?: string
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init)
  const data = await parseJsonSafe(response)
  if (!response.ok) {
    const payload = data as ApiErrorPayload | null
    const message =
      payload?.error ||
      payload?.message ||
      response.statusText ||
      'Request failed'
    throw new Error(message)
  }
  return data as T
}

export async function fetchJsonOrNull<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T | null> {
  try {
    return await fetchJson<T>(input, init)
  } catch {
    return null
  }
}
