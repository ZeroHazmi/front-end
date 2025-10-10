"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { ReportStepper } from "@/components/report-form/report-stepper"
import { DashboardHeader } from '@/components/header/dashboard-header'
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

  // persist aggregate to session so going back/forward keeps data
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('report_draft_aggregate')
      if (raw) setAggregate(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try { sessionStorage.setItem('report_draft_aggregate', JSON.stringify(aggregate)) } catch (e) {}
  }, [aggregate])

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // stable handler to merge partial changes into aggregate
  const handleAggregateChange = useCallback((d: any) => {
    setAggregate((s: any) => ({ ...s, ...d }))
  }, [])

  const handleSubmit = () => {
    (async () => {
      try {
        // Build payload matching the API route's expected ReportRequest
        // Build ReportCreateDto with nested ReportDetail
        // Build FieldValue object merging vehicle, plate and any existing fieldValue
        const fvObj = typeof aggregate.fieldValue === 'string' ? JSON.parse(aggregate.fieldValue || '{}') : (aggregate.fieldValue || {})
        const mergedFieldValue = {
          ...fvObj,
          plateNumber: aggregate.plateNumber || fvObj.plateNumber || '',
          vehicle: fvObj.vehicle || (() => { try { return JSON.parse(aggregate.fieldValue || '{}').vehicle } catch(e){ return undefined } })(),
        }

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
            FieldValue: JSON.stringify(mergedFieldValue),
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
      return <IncidentDescriptionCarAccident data={aggregate} onNext={handleNextStep} onBack={handlePrevStep} onChange={handleAggregateChange} />
    } else if (incidentType === "bencana-alam") {
      return <IncidentDescriptionNaturalDisaster data={aggregate} onNext={handleNextStep} onBack={handlePrevStep} onChange={handleAggregateChange} />
    } else if (incidentType === "hilang") {
      return <IncidentDescriptionLostItems data={aggregate} onNext={handleNextStep} onBack={handlePrevStep} onChange={handleAggregateChange} />
    }

    // Default fallback to car accident form
    return <IncidentDescriptionCarAccident onNext={handleNextStep} onBack={handlePrevStep} />
  }

  const incidentType = (params as any)?.type ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex flex-col md:flex-row">
        <ReportStepper currentStep={currentStep} />
        <main className="flex-1 p-4 md:p-8">
          {currentStep === 1 && <PersonalDetailsForm incidentType={incidentType} onNext={handleNextStep} onChange={handleAggregateChange} />}
          {currentStep === 2 && <IncidentDetailsForm onNext={handleNextStep} onBack={handlePrevStep} onChange={handleAggregateChange} />}
          {currentStep === 3 && renderIncidentDescriptionForm()}
          {currentStep === 4 && <ConfirmationForm onBack={handlePrevStep} onSubmit={handleSubmit} data={aggregate} />}
          {currentStep === 5 && <PrintReport />}
        </main>
      </div>
    </div>
  )
}

