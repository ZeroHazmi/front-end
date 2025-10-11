"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import DashboardHeader from '@/components/header/dashboard-header'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info,
  Search,
} from "lucide-react"

interface Report {
  id: number
  reportNumber: string
  date: string
  status: string
}

import { useLanguage } from '@/contexts/LanguageContext'

export default function PrintReportPage() {
  const { t } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/reports')
        // const data = await response.json()
        // setReports(data)

        // For now, start with empty array until API is connected
        setReports([])
      } catch (error) {
        console.error("[v0] Error fetching reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = reports.filter((report) =>
    report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReports = filteredReports.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#1a2470] to-[#2a3480] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{t.reportRecords_title}</h1>
                  <p className="text-white/80 text-sm mt-1">{t.reportRecords_subtitle}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Info className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mt-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.search_report_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/95 border-white/20 focus:bg-white"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.table_no}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.table_report_no}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.table_report}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.table_pol316}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.table_attachments}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.table_actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {t.loading_reports}
                    </td>
                  </tr>
                ) : currentReports.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {t.no_reports_found}
                    </td>
                  </tr>
                ) : (
                  currentReports.map((report, index) => (
                    <tr key={report.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{report.reportNumber}</span>
                          <span className="text-xs text-gray-500 mt-1">{report.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <ImageIcon className="w-5 h-5" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm"
                        >
                          {t.mybayar_label}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {!isLoading && filteredReports.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pagination info */}
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}, Total Records: {filteredReports.length}
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="hover:bg-blue-50"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="hover:bg-blue-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => goToPage(pageNum)}
                        className={currentPage === pageNum ? "bg-[#1a2470] hover:bg-[#2a3480]" : "hover:bg-blue-50"}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="hover:bg-blue-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hover:bg-blue-50"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}