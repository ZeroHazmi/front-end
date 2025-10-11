"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Info } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'
import Recorder from "@/components/Recorder"
import { setDraft, getDraft } from "@/lib/draftStorage"
import reportPersister from '@/lib/reportPersister'

interface IncidentDescriptionCarAccidentProps {
  onNext: () => void
  onBack: () => void
  onChange?: (data: any) => void
  data?: any
}

interface UploadedImage {
  id: string
  url: string
  type: string
}

export function IncidentDescriptionCarAccident({ onNext, onBack, onChange, data }: IncidentDescriptionCarAccidentProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    jenisKenderaan: "",
    jenamaKenderaan: "",
    modelKenderaan: "",
    puncaKejadian: "",
    bahagianKerosakan: {
      depan: false,
      belakang: false,
      kiri: false,
      kanan: false,
      atas: false,
      bawah: false,
    },
    keterangan: '',
    agreement: false,
    plateNumber: '',
  })

  useEffect(() => {
    try {
      const draft = reportPersister.getAggregate()
      if (draft) {
        setFormData((prev) => ({ ...prev, ...draft }))
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // Summary values — prefer parent-provided `data` (emitted from IncidentDetailsForm) then fallback to local defaults
  const dateDisplay = data?.date || data?.tarikh || ''
  const timeDisplay = data?.time || data?.masa || ''
  const tempatDisplayRaw = data?.tempat || data?.tempatKejadian || data?.placeName || ''
  const lokasiDisplayRaw = data?.address || ''

  const titleCase = (s: string) => {
    if (!s) return ''
    return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const tempatDisplay = titleCase(String(tempatDisplayRaw))
  const lokasiDisplay = titleCase(String(lokasiDisplayRaw))

  

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Emit description and vehicle details only (no images)
    if (onChange) {
      // merge existing fieldValue draft if present
      let fv = {}
      try { const agg = reportPersister.getAggregate(); fv = typeof agg?.fieldValue === 'string' ? JSON.parse(agg.fieldValue || '{}') : (agg?.fieldValue || {}) } catch(e) { fv = {} }
      fv = { ...fv, vehicle: formData.jenisKenderaan, brand: formData.jenamaKenderaan, model: formData.modelKenderaan, plateNumber: formData.plateNumber }
      onChange({
        reportContent: formData.keterangan,
        fieldValue: JSON.stringify(fv),
      })
    }
    onNext()
  }

  const insertDetailsIntoTextarea = () => {
    try {
      const details = reportPersister.getDetails?.() || getDraft('incidentDetails') || {}
      // accept multiple possible key names (tarikh/date, masa/time, tempat/tempatKejadian)
      const lines: string[] = []
      const dDate = details.date || details.tarikh || details.tarikhFormatted || ''
      const dTime = details.time || details.masa || ''
      const dTempat = details.tempat || details.tempatKejadian || ''
      const dAddress = details.address || (details.namaJalan || details.namaTaman || details.noLot ? `${details.noLot ? details.noLot + ', ' : ''}${details.namaJalan ? details.namaJalan + ', ' : ''}${details.namaTaman ? details.namaTaman + ', ' : ''}${details.bandar ? details.bandar + ', ' : ''}${details.poskod ? details.poskod + ', ' : ''}${details.negeri ? details.negeri : ''}`.replace(/,\s*$/, '') : '')
  if (dDate) lines.push(`Date: ${dDate}`)
  if (dTime) lines.push(`Time: ${dTime}`)
  if (dTempat) lines.push(`Place: ${dTempat}`)
  if (dAddress) lines.push(`Location: ${dAddress}`)
  const agg = reportPersister.getAggregate() || {}
  if (agg?.plateNumber) lines.push(`Plate Number: ${agg.plateNumber}`)
      const block = lines.join('\n') + '\n\n'
      const newText = formData.keterangan ? `${formData.keterangan}\n${block}` : block
      setFormData((prev) => ({ ...prev, keterangan: newText }))
      try { reportPersister.setAggregatePatch({ keterangan: newText }) } catch(e) {}
      if (onChange) onChange({ reportContent: newText })
    } catch (e) {
      // ignore
    }
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

      {/* Summary Box — show values from Butiran Kejadian when available */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#1e40af]">{t.date.label}:</span> {dateDisplay || '-'}
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">{t.time.label}:</span> {timeDisplay || '-'}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">{t.placeName?.label || 'Place'}:</span> {tempatDisplay || '-'}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">{t.locationOfIncident || 'Accident Location'}:</span> {lokasiDisplay || '-'}
          </div>
          {/* Butir-Butir Kenderaan removed — Plate Number input follows below */}
        </div>
      </div>

      {/* Plate number input (persisted) */}
      <div className="mb-6">
        <Label htmlFor="plateNumber" className="text-sm font-normal text-[#1e40af]">
          {t.plateNumberLabel} <span className="text-red-500">*</span> :
        </Label>
        <Input
          id="plateNumber"
            value={formData.plateNumber}
            onChange={(e) => {
              const v = e.target.value.toUpperCase()
              setFormData({ ...formData, plateNumber: v })
              try { reportPersister.setAggregatePatch({ plateNumber: v }) } catch (err) {}
              if (onChange) onChange({ plateNumber: v })
            }}
          className="mt-1"
            placeholder={t.plateNumberPlaceholder}
          required
        />
          <p className="text-xs text-gray-500 mt-1">{t.plateNumberHelp}</p>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <Label htmlFor="jenisKenderaan" className="text-sm font-normal">
            {t.vehicleTypeLabel} <span className="text-red-500">*</span> :
          </Label>
          <Select
            value={formData.jenisKenderaan}
            onValueChange={(value) => setFormData({ ...formData, jenisKenderaan: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              <SelectItem value="Car">Car</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Bus">Bus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="jenamaKenderaan" className="text-sm font-normal">
            {t.vehicleBrandLabel} <span className="text-red-500">*</span> :
          </Label>
          <Select
            value={formData.jenamaKenderaan}
            onValueChange={(value) => { setFormData({ ...formData, jenamaKenderaan: value }); try { reportPersister.setAggregatePatch({ brand: value }) } catch {} }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HONDA">HONDA</SelectItem>
                <SelectItem value="TOYOTA">TOYOTA</SelectItem>
                <SelectItem value="PERODUA">PERODUA</SelectItem>
                <SelectItem value="PROTON">PROTON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="modelKenderaan" className="text-sm font-normal">
            {t.vehicleModelLabel} <span className="text-red-500">*</span> :
          </Label>
          <Input
            id="modelKenderaan"
            value={formData.modelKenderaan}
            onChange={(e) => setFormData({ ...formData, modelKenderaan: e.target.value })}
            className="mt-1"
            required
          />
        </div>
      </div>

      {/* Cause and Damage Information */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-sm font-semibold">{t.causeOfIncidentLabel}</Label>
          <div className="mt-2">
            <Label htmlFor="puncaKejadian" className="text-sm font-normal">
              {t.causeOfIncidentLabel} <span className="text-red-500">*</span> :
            </Label>
            <Select
              value={formData.puncaKejadian}
              onValueChange={(value) => setFormData({ ...formData, puncaKejadian: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="collision-object-animal">Collision with object / animal</SelectItem>
                  <SelectItem value="high-speed">High speed</SelectItem>
                  <SelectItem value="bad-weather">Bad weather</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* langgar binatang / khinzir fields removed as requested */}
        </div>

        <div>
          <Label className="text-sm font-semibold">{t.damageInfoLabel}</Label>
          <div className="mt-2">
            <Label className="text-sm font-normal">
              {t.partsLabel} <span className="text-red-500">*</span> :
            </Label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {Object.entries(formData.bahagianKerosakan).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        bahagianKerosakan: {
                          ...formData.bahagianKerosakan,
                          [key]: checked as boolean,
                        },
                      })
                    }
                  />
                  <label htmlFor={key} className="text-sm capitalize cursor-pointer">
                    {key === "depan" && "Front"}
                    {key === "belakang" && "Rear"}
                    {key === "kiri" && "Left"}
                    {key === "kanan" && "Right"}
                    {key === "atas" && "Top"}
                    {key === "bawah" && "Bottom"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image upload sections removed per request */}

      {/* Description Text Area with inline recorder */}
      <div className="mb-6 relative">
        <Textarea
          value={formData.keterangan}
            onChange={(e) => {
            const v = e.target.value
            setFormData({ ...formData, keterangan: v })
            try { reportPersister.setAggregatePatch({ keterangan: v }) } catch (err) {}
            if (onChange) onChange({ reportContent: v })
          }}
          className="min-h-[200px] text-sm"
          required
        />

        <div className="absolute top-3 right-3">
          <Recorder
            uploadAudio={() => {}}
            inline
            onTranscript={(text: string) => {
              const newText = formData.keterangan ? `${formData.keterangan}\n${text}` : text
              setFormData((prev) => ({ ...prev, keterangan: newText }))
              try { reportPersister.setAggregatePatch({ keterangan: newText }) } catch (err) {}
              if (onChange) onChange({ reportContent: newText, transcript: newText })
            }}
          />
        </div>
      </div>

      {/* Selection Options - removed 'PILIHAN OLEH PENGADU' radio per request */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold mb-2">I HEREBY ATTACH THE FOLLOWING:</p>
        <ol className="text-sm space-y-1 ml-4">
          <li>1. Incident Details</li>
          <li>2. Description</li>
        </ol>
      </div>

      {/* Mandatory Note */}
      <div className="mb-4">
        <p className="text-red-500 text-sm">{t.required}</p>
      </div>

      {/* Info Box removed as requested */}

      {/* Agreement Checkbox */}
      <div className="mb-6 flex items-start space-x-2">
        <Checkbox
          id="agreement"
          checked={formData.agreement}
          onCheckedChange={(checked) => setFormData({ ...formData, agreement: checked as boolean })}
          required
        />
        <label htmlFor="agreement" className="text-sm cursor-pointer">
          {t.agreementInsurance}
        </label>
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
