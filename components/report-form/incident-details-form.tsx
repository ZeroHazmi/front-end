"use client"

import React, { useState } from "react"
import { setDraft, getDraft } from '@/lib/draftStorage'
import reportPersister from '@/lib/reportPersister'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'
import { states } from '@/types/constants'

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { t } = useLanguage()

  // restore per-step draft on mount
  React.useEffect(() => {
    try {
      const draft = getDraft('incidentDetails')
      if (draft) {
        setFormData((prev) => ({ ...prev, ...draft }))
        setErrors({})
        if (onChange) onChange(draft)
      } else {
        // if no per-step draft, try restoring from aggregate (when user returned via parent aggregate)
        const agg = reportPersister.getAggregate()
        if (agg) {
          const fallback = {
            tempatKejadian: agg.tempat || agg.tempatKejadian || '',
            tarikh: agg.date || agg.tarikh || '',
            masa: agg.time || agg.masa || '',
            noLot: agg.noLot || '',
            namaJalan: agg.namaJalan || (agg.address || '').split(',')[0] || '',
            namaTaman: agg.namaTaman || '',
            poskod: agg.poskod || '',
            bandar: agg.bandar || agg.city || '',
            negeri: agg.state || agg.negeri || '',
            daerah: agg.daerah || '',
          }
          setFormData((prev) => ({ ...prev, ...fallback }))
          if (onChange) onChange(fallback)
        }
      }
    } catch (e) {}

  }, [onChange])

  // keep a ref to the latest formData so the unmount handler can persist it without
  // adding formData to the dependencies of the restore effect above.
  const formDataRef = React.useRef(formData)
  React.useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  React.useEffect(() => {
    return () => {
      try { setDraft('incidentDetails', formDataRef.current) } catch (e) {}
    }
  }, [])

  // helper to persist and emit
  const updateField = (patch: Partial<typeof formData>) => {
    const next = { ...formData, ...patch }
    setFormData(next)
    try { setDraft('incidentDetails', next) } catch (e) {}
  }

  // Notify parent when formData changes (useEffect to avoid setState-in-render)
  React.useEffect(() => {
    // Compose address and notify parent to avoid setState-in-render
    const composedAddress = `${formData.noLot ? formData.noLot + ', ' : ''}${formData.namaJalan ? formData.namaJalan + ', ' : ''}${formData.namaTaman ? formData.namaTaman + ', ' : ''}${formData.bandar ? formData.bandar + ', ' : ''}${formData.poskod ? formData.poskod + ', ' : ''}${formData.negeri ? formData.negeri : ''}`.replace(/,\s*$/, '')
    if (onChange) onChange({
      tempat: formData.tempatKejadian,
      address: composedAddress,
      latitude: undefined,
      longitude: undefined,
      state: formData.negeri || '',
      date: formData.tarikh || '',
      time: formData.masa || '',
    })
  }, [formData, onChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Basic client-side validation for required fields
  const newErrors: Record<string, string> = {}
  if (!formData.namaJalan || String(formData.namaJalan).trim() === '') newErrors.namaJalan = 'Please enter the street name.'
  if (!formData.poskod || String(formData.poskod).trim() === '') newErrors.poskod = 'Please enter the postcode.'
  if (!formData.bandar || String(formData.bandar).trim() === '') newErrors.bandar = 'Please enter the city.'
  if (!formData.negeri || String(formData.negeri).trim() === '') newErrors.negeri = 'Please select a state.'
  if (!formData.tarikh || String(formData.tarikh).trim() === '') newErrors.tarikh = 'Please select a date.'
  if (!formData.masa || String(formData.masa).trim() === '') newErrors.masa = 'Please select a time.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // persist current draft before early-return so user data isn't lost
      try { setDraft('incidentDetails', formData) } catch (e) {}
      return
    }

    // persist and emit latest values then proceed
    try { setDraft('incidentDetails', formData) } catch (e) {}
    emitChange()
    setErrors({})
    onNext()
  }

  // Map location selection removed — keep manual address fields instead
  const handleLocationChange = (_location: any, _geocodeObject: any) => {
    // noop — map removed; address fields are entered manually below
  }

  // helper to emit current address/date/time data to parent
  const emitChange = (override: any = {}) => {
    const composedAddress = `${formData.noLot ? formData.noLot + ', ' : ''}${formData.namaJalan ? formData.namaJalan + ', ' : ''}${formData.namaTaman ? formData.namaTaman + ', ' : ''}${formData.bandar ? formData.bandar + ', ' : ''}${formData.poskod ? formData.poskod + ', ' : ''}${formData.negeri ? formData.negeri : ''}`.replace(/,\s*$/, '')
    const emitted = {
      tempat: formData.tempatKejadian,
      address: composedAddress,
      latitude: override.latitude ?? undefined,
      longitude: override.longitude ?? undefined,
      state: formData.negeri || override.state || '',
      date: formData.tarikh || override.date || '',
      time: formData.masa || override.time || '',
      ...override,
    }
    if (onChange) onChange(emitted)
    // Also update aggregate so final submission can pick up these details if map was removed
    try { reportPersister.setAggregatePatch({
      tempat: emitted.tempat,
      address: emitted.address,
      date: emitted.date,
      time: emitted.time,
      state: emitted.state,
      noLot: formData.noLot,
      namaJalan: formData.namaJalan,
      namaTaman: formData.namaTaman,
      poskod: formData.poskod,
      bandar: formData.bandar,
      negeri: formData.negeri,
      daerah: formData.daerah,
    }) } catch (e) {}
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl">
      {/* Map removed — users may enter the address manually */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">Please enter the address and postcode manually in the fields below.</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="tempatKejadian" className="text-sm font-normal text-[#1e40af]">
              {t.placeName?.label || 'Place of Incident'}:
            </Label>
            <Select
              value={formData.tempatKejadian}
              onValueChange={(value) => updateField({ tempatKejadian: value })}
            >
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t.selectPlaceholder || 'Please select...'} />
                  </SelectTrigger>
              <SelectContent>
                <SelectItem value="Makmal">Lab</SelectItem>
                  <SelectItem value="Pejabat">Office</SelectItem>
                  <SelectItem value="Rumah">Home</SelectItem>
                  <SelectItem value="Jalan Raya">Road</SelectItem>
              </SelectContent>
            </Select>
            {errors.tempatKejadian && <p className="text-xs text-red-600 mt-1">{errors.tempatKejadian}</p>}
          </div>

          <div>
            <Label className="text-sm font-normal text-[#1e40af]">{t.lotRoomBuilding?.label || 'Lot/Room/Office/Building No.'}:</Label>
            <Input
              value={formData.noLot}
              onChange={(e) => updateField({ noLot: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="namaJalan" className="text-sm font-normal text-[#1e40af]">
              {t.streetName?.label || 'Street Name'} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="namaJalan"
              value={formData.namaJalan}
              onChange={(e) => updateField({ namaJalan: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
            {errors.namaJalan && <p className="text-xs text-red-600 mt-1">{errors.namaJalan}</p>}
          </div>

          <div>
            <Label htmlFor="namaTaman" className="text-sm font-normal text-[#1e40af]">
              {t.placeName?.label || 'Park/Place Name'} :
            </Label>
            <Input
              id="namaTaman"
              value={formData.namaTaman}
              onChange={(e) => updateField({ namaTaman: e.target.value })}
              className="mt-1"
              placeholder=""
            />
            {errors.namaTaman && <p className="text-xs text-red-600 mt-1">{errors.namaTaman}</p>}
          </div>

          <div>
            <Label htmlFor="poskod" className="text-sm font-normal text-[#1e40af]">
              {t.postcode || 'Postcode'} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="poskod"
              value={formData.poskod}
              onChange={(e) => updateField({ poskod: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
            {errors.poskod && <p className="text-xs text-red-600 mt-1">{errors.poskod}</p>}
          </div>

          <div>
            <Label htmlFor="bandar" className="text-sm font-normal text-[#1e40af]">
              {t.city?.label || 'City'} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="bandar"
              value={formData.bandar}
              onChange={(e) => updateField({ bandar: e.target.value })}
              className="mt-1"
              placeholder=""
              required
            />
            {errors.bandar && <p className="text-xs text-red-600 mt-1">{errors.bandar}</p>}
          </div>

          <div>
            <Label htmlFor="negeri" className="text-sm font-normal text-[#1e40af]">
              {t.state?.label || 'State'} <span className="text-red-500">*</span> :
            </Label>
            <Select value={formData.negeri} onValueChange={(value) => updateField({ negeri: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t.selectState || 'Please select a state'} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(states).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.negeri && <p className="text-xs text-red-600 mt-1">{errors.negeri}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-normal text-[#1e40af]">
              Date <span className="text-red-500">*</span> :
            </Label>
            <div className="mt-1">
              <div className="relative">
                              <Input
                                type="date"
                                value={formData.tarikh}
                                onChange={(e) => { updateField({ tarikh: e.target.value }) }}
                                required
                              />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-normal text-[#1e40af]">
              Time <span className="text-red-500">*</span> :
            </Label>
            <div className="mt-1">
              <div className="relative">
                <Input
                  type="time"
                  value={formData.masa}
                  onChange={(e) => { updateField({ masa: e.target.value }) }}
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
        <p className="text-red-500 text-sm">* Required</p>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" onClick={onBack} variant="outline" className="px-8 py-2 bg-transparent">
          « Back
        </Button>
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          Next »
        </Button>
      </div>
    </form>
  )
}
