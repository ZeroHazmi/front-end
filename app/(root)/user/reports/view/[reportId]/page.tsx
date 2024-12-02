'use client'

import ViewReport from '@/components/ViewReport'
import { useParams } from 'next/navigation';
import React from 'react'

const UserViewReportPage = () => {
  const params = useParams();
  const reportId = Array.isArray(params.reportId) ? params.reportId[0] : params.reportId;
  
  return (
    <div>
        <ViewReport reportId={reportId} userType='user' /> 
    </div>
  )
}

export default UserViewReportPage
