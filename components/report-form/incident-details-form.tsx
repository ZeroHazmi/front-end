"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock } from "lucide-react"
import GoogleMap from "@/components/GoogleMap"

interface IncidentDetailsFormProps {
  onNext: () => void
  onBack: () => void
  onChange?: (data: any) => void
}

export function IncidentDetailsForm({ onNext, onBack, onChange }: IncidentDetailsFormProps) {
  const [formData, setFormData] = useState({
    tempatKejadian: "",
    tarikh: "",
    masa: "",
    noLot: "",
    namaJalan: "",
    namaTaman: "",
    poskod: "",
    bandar: "",
    negeri: "",
    daerah: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with backend API to submit incident details
    onNext()
  }

  // Called when GoogleMap returns a selected location (lat/lng + geocode result)
  const handleLocationChange = (location: { lat: number; lng: number }, geocodeObject: google.maps.GeocoderResult) => {
    try {
      const components = geocodeObject.address_components || []

      const streetNumber = components.find((c) => c.types.includes('street_number'))?.long_name || ''
      const route = components.find((c) => c.types.includes('route'))?.long_name || ''
      const neighborhood = components.find((c) => c.types.includes('neighborhood') || c.types.includes('sublocality'))?.long_name || ''
      const postalCode = components.find((c) => c.types.includes('postal_code'))?.long_name || ''
      const city = components.find((c) => c.types.includes('locality'))?.long_name || ''
      const stateFromAPI = components.find((c) => c.types.includes('administrative_area_level_1'))?.long_name || ''

      setFormData((prev) => ({
        ...prev,
        noLot: streetNumber,
        namaJalan: route,
        namaTaman: neighborhood,
        poskod: postalCode,
        bandar: city,
        negeri: stateFromAPI,
      }))
      if (onChange) onChange({
        latitude: location.lat,
        longitude: location.lng,
        address: geocodeObject.formatted_address,
        state: stateFromAPI,
      })
    } catch (error) {
      console.error('Error parsing geocodeObject:', error)
    }
  }

  // helper to emit current address/date/time data to parent
  const emitChange = (override: any = {}) => {
    const composedAddress = `${formData.noLot ? formData.noLot + ', ' : ''}${formData.namaJalan ? formData.namaJalan + ', ' : ''}${formData.namaTaman ? formData.namaTaman + ', ' : ''}${formData.bandar ? formData.bandar + ', ' : ''}${formData.poskod ? formData.poskod + ', ' : ''}${formData.negeri ? formData.negeri : ''}`.replace(/,\s*$/, '')
    if (onChange) onChange({
      address: composedAddress,
      latitude: override.latitude ?? undefined,
      longitude: override.longitude ?? undefined,
      state: formData.negeri || override.state || '',
      date: formData.tarikh || override.date || '',
      time: formData.masa || override.time || '',
      ...override,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl">
      {/* Map Section */}
      <div className="mb-6">
        <GoogleMap onLocationChange={handleLocationChange} />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="tempatKejadian" className="text-sm font-normal text-[#1e40af]">
              Tempat Kejadian <span className="text-red-500">*</span> :
            </Label>
            <Select
              value={formData.tempatKejadian}
              onValueChange={(value) => setFormData({ ...formData, tempatKejadian: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sila Pilih..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Makmal">Makmal</SelectItem>
                <SelectItem value="Pejabat">Pejabat</SelectItem>
                <SelectItem value="Rumah">Rumah</SelectItem>
                <SelectItem value="Jalan Raya">Jalan Raya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-normal text-[#1e40af]">No.Lot / Bilik / Pejabat / Rumah / Bangunan :</Label>
            <Input
              value={formData.noLot}
              onChange={(e) => setFormData({ ...formData, noLot: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="namaJalan" className="text-sm font-normal text-[#1e40af]">
              Nama Jalan <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="namaJalan"
              value={formData.namaJalan}
              onChange={(e) => setFormData({ ...formData, namaJalan: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
          </div>

          <div>
            <Label htmlFor="namaTaman" className="text-sm font-normal text-[#1e40af]">
              Nama Taman / Tempat <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="namaTaman"
              value={formData.namaTaman}
              onChange={(e) => setFormData({ ...formData, namaTaman: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
          </div>

          <div>
            <Label htmlFor="poskod" className="text-sm font-normal text-[#1e40af]">
              Poskod <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="poskod"
              value={formData.poskod}
              onChange={(e) => setFormData({ ...formData, poskod: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
          </div>

          <div>
            <Label htmlFor="bandar" className="text-sm font-normal text-[#1e40af]">
              Bandar <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="bandar"
              value={formData.bandar}
              onChange={(e) => setFormData({ ...formData, bandar: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
          </div>

          <div>
            <Label htmlFor="negeri" className="text-sm font-normal text-[#1e40af]">
              Negeri <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="negeri"
              value={formData.negeri}
              onChange={(e) => setFormData({ ...formData, negeri: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-normal text-[#1e40af]">
              Tarikh <span className="text-red-500">*</span> :
            </Label>
            <div className="mt-1">
              <div className="relative">
                              <Input
                                type="date"
                                value={formData.tarikh}
                                onChange={(e) => { setFormData({ ...formData, tarikh: e.target.value }); emitChange({ date: e.target.value }) }}
                                required
                              />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-normal text-[#1e40af]">
              Masa <span className="text-red-500">*</span> :
            </Label>
            <div className="mt-1">
              <div className="relative">
                <Input
                  type="time"
                  value={formData.masa}
                  onChange={(e) => { setFormData({ ...formData, masa: e.target.value }); emitChange({ time: e.target.value }) }}
                  required
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* removed Balai / Kontinjen fields as requested */}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-red-500 text-sm">* Mandatori</p>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" onClick={onBack} variant="outline" className="px-8 py-2 bg-transparent">
          « Kembali
        </Button>
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          Seterusnya »
        </Button>
      </div>
    </form>
  )
}
