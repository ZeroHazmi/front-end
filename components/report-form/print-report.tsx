"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintReportProps {
  reportNumber?: string
}

export function PrintReport({ reportNumber }: PrintReportProps) {
  const displayReportNumber = reportNumber || "Menunggu pengesahan..."

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Printer Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#1a237e] rounded-full flex items-center justify-center mb-4">
          <Printer className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a237e] mb-2">Cetak Repot</h1>
        <p className="text-gray-600 text-center">Cetak laporan anda untuk simpanan.</p>
      </div>

      {/* Success Message */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <p className="text-center text-lg font-semibold text-green-700 mb-2">
          Laporan trafik anda telah berjaya dihantar dan sedang diproses.
        </p>
        <p className="text-center text-gray-600">Terima ini hanyalah untuk simpanan peribadi.</p>
      </div>

      {/* Report Number Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1a237e] mb-4">No Repot Polis: {displayReportNumber}</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Sila rujuk balai polis yang berkenaan sekiranya terdapat sebarang pertanyaan atau urusan repot polis yang dibuat.
        </p>
      </div>
    </div>
  )
}

