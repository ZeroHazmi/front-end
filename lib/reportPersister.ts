import { getDraft, setDraft, clearDraft } from './draftStorage'

// Centralized helpers for the multi-step report flow
const AGG_KEY = 'aggregate'
const DETAILS_KEY = 'incidentDetails'

export function getAggregate(): any {
  try {
    const v = getDraft(AGG_KEY) || {}
    // lightweight debug to help trace client-side persistence
    if (typeof window !== 'undefined') console.debug('[reportPersister] getAggregate ->', v)
    return v
  } catch (e) {
    console.error('[reportPersister] getAggregate error', e)
    return {}
  }
}

export function setAggregate(data: any) {
  try {
    if (typeof window !== 'undefined') console.debug('[reportPersister] setAggregate <-', data)
    setDraft(AGG_KEY, data)
  } catch (e) {
    console.error('[reportPersister] setAggregate error', e)
  }
}

export function setAggregatePatch(patch: Partial<any>) {
  try {
    const cur = getDraft(AGG_KEY) || {}
    const next = { ...cur, ...patch }
    if (typeof window !== 'undefined') console.debug('[reportPersister] setAggregatePatch patch ->', patch, 'result ->', next)
    setDraft(AGG_KEY, next)
    return next
  } catch (e) {
    console.error('[reportPersister] setAggregatePatch error', e)
    return patch
  }
}

export function clearAggregate() {
  try { clearDraft(AGG_KEY) } catch (e) {}
}
export function clearDetails() { try { clearDraft(DETAILS_KEY) } catch (e) {} }

export function getDetails(): any { return getDraft(DETAILS_KEY) }
export function setDetails(v: any) { try { setDraft(DETAILS_KEY, v) } catch (e) {} }

export function clearAll() {
  try { clearDraft(AGG_KEY); clearDraft(DETAILS_KEY) } catch (e) {}
}

const persister = { getAggregate, setAggregate, setAggregatePatch, clearAggregate, getDetails, setDetails, clearDetails, clearAll }
export default persister
