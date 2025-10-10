"use client"

import type React from "react"

import { useState } from "react"
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

export default function ButiranPeribadiPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [formData, setFormData] = useState({
    icNumber: "",
    name: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    citizenship: "",
    race: "",
    religion: "",
    mobileBimbit: "",
    mobileRetype: "",
    phoneHome: "",
    phoneOffice: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    address5: "",
    postcode: "",
    state: "",
    district: "",
    email: "",
    emailRetype: "",
  })

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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Kemas kini Pengguna</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="icNumber">
                    No. Kad Pengenalan Baru <span className="text-red-500">*</span>
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
                    Tarikh Lahir <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        placeholder="DD/MM/YYYY"
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      placeholder="Umur"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-20"
                    />
                    <span className="flex items-center text-sm text-gray-600">Tahun</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="citizenship">
                    Warganegara <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.citizenship}
                    onValueChange={(value) => setFormData({ ...formData, citizenship: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sila Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Malaysia">Malaysia</SelectItem>
                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="religion">
                    Agama <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.religion}
                    onValueChange={(value) => setFormData({ ...formData, religion: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sila Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Kristian">Kristian</SelectItem>
                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mobileBimbit">
                    No. Telefon Bimbit <span className="text-red-500">*</span>
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
                  <Label htmlFor="phoneOffice">No. Telefon Pejabat :</Label>
                  <Input
                    id="phoneOffice"
                    value={formData.phoneOffice}
                    onChange={(e) => setFormData({ ...formData, phoneOffice: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address1">
                    Alamat <span className="text-red-500">*</span>
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
                    Emel <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-red-500 mt-1">* Mandatori</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">
                    Nama Pengguna <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">
                    Jantina <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sila Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lelaki">Lelaki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="race">
                    Keturunan <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.race} onValueChange={(value) => setFormData({ ...formData, race: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sila Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Melayu">Melayu</SelectItem>
                      <SelectItem value="Cina">Cina</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mobileRetype">
                    Taip Semula No. Telefon Bimbit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobileRetype"
                    value={formData.mobileRetype}
                    onChange={(e) => setFormData({ ...formData, mobileRetype: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneHome">No. Telefon Rumah :</Label>
                  <Input
                    id="phoneHome"
                    value={formData.phoneHome}
                    onChange={(e) => setFormData({ ...formData, phoneHome: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="postcode">
                    Poskod <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">
                    Negeri Dan Daerah <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2 mt-1">
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sila Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SELANGOR">SELANGOR</SelectItem>
                        <SelectItem value="KUALA LUMPUR">KUALA LUMPUR</SelectItem>
                        <SelectItem value="JOHOR">JOHOR</SelectItem>
                        <SelectItem value="KEDAH">KEDAH</SelectItem>
                        <SelectItem value="KELANTAN">KELANTAN</SelectItem>
                        <SelectItem value="MELAKA">MELAKA</SelectItem>
                        <SelectItem value="NEGERI SEMBILAN">NEGERI SEMBILAN</SelectItem>
                        <SelectItem value="PAHANG">PAHANG</SelectItem>
                        <SelectItem value="PENANG">PENANG</SelectItem>
                        <SelectItem value="PERAK">PERAK</SelectItem>
                        <SelectItem value="PERLIS">PERLIS</SelectItem>
                        <SelectItem value="SABAH">SABAH</SelectItem>
                        <SelectItem value="SARAWAK">SARAWAK</SelectItem>
                        <SelectItem value="TERENGGANU">TERENGGANU</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sila Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KLANG UTAMA">KLANG UTAMA</SelectItem>
                        <SelectItem value="KLANG SELATAN">KLANG SELATAN</SelectItem>
                        <SelectItem value="PETALING JAYA">PETALING JAYA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="emailRetype">
                    Taip Semula Emel <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emailRetype"
                    type="email"
                    value={formData.emailRetype}
                    onChange={(e) => setFormData({ ...formData, emailRetype: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">
                Kemas kini
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Pengesahan</DialogTitle>
            <DialogDescription className="text-center pt-4">
              Adakah anda pasti ingin mengemaskini butir peribadi anda?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)} className="px-8">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUpdate}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}