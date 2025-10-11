"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { states, stateDistrictsMap } from '@/types/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import reportPersister from '@/lib/reportPersister'
import { useEffect } from 'react'

interface PersonalDetailsFormProps {
  incidentType: string
  onNext: () => void // Added onNext prop for navigation
  onChange?: (data: any) => void
}

export function PersonalDetailsForm({ incidentType, onNext, onChange }: PersonalDetailsFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    mobileBimbit: "",
    mobileBimbitConfirm: "",
    telefonPejabat: "",
    telefonPejabat2: "",
    alamat1: "",
    alamat2: "",
    alamat3: "",
    alamat4: "",
    alamat5: "",
    poskod: "",
    negeri: "",
    daerah: "",
    emel: "",
  })

  // restore from aggregate on mount
  useEffect(() => {
    try {
      const agg = reportPersister.getAggregate()
      if (agg) {
        setFormData((prev) => ({ ...prev, ...(agg || {}) }))
      }
    } catch (e) {}
  }, [])

  // Fetch user profile to prefill personal details (client-side cookie reader)
  useEffect(() => {
    let mounted = true
    const getClientCookie = (name: string) => {
      if (typeof document === 'undefined') return ''
      const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))
      if (!match) return ''
      return decodeURIComponent(match.split('=')[1] || '')
    }

    const fetchUser = async () => {
      try {
        const userId = getClientCookie('userId')
        if (!userId) return
        const res = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/${userId}`)
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        // Map API fields to form fields
        const addr = data.address || ''
        const parts = addr.split(',').map((s: string) => s.trim()).filter(Boolean)
        const addrParts: string[] = [ '', '', '', '', '' ]
        for (let i = 0; i < Math.min(parts.length, 5); i++) addrParts[i] = parts[i]

        setFormData((prev) => ({
          ...prev,
          mobileBimbit: data.phoneNumber || data.mobilePhone || prev.mobileBimbit,
          mobileBimbitConfirm: data.phoneNumber || prev.mobileBimbitConfirm,
          telefonPejabat: data.office_Phone_Number || data.officePhone || prev.telefonPejabat,
          telefonPejabat2: data.house_Phone_Number || prev.telefonPejabat2,
          emel: data.email || prev.emel,
          alamat1: addrParts[0] || prev.alamat1,
          alamat2: addrParts[1] || prev.alamat2,
          alamat3: addrParts[2] || prev.alamat3,
          alamat4: addrParts[3] || prev.alamat4,
          alamat5: addrParts[4] || prev.alamat5,
          poskod: data.postcode || prev.poskod,
          negeri: data.state || prev.negeri,
          daerah: data.region || prev.daerah,
        }))
      } catch (e) {
        console.log('[PersonalDetailsForm] failed to fetch user', e)
      }
    }
    fetchUser()
    return () => { mounted = false }
  }, [])

  // persist to aggregate whenever formData changes
  useEffect(() => {
    try { reportPersister.setAggregatePatch({
      mobilePhone: formData.mobileBimbit,
      officePhone: formData.telefonPejabat,
      officePhone2: formData.telefonPejabat2,
      email: formData.emel,
      addressParts: {
        alamat1: formData.alamat1,
        alamat2: formData.alamat2,
        alamat3: formData.alamat3,
        alamat4: formData.alamat4,
        alamat5: formData.alamat5,
      },
      poskod: formData.poskod,
      state: formData.negeri,
      district: formData.daerah,
    } ) } catch (e) {}
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    // Compose a single address string and emit canonical keys expected by the report API
    const composedAddress = `${formData.alamat1 ? formData.alamat1 + ', ' : ''}${formData.alamat2 ? formData.alamat2 + ', ' : ''}${formData.alamat3 ? formData.alamat3 + ', ' : ''}${formData.alamat4 ? formData.alamat4 + ', ' : ''}${formData.alamat5 ? formData.alamat5 + ', ' : ''}${formData.poskod ? formData.poskod + ', ' : ''}${formData.negeri ? formData.negeri : ''}`.replace(/,\s*$/, '')

    const payloadForParent: any = {
      // personal/contact info
      mobilePhone: formData.mobileBimbit,
      mobilePhoneConfirm: formData.mobileBimbitConfirm,
      officePhone: formData.telefonPejabat,
      officePhone2: formData.telefonPejabat2,
      email: formData.emel,
      // canonical address fields used by the dashboard payload
      address: composedAddress,
      postcode: formData.poskod,
      state: formData.negeri,
      district: formData.daerah,
      // keep original form pieces as fallback
      addressParts: {
        alamat1: formData.alamat1,
        alamat2: formData.alamat2,
        alamat3: formData.alamat3,
        alamat4: formData.alamat4,
        alamat5: formData.alamat5,
      },
    }

    if (onChange) onChange(payloadForParent)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="mobileBimbit" className="text-sm font-normal text-gray-700">
              {t.phoneNumber} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="mobileBimbit"
              value={formData.mobileBimbit}
              onChange={(e) => setFormData({ ...formData, mobileBimbit: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="mobileBimbitConfirm" className="text-sm font-normal text-gray-700">
              {t.confirmMobile} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="mobileBimbitConfirm"
              value={formData.mobileBimbitConfirm}
              onChange={(e) => setFormData({ ...formData, mobileBimbitConfirm: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
              <Label htmlFor="telefonPejabat" className="text-sm font-normal text-gray-700">
              {t.officePhoneNumber} :
            </Label>
            <Input
              id="telefonPejabat"
              value={formData.telefonPejabat}
              onChange={(e) => setFormData({ ...formData, telefonPejabat: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="emel" className="text-sm font-normal text-gray-700">
              {t.email} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="emel"
              type="email"
              value={formData.emel}
              onChange={(e) => setFormData({ ...formData, emel: e.target.value })}
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          

          <div>
              <Label htmlFor="alamat1" className="text-sm font-normal text-gray-700">
              {t.address} <span className="text-red-500">*</span> :
            </Label>
            <div className="space-y-3 mt-1">
              <Input
                id="alamat1"
                value={formData.alamat1}
                onChange={(e) => setFormData({ ...formData, alamat1: e.target.value })}
                required
              />
              <Input value={formData.alamat2} onChange={(e) => setFormData({ ...formData, alamat2: e.target.value })} />
              <Input value={formData.alamat3} onChange={(e) => setFormData({ ...formData, alamat3: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="poskod" className="text-sm font-normal text-gray-700">
              {t.postcode} <span className="text-red-500">*</span> :
            </Label>
            <Input
              id="poskod"
              value={formData.poskod}
              onChange={(e) => setFormData({ ...formData, poskod: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="negeri" className="text-sm font-normal text-gray-700">
              {t.states} <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3 mt-1">
              <Select
                value={formData.negeri}
                onValueChange={(value) => setFormData({ ...formData, negeri: value, daerah: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectPlaceholder || 'Please select...'} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(states).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={formData.daerah} onValueChange={(value) => setFormData({ ...formData, daerah: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectPlaceholder || 'Please select...'} />
                </SelectTrigger>
                <SelectContent>
                  {(stateDistrictsMap as any)[formData.negeri]?.districts?.map((d: string) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-8">
        <p className="text-red-500 text-sm">* Required</p>
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          {t.next}
        </Button>
      </div>
    </form>
  )
}
