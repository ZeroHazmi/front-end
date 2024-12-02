'use client'

import ViewReport from '@/components/ViewReport';
import { useParams } from 'next/navigation'
import React from 'react'

const PoliceViewReportPage = () => {
  const params = useParams();
  const reportId = Array.isArray(params.reportId) ? params.reportId[0] : params.reportId;

  if (!reportId) {
    return <div>Error: Report ID is missing</div>;
  }

  return (
    <div>
      <ViewReport reportId={reportId} userType='police' />    
    </div>
  )
}

export default PoliceViewReportPage