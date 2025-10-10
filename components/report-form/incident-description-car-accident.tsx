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
import Recorder from "@/components/Recorder"
import { setDraft, getDraft } from "@/lib/draftStorage"

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
      const draft = getDraft('aggregate')
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
      try { fv = typeof getDraft('aggregate')?.fieldValue === 'string' ? JSON.parse(getDraft('aggregate').fieldValue || '{}') : (getDraft('aggregate')?.fieldValue || {}) } catch(e) { fv = {} }
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
      const details = getDraft('incidentDetails') || {}
      // accept multiple possible key names (tarikh/date, masa/time, tempat/tempatKejadian)
      const lines: string[] = []
      const dDate = details.date || details.tarikh || details.tarikhFormatted || ''
      const dTime = details.time || details.masa || ''
      const dTempat = details.tempat || details.tempatKejadian || ''
      const dAddress = details.address || (details.namaJalan || details.namaTaman || details.noLot ? `${details.noLot ? details.noLot + ', ' : ''}${details.namaJalan ? details.namaJalan + ', ' : ''}${details.namaTaman ? details.namaTaman + ', ' : ''}${details.bandar ? details.bandar + ', ' : ''}${details.poskod ? details.poskod + ', ' : ''}${details.negeri ? details.negeri : ''}`.replace(/,\s*$/, '') : '')
      if (dDate) lines.push(`Tarikh: ${dDate}`)
      if (dTime) lines.push(`Masa: ${dTime}`)
      if (dTempat) lines.push(`Tempat: ${dTempat}`)
      if (dAddress) lines.push(`Lokasi: ${dAddress}`)
      const agg = getDraft('aggregate') || {}
      if (agg?.plateNumber) lines.push(`No Plat: ${agg.plateNumber}`)
      const block = lines.join('\n') + '\n\n'
      const newText = formData.keterangan ? `${formData.keterangan}\n${block}` : block
      setFormData((prev) => ({ ...prev, keterangan: newText }))
      try { setDraft('aggregate', { ...getDraft('aggregate'), keterangan: newText }) } catch(e) {}
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
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Keterangan Kejadian</h2>
          <p className="text-sm text-[#3b82f6]">Terangkan apa yang berlaku.</p>
        </div>
      </div>

      {/* Summary Box — show values from Butiran Kejadian when available */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-[#1e40af]">Tarikh:</span> {dateDisplay || '-'}
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">Masa:</span> {timeDisplay || '-'}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">Tempat:</span> {tempatDisplay || '-'}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">Lokasi Kemalangan:</span> {lokasiDisplay || '-'}
          </div>
          {/* Butir-Butir Kenderaan removed — Plate Number input follows below */}
        </div>
      </div>

      {/* Plate number input (persisted) */}
      <div className="mb-6">
        <Label htmlFor="plateNumber" className="text-sm font-normal text-[#1e40af]">
          No. Plat Kenderaan <span className="text-red-500">*</span> :
        </Label>
        <Input
          id="plateNumber"
            value={formData.plateNumber}
            onChange={(e) => {
              const v = e.target.value.toUpperCase()
              setFormData({ ...formData, plateNumber: v })
              try { setDraft('aggregate', { ...getDraft('aggregate'), plateNumber: v }) } catch (err) {}
              if (onChange) onChange({ plateNumber: v })
            }}
          className="mt-1"
            placeholder="Contoh: WAW1234"
          required
        />
          <p className="text-xs text-gray-500 mt-1">Sila masukkan nombor plat tanpa ruang, huruf akan ditukar kepada HURUF BESAR.</p>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <Label htmlFor="jenisKenderaan" className="text-sm font-normal">
            Jenis Kenderaan <span className="text-red-500">*</span> :
          </Label>
          <Select
            value={formData.jenisKenderaan}
            onValueChange={(value) => setFormData({ ...formData, jenisKenderaan: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Motosikal/Wagen">Motosikal/Wagen</SelectItem>
              <SelectItem value="Kereta">Kereta</SelectItem>
              <SelectItem value="Lori">Lori</SelectItem>
              <SelectItem value="Bas">Bas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="jenamaKenderaan" className="text-sm font-normal">
            Jenama Kenderaan <span className="text-red-500">*</span> :
          </Label>
          <Select
            value={formData.jenamaKenderaan}
            onValueChange={(value) => setFormData({ ...formData, jenamaKenderaan: value })}
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
            Model Kenderaan <span className="text-red-500">*</span> :
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
          <Label className="text-sm font-semibold">Punca Kejadian</Label>
          <div className="mt-2">
            <Label htmlFor="puncaKejadian" className="text-sm font-normal">
              Punca / Sebab <span className="text-red-500">*</span> :
            </Label>
            <Select
              value={formData.puncaKejadian}
              onValueChange={(value) => setFormData({ ...formData, puncaKejadian: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elak/Langgar Objek/Binatang">Elak/Langgar Objek/Binatang</SelectItem>
                <SelectItem value="Kelajuan Tinggi">Kelajuan Tinggi</SelectItem>
                <SelectItem value="Cuaca Buruk">Cuaca Buruk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* langgar binatang / khinzir fields removed as requested */}
        </div>

        <div>
          <Label className="text-sm font-semibold">Maklumat Kerosakan</Label>
          <div className="mt-2">
            <Label className="text-sm font-normal">
              Bahagian Kerosakan <span className="text-red-500">*</span> :
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
                    {key === "depan" && "Depan"}
                    {key === "belakang" && "Belakang"}
                    {key === "kiri" && "Kiri"}
                    {key === "kanan" && "Kanan"}
                    {key === "atas" && "Atas"}
                    {key === "bawah" && "Bawah"}
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
            try { setDraft('aggregate', { ...getDraft('aggregate'), keterangan: v }) } catch (err) {}
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
              try { setDraft('aggregate', { ...getDraft('aggregate'), keterangan: newText }) } catch (err) {}
              if (onChange) onChange({ reportContent: newText, transcript: newText })
            }}
          />
        </div>
      </div>

      {/* Selection Options - removed 'PILIHAN OLEH PENGADU' radio per request */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold mb-2">BERSAMA INI SAYA MELAMPIRKAN:</p>
        <ol className="text-sm space-y-1 ml-4">
          <li>1. Butir-Butir Kejadian</li>
          <li>2. Keterangan</li>
        </ol>
      </div>

      {/* Mandatory Note */}
      <div className="mb-4">
        <p className="text-red-500 text-sm">* Mandatori</p>
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
          Saya berakujanji dan membenarkan pihak-pihak berkaitan menerima laporan ini sebagai salah satu dokumen lengkap
          bagi tujuan tuntutan insurans.
        </label>
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
