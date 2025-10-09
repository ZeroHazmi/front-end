"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalDetailsFormProps {
  incidentType: string
  onNext: () => void // Added onNext prop for navigation
  onChange?: (data: any) => void
}

export function PersonalDetailsForm({ incidentType, onNext, onChange }: PersonalDetailsFormProps) {
  const [formData, setFormData] = useState({
    mobileBimbit: "0192950879",
    mobileBimbitConfirm: "",
    telefonPejabat: "",
    telefonPejabat2: "",
    alamat1: "308, JALAN GEMILANG 12, TAMAN GEMILANG",
    alamat2: "",
    alamat3: "",
    alamat4: "",
    alamat5: "",
    poskod: "09600",
    negeri: "KEDAH",
    daerah: "KULIM",
    emel: "zalhazmibinmusrizal@gmail.com",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    if (onChange) onChange(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="mobileBimbit" className="text-sm font-normal text-gray-700">
              No. Telefon Bimbit <span className="text-red-500">*</span> :
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
            <Label htmlFor="telefonPejabat" className="text-sm font-normal text-gray-700">
              No. Telefon Pejabat :
            </Label>
            <Input
              id="telefonPejabat"
              value={formData.telefonPejabat}
              onChange={(e) => setFormData({ ...formData, telefonPejabat: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="alamat1" className="text-sm font-normal text-gray-700">
              Alamat <span className="text-red-500">*</span> :
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
              <Input value={formData.alamat4} onChange={(e) => setFormData({ ...formData, alamat4: e.target.value })} />
              <Input value={formData.alamat5} onChange={(e) => setFormData({ ...formData, alamat5: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="poskod" className="text-sm font-normal text-gray-700">
              Poskod <span className="text-red-500">*</span> :
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
              Negeri Dan Daerah <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3 mt-1">
              <Select value={formData.negeri} onValueChange={(value) => setFormData({ ...formData, negeri: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KEDAH">KEDAH</SelectItem>
                  <SelectItem value="SELANGOR">SELANGOR</SelectItem>
                  <SelectItem value="JOHOR">JOHOR</SelectItem>
                  <SelectItem value="PENANG">PENANG</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.daerah} onValueChange={(value) => setFormData({ ...formData, daerah: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KULIM">KULIM</SelectItem>
                  <SelectItem value="BALING">BALING</SelectItem>
                  <SelectItem value="SUNGAI PETANI">SUNGAI PETANI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="emel" className="text-sm font-normal text-gray-700">
              Emel <span className="text-red-500">*</span> :
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
            <Label htmlFor="mobileBimbitConfirm" className="text-sm font-normal text-gray-700">
              Taip Semula No. Telefon Bimbit <span className="text-red-500">*</span> :
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
            <Label htmlFor="telefonPejabat2" className="text-sm font-normal text-gray-700">
              No. Telefon Pejabat :
            </Label>
            <Input
              id="telefonPejabat2"
              value={formData.telefonPejabat2}
              onChange={(e) => setFormData({ ...formData, telefonPejabat2: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-red-500 text-sm">* Mandatori</p>
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
          Seterusnya »
        </Button>
      </div>
    </form>
  )
}
