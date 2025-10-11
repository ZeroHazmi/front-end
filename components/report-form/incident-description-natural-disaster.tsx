"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from '@/contexts/LanguageContext'
import Recorder from '@/components/Recorder'
import reportPersister from '@/lib/reportPersister'

interface IncidentDescriptionNaturalDisasterProps {
  onNext: () => void
  onBack: () => void
  onChange?: (data: any) => void
  data?: any
}

export function IncidentDescriptionNaturalDisaster({ onNext, onBack, onChange, data }: IncidentDescriptionNaturalDisasterProps) {
  const { t } = useLanguage()
  const [naturalDisasterType, setNaturalDisasterType] = useState("")
  const [description, setDescription] = useState("")

  // called when inline recorder returns a transcript
  const handleTranscript = (text: string) => {
    const newDesc = description ? `${description}\n${text}` : text
    setDescription(newDesc)
    try { reportPersister.setAggregatePatch({ keterangan: newDesc }) } catch (e) {}
    if (onChange) onChange({ reportContent: newDesc, fieldValue: JSON.stringify({ disasterType: naturalDisasterType }), transcript: newDesc })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onChange) onChange({ reportContent: description, fieldValue: JSON.stringify({ disasterType: naturalDisasterType }) })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-xs font-bold">
            3
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">{t.step_title_description}</h2>
          <p className="text-sm text-[#3b82f6]">{t.step_desc_description}</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#1e40af]">{t.date.label}:</span> {data?.date || data?.tarikh || '-'}
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">{t.time.label}:</span> {data?.time || data?.masa || '-'}
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">{t.placeName?.label || 'Place'}:</span> {data?.tempat || data?.tempatKejadian || '-'}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">{t.address || 'Address'}:</span> {data?.address || '-'}
          </div>
        </div>
      </div>

      {/* Register Equipment Button */}
      <div className="mb-6">
        <Button type="button" className="bg-green-600 hover:bg-green-700 text-white">
          Register equipment affected by the natural disaster
        </Button>
      </div>

      {/* Natural Disaster Type Selection */}
      <div className="mb-6">
        <Label htmlFor="naturalDisasterType" className="text-sm font-semibold text-[#1e3a8a]">
          Select Natural Disaster Type
        </Label>
            <Select value={naturalDisasterType} onValueChange={(v) => { setNaturalDisasterType(v); if (onChange) onChange({ naturalDisasterType: v, description }) }}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={t.selectState || 'Please select...'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flood">Flood</SelectItem>
            <SelectItem value="landslide">Landslide</SelectItem>
            <SelectItem value="storm">Storm</SelectItem>
            <SelectItem value="tsunami">Tsunami</SelectItem>
            <SelectItem value="earthquake">Earthquake</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description Text Area */}
      <div className="mb-6">
          <Textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); if (onChange) onChange({ naturalDisasterType, description: e.target.value }) }}
          className="min-h-[300px] text-sm"
          placeholder="Describe the natural disaster in detail..."
          required
        />

        {/* Inline recorder in the top-right of the textarea */}
        <div className="absolute top-3 right-3">
          <Recorder uploadAudio={() => { /* no-op for inline */ }} inline onTranscript={handleTranscript} />
        </div>
      </div>

      {/* Mandatory Note */}
      <div className="mb-6">
        <p className="text-red-500 text-sm">{t.required}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" onClick={onBack} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          {t.back}
        </Button>
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          {t.next}
        </Button>
      </div>
    </form>
  )
}
