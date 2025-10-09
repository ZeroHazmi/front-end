"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface IncidentDescriptionNaturalDisasterProps {
  onNext: () => void
  onBack: () => void
  onChange?: (data: any) => void
}

export function IncidentDescriptionNaturalDisaster({ onNext, onBack, onChange }: IncidentDescriptionNaturalDisasterProps) {
  const [naturalDisasterType, setNaturalDisasterType] = useState("")
  const [description, setDescription] = useState("")

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
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Keterangan Kejadian</h2>
          <p className="text-sm text-[#3b82f6]">Terangkan apa yang berlaku.</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#1e40af]">Tarikh:</span> 06/10/2025
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">Masa:</span> 1050hrs
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">Tempat:</span> Luar Bangunan
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">Alamat:</span> JALAN UTEM, UTEM, 76100, MALACCA
          </div>
        </div>
      </div>

      {/* Register Equipment Button */}
      <div className="mb-6">
        <Button type="button" className="bg-green-600 hover:bg-green-700 text-white">
          Daftar Peralatan Akibat Bencana Alam
        </Button>
      </div>

      {/* Natural Disaster Type Selection */}
      <div className="mb-6">
        <Label htmlFor="naturalDisasterType" className="text-sm font-semibold text-[#1e3a8a]">
          Pilihan Jenis Bencana Alam
        </Label>
  <Select value={naturalDisasterType} onValueChange={(v) => { setNaturalDisasterType(v); if (onChange) onChange({ naturalDisasterType: v, description }) }}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Sila Pilih..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banjir">Banjir</SelectItem>
            <SelectItem value="tanah-runtuh">Tanah Runtuh</SelectItem>
            <SelectItem value="ribut">Ribut</SelectItem>
            <SelectItem value="tsunami">Tsunami</SelectItem>
            <SelectItem value="gempa-bumi">Gempa Bumi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description Text Area */}
      <div className="mb-6">
        <Textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); if (onChange) onChange({ naturalDisasterType, description: e.target.value }) }}
          className="min-h-[300px] text-sm"
          placeholder="Terangkan dengan terperinci mengenai bencana alam yang berlaku..."
          required
        />
      </div>

      {/* Mandatory Note */}
      <div className="mb-6">
        <p className="text-red-500 text-sm">* Mandatori</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" onClick={onBack} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          « Kembali
        </Button>
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          Seterusnya »
        </Button>
      </div>
    </form>
  )
}
