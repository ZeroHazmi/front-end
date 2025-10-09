"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ReportStepper } from "@/components/report-form/report-stepper"
import { PersonalDetailsForm } from "@/components/user/personal-details-form"
import { IncidentDetailsForm } from "@/components/report-form/incident-details-form"
import { IncidentDescriptionCarAccident } from "@/components/report-form/incident-description-car-accident"
import { IncidentDescriptionNaturalDisaster } from "@/components/report-form/incident-description-natural-disaster"
import { IncidentDescriptionLostItems } from "@/components/report-form/incident-description-lost-items"
import { ConfirmationForm } from "@/components/report-form/confirmation-form"
import { PrintReport } from "@/components/report-form/print-report"

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const params = useParams()
  const [aggregate, setAggregate] = useState<any>({})

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    (async () => {
      try {
        // Build payload matching the API route's expected ReportRequest
        // Build ReportCreateDto with nested ReportDetail
        const payload = {
          UserId: aggregate.userId || undefined,
          ReportTypeId: Number(params?.type) || 0,
          Status: aggregate.status || 'Open',
          Priority: aggregate.priority || 'Low',
          AppUserId: aggregate.appUserId || '',
          ReportDetail: {
            ReportTypeId: Number(params?.type) || 0,
            Date: aggregate.date || '',
            Time: aggregate.time || aggregate.masa || '',
            Address: aggregate.address || aggregate.placeName || '',
            Latitude: aggregate.latitude || aggregate.lat || 0,
            Longitude: aggregate.longitude || aggregate.lng || 0,
            State: aggregate.state || '',
            FieldValue: typeof aggregate.fieldValue === 'string' ? aggregate.fieldValue : JSON.stringify(aggregate.fieldValue || {}),
            Audio: aggregate.audio || '',
            Image: aggregate.image || '',
            Transcript: aggregate.transcript || aggregate.reportContent || '',
          },
        }

        console.log('[v0] Submitting payload', payload)

        const res = await fetch('/api/create-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown' }))
          console.error('Create report failed', err)
          return
        }

        setCurrentStep(5)
      } catch (err) {
        console.error('Error submitting report', err)
      }
    })()
  }

  const renderIncidentDescriptionForm = () => {
    const incidentType = (params as any)?.type

    if (incidentType === "kemalangan-jalan-raya") {
      return <IncidentDescriptionCarAccident onNext={handleNextStep} onBack={handlePrevStep} onChange={(d) => setAggregate((s:any)=>({...s,...d}))} />
    } else if (incidentType === "bencana-alam") {
      return <IncidentDescriptionNaturalDisaster onNext={handleNextStep} onBack={handlePrevStep} onChange={(d) => setAggregate((s:any)=>({...s,...d}))} />
    } else if (incidentType === "hilang") {
      return <IncidentDescriptionLostItems onNext={handleNextStep} onBack={handlePrevStep} onChange={(d) => setAggregate((s:any)=>({...s,...d}))} />
    }

    // Default fallback to car accident form
    return <IncidentDescriptionCarAccident onNext={handleNextStep} onBack={handlePrevStep} />
  }

  const incidentType = (params as any)?.type ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ReportStepper currentStep={currentStep} />
        <main className="flex-1 p-8">
          {currentStep === 1 && <PersonalDetailsForm incidentType={incidentType} onNext={handleNextStep} onChange={(d:any)=>setAggregate((s:any)=>({...s,...d}))} />}
          {currentStep === 2 && <IncidentDetailsForm onNext={handleNextStep} onBack={handlePrevStep} onChange={(d:any)=>setAggregate((s:any)=>({...s,...d}))} />}
          {currentStep === 3 && renderIncidentDescriptionForm()}
          {currentStep === 4 && <ConfirmationForm onBack={handlePrevStep} onSubmit={handleSubmit} data={aggregate} />}
          {currentStep === 5 && <PrintReport />}
        </main>
      </div>
    </div>
  )
}
