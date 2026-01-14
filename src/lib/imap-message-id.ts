export function normalizeMessageId(value?: string | null): string {
  const raw = String(value || '').trim()
  if (!raw) return ''
  let out = raw
  if (out.startsWith('<') && out.endsWith('>') && out.length > 2) {
    out = out.slice(1, -1)
  }
  return out.trim().toLowerCase()
}

export function messageIdCandidates(value?: string | null): string[] {
  const raw = String(value || '').trim()
  if (!raw) return []
  let core = raw
  if (core.startsWith('<') && core.endsWith('>') && core.length > 2) {
    core = core.slice(1, -1)
  }
  const withBrackets = core ? `<${core}>` : ''
  const normalized = normalizeMessageId(raw)
  const normalizedWithBrackets = normalized ? `<${normalized}>` : ''
  const lowerRaw = raw.toLowerCase()
  const lowerCore = core.toLowerCase()
  const lowerWithBrackets = lowerCore ? `<${lowerCore}>` : ''
  const candidates = [
    raw,
    core,
    withBrackets,
    normalized,
    normalizedWithBrackets,
    lowerRaw,
    lowerCore,
    lowerWithBrackets,
  ].filter(Boolean)
  return Array.from(new Set(candidates))
}
