"use client"

import React, { useEffect, useState } from 'react'
import { getDraft } from '@/lib/draftStorage'
import reportPersister from '@/lib/reportPersister'

export default function PersistDebugPage() {
  const [agg, setAgg] = useState<any>(null)

  useEffect(() => {
    try {
      const a = reportPersister.getAggregate()
      setAgg(a)
    } catch (e) {
      console.error('persist-debug read failed', e)
    }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Persist Debug</h1>
      <pre>{JSON.stringify(agg, null, 2)}</pre>
      <p>Raw sessionStorage (key=report_draft_aggregate):</p>
      <pre>{typeof window !== 'undefined' ? sessionStorage.getItem('report_draft_aggregate') : 'no-window'}</pre>
    </div>
  )
}
