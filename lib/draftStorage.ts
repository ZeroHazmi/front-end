// session-based draft storage for report flow
export const DRAFT_KEY_PREFIX = 'report_draft_' 

export function getDraft(keySuffix: string) {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY_PREFIX + keySuffix)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('getDraft error', e)
    return null
  }
}

export function setDraft(keySuffix: string, value: any) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(DRAFT_KEY_PREFIX + keySuffix, JSON.stringify(value))
  } catch (e) {
    console.error('setDraft error', e)
  }
}

export function clearDraft(keySuffix: string) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(DRAFT_KEY_PREFIX + keySuffix)
  } catch (e) {
    console.error('clearDraft error', e)
  }
}
