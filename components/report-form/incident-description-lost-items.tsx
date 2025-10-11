"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Recorder from "@/components/Recorder"
import reportPersister from '@/lib/reportPersister'
import { useLanguage } from '@/contexts/LanguageContext'

interface IncidentDescriptionLostItemsProps {
  onNext: () => void
  onBack: () => void
  onChange?: (data: any) => void
  data?: any
}

export function IncidentDescriptionLostItems({ onNext, onBack, onChange, data }: IncidentDescriptionLostItemsProps) {
  const { t } = useLanguage()
  const [itemDescription, setItemDescription] = useState("")
  const [description, setDescription] = useState("")

  // called when inline recorder returns a transcript
  const handleTranscript = (text: string) => {
    const newDesc = description ? `${description}\n${text}` : text
    setDescription(newDesc)
    try { reportPersister.setAggregatePatch({ keterangan: newDesc }) } catch (e) {}
    if (onChange) onChange({ reportContent: newDesc, fieldValue: JSON.stringify({ item: itemDescription || "", value: "lost" }), transcript: newDesc })
  }

  // notify parent when item description changes
  const handleItemChange = (value: string) => {
    setItemDescription(value)
    if (onChange) onChange({ reportContent: description, fieldValue: JSON.stringify({ item: value, value: "lost" }) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

      {/* Item Description */}
      <div className="mb-6">
        <Label htmlFor="itemDescription" className="text-sm font-semibold text-[#1e3a8a]">
          Lost Item <span className="text-red-500">*</span>
        </Label>
        <Input
          id="itemDescription"
          value={itemDescription}
          onChange={(e) => handleItemChange(e.target.value)}
          className="mt-2"
          placeholder="e.g. Black leather wallet, Samsung phone..."
          required
        />
      </div>

      {/* Description Text Area */}
      <div className="mb-6">
        <Label htmlFor="description" className="text-sm font-semibold text-[#1e3a8a]">
          Incident Description <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (onChange) onChange({ itemDescription, reportContent: e.target.value }) }}
            className="min-h-[300px] text-sm mt-2"
            placeholder="Describe the loss in detail..."
            required
          />

          {/* Discreet inline microphone button in the top-right of the textarea */}
          <div className="absolute top-3 right-3">
            <Recorder
              uploadAudio={() => { /* default no-op for inline UI - Recorder still uploads via the form in parent pages */ }}
              inline
              onTranscript={handleTranscript}
            />
          </div>
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

export default IncidentDescriptionLostItems

