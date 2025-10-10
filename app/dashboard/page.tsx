"use client"

import CreateNewReport from '@/components/CreateNewReport'
import { DashboardHeader } from '@/components/header/dashboard-header'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import { FileTextIcon, Zap, AlertTriangle, Mic } from 'lucide-react'

export default function DashboardLanding() {
  const { t } = useLanguage()

  const reportTypes = [
    { title: 'Car Accidents', desc: 'Report traffic collisions and vehicle incidents', slug: 'kemalangan-jalan-raya', icon: FileTextIcon },
    { title: 'Natural Disasters', desc: 'Report floods, storms, landslides and other natural events', slug: 'bencana-alam', icon: Zap },
    { title: 'Lost Items', desc: 'Report lost or missing personal items', slug: 'hilang', icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex justify-center items-center font-bold text-5xl text-center my-8">
        <h1>{t?.reportingSubmission || 'Reporting Submission'}</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Start a Report</h2>
          <p className="text-sm text-gray-600">Use the quick-create card to file a freeform report, or choose a guided report type below.</p>
        </header>

        <section className="mb-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Create a New Report</h3>
          <p className="text-sm text-gray-500 mb-4">The following features will be available when you start your report</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 border rounded">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded">
                  <FileTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Text Report</div>
                  <div className="text-sm text-gray-500">Type your report using our guided form</div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded">
                  <Mic className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Voice Report</div>
                  <div className="text-sm text-gray-500">Use speech-to-text to dictate your report</div>
                </div>
              </div>
            </div>
          </div>

          {/* Start button removed - selection is via the three report type cards below */}
        </section>

        <p className="text-center text-gray-600 mb-8">Select a report type to start a guided report.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {reportTypes.map((rt) => {
            const Icon = rt.icon
            return (
              <Link key={rt.slug} href={`/dashboard/report/${rt.slug}`} className="block">
                <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-md">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{rt.title}</h3>
                      <p className="text-sm text-gray-500">{rt.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        
      </div>
    </div>
  )
}
