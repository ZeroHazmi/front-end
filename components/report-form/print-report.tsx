"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintReportProps {
  reportNumber?: string
}

export function PrintReport({ reportNumber }: PrintReportProps) {
  const displayReportNumber = reportNumber || "Pending confirmation..."

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Printer Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#1a237e] rounded-full flex items-center justify-center mb-4">
          <Printer className="w-8 h-8 text-white" />
        </div>
  <h1 className="text-2xl font-bold text-[#1a237e] mb-2">Print Report</h1>
  <p className="text-gray-600 text-center">Print your report for your records.</p>
      </div>

      {/* Success Message */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <p className="text-center text-lg font-semibold text-green-700 mb-2">
          Your traffic report has been submitted successfully and is being processed.
        </p>
        <p className="text-center text-gray-600">This receipt is for your personal records only.</p>
      </div>

      {/* Report Number Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1a237e] mb-4">Police Report No: {displayReportNumber}</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Please refer to the relevant police station for any enquiries or actions regarding this police report.
        </p>
      </div>
    </div>
  )
}

