'use client';

import SubmitReportPage from '@/components/ReportSubmissionPage';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

const PoliceReportTypePage = () => {
  const pathname = usePathname(); // Get the current path
  const searchParams = useSearchParams(); // Get query params

  // Extract reportType from the pathname
  const pathSegments = pathname.split('/');
  const reportType = pathSegments[pathSegments.length - 1]; // Assuming the reportType is the last segment

  // Extract userId from the search params
  const userId = searchParams.get('userId') || undefined;
  console.log("UserId:", userId);

  return (
    <div>
      <SubmitReportPage userId={userId} userAccess='police'/>
    </div>
  );
};

export default PoliceReportTypePage;
