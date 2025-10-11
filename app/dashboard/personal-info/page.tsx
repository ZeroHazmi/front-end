"use client"

import type React from "react"

import { useState, useEffect } from "react"
import DashboardHeader from '@/components/header/dashboard-header'
import { getDraft, setDraft } from '@/lib/draftStorage'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function PersonalInfoPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    icNumber: "",
    dateOfBirth: "",
    age: "",
    citizenship: "",
    religion: "",
    mobileBimbit: "",
    phoneHome: "",
    phoneOffice: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    address5: "",
    email: "",
  })

  // restore personal info draft on mount
  useEffect(() => {
    try {
      const draft = getDraft('personalInfo')
      if (draft) setFormData((prev) => ({ ...prev, ...draft }))
    } catch (e) {}
  }, [])

  // persist personal info to session on every change
  useEffect(() => {
    try { setDraft('personalInfo', formData) } catch (e) {}
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  const handleConfirmUpdate = () => {
    console.log("[v0] Updating user information:", formData)
    setShowConfirmModal(false)
    // TODO: Show success message or redirect after successful update
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">{t.personalInfo_update_title}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="icNumber">
                    {t.icNumber} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="icNumber"
                    value={formData.icNumber}
                    onChange={(e) => setFormData({ ...formData, icNumber: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                      
                <div>
                  <Label htmlFor="dateOfBirth">
                    {t.birthdate} <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        placeholder={t.placeholder_date_format}
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      placeholder={t.label_age}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-20"
                    />
                    <span className="flex items-center text-sm text-gray-600">{t.label_years}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="citizenship">
                    {t.nationality} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.citizenship}
                    onValueChange={(value) => setFormData({ ...formData, citizenship: value })}
                  >
                      <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Malaysia">{t.country_malaysia}</SelectItem>
                      <SelectItem value="Other">{t.other_label}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="religion">
                    {t.religion} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.religion}
                    onValueChange={(value) => setFormData({ ...formData, religion: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Buddhism">Buddhism</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mobileBimbit">
                    {t.phoneNumber} <span className="text-red-500">*</span>
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
                  <Label htmlFor="phoneOffice">{t.officePhoneNumber}:</Label>
                  <Input
                    id="phoneOffice"
                    value={formData.phoneOffice}
                    onChange={(e) => setFormData({ ...formData, phoneOffice: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address1">
                    {t.address} <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2 mt-1">
                    <Input
                      id="address1"
                      value={formData.address1}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      required
                    />
                    <Input
                      value={formData.address2}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                    />
                    <Input
                      value={formData.address3}
                      onChange={(e) => setFormData({ ...formData, address3: e.target.value })}
                    />
                    <Input
                      value={formData.address4}
                      onChange={(e) => setFormData({ ...formData, address4: e.target.value })}
                    />
                    <Input
                      value={formData.address5}
                      onChange={(e) => setFormData({ ...formData, address5: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">
                    {t.email} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-red-500 mt-1">{t.required}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">

                {/* Confirm mobile removed per request */}

                <div>
                  <Label htmlFor="phoneHome">{t.housePhoneNumber}</Label>
                  <Input
                    id="phoneHome"
                    value={formData.phoneHome}
                    onChange={(e) => setFormData({ ...formData, phoneHome: e.target.value })}
                    className="mt-1"
                  />
                </div>

                {/* Postcode, State & District removed per request */}

                {/* Confirm email removed per request */}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
                {t.button_update}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t.confirmation_title_update}</DialogTitle>
            <DialogDescription className="text-center pt-4">
              {t.confirmation_update_desc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)} className="px-8">
              {t.cancel}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUpdate}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8"
            >
              {t.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}