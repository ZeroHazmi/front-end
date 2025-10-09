"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Upload, Info, Camera, X, Check } from "lucide-react"

interface IncidentDescriptionCarAccidentProps {
  onNext: () => void
  onBack: () => void
  onChange?: (data: any) => void
}

interface UploadedImage {
  id: string
  url: string
  type: string
}

export function IncidentDescriptionCarAccident({ onNext, onBack, onChange }: IncidentDescriptionCarAccidentProps) {
  const [formData, setFormData] = useState({
    jenisKenderaan: "Motosikal/Wagen",
    jenamaKenderaan: "HONDA",
    modelKenderaan: "HONDA CIVIC 2.05",
    puncaKejadian: "Elak/Langgar Objek/Binatang",
    langgarBinatang: "",
    khinzir: "",
    bahagianKerosakan: {
      depan: true,
      belakang: false,
      kiri: false,
      kanan: false,
      atas: false,
      bawah: false,
    },
    keterangan: `PADA 23/08/2025 JAM 1220HRS, SAYA TELAH MENGALAMI KEMALANGAN AKIBAT MELANGGAR KHINZIR YANG MELINTAS SECARA TIBA-TIBA KETIKA SAYA MEMANDU DI PETALINGJAYA SELANGOR KE BALING KEDAH UNTUK TUJUAN KERJA. SAYA MEMANDU DI LORONG KIRI LEBUH RAYA BARU SELATAN LOKASI KEJADIAN BERHAMPIRAN DENGAN LOKASI 70 POS KM. NORTH-SOUTH HIGHWAY (UTARA) - E1. KENDERAAN SAYA TELAH MENGALAMI KEMALANGAN AKIBAT MELANGGAR KHINZIR.`,
    agreement: false,
  })

  const [hasIncidentImages, setHasIncidentImages] = useState<"Ya" | "Tidak" | null>(null)
  const [incidentImages, setIncidentImages] = useState<UploadedImage[]>([])
  const [selfieImage, setSelfieImage] = useState<UploadedImage | null>(null)
  const [dashboardImage, setDashboardImage] = useState<UploadedImage | null>(null)
  const [vehicleImage, setVehicleImage] = useState<UploadedImage | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [currentUploadTarget, setCurrentUploadTarget] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          url: reader.result as string,
          type: target,
        }

        if (target === "incident") {
          setIncidentImages([...incidentImages, newImage])
          if (onChange) onChange({ incidentImages: [...incidentImages, newImage] })
        } else if (target === "selfie") {
          setSelfieImage(newImage)
          if (onChange) onChange({ selfieImage: newImage })
        } else if (target === "dashboard") {
          setDashboardImage(newImage)
          if (onChange) onChange({ dashboardImage: newImage })
        } else if (target === "vehicle") {
          setVehicleImage(newImage)
          if (onChange) onChange({ vehicleImage: newImage })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (target: string, imageId?: string) => {
    if (target === "incident" && imageId) {
      setIncidentImages(incidentImages.filter((img) => img.id !== imageId))
      if (onChange) onChange({ incidentImages: incidentImages.filter((img) => img.id !== imageId) })
    } else if (target === "selfie") {
      setSelfieImage(null)
      if (onChange) onChange({ selfieImage: null })
    } else if (target === "dashboard") {
      setDashboardImage(null)
      if (onChange) onChange({ dashboardImage: null })
    } else if (target === "vehicle") {
      setVehicleImage(null)
      if (onChange) onChange({ vehicleImage: null })
    }
  }

  const openFileUpload = (target: string) => {
    setCurrentUploadTarget(target)
    fileInputRef.current?.click()
  }

  const openCamera = (target: string) => {
    setCurrentUploadTarget(target)
    cameraInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Emit selected images and description as reportContent/fieldValue/image
    if (onChange) onChange({
      reportContent: formData.keterangan,
      fieldValue: JSON.stringify({ vehicle: formData.jenisKenderaan, brand: formData.jenamaKenderaan, model: formData.modelKenderaan }),
      incidentImages,
      selfieImage,
      dashboardImage,
      vehicleImage,
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => currentUploadTarget && handleFileUpload(e, currentUploadTarget)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => currentUploadTarget && handleFileUpload(e, currentUploadTarget)}
      />

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
            <span className="font-semibold text-[#1e40af]">Tarikh:</span> 20/06/2025
          </div>
          <div>
            <span className="font-semibold text-[#1e40af]">Masa:</span> 1220hrs
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">Tempat:</span> LEBUH RAYA BARU SELATAN
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">Lokasi Kemalangan:</span> N831-70, PENDANG, KEDAH
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-[#1e40af]">Butir-Butir Kenderaan:</span> Sila masukkan nombor plat
            kenderaan anda <span className="text-red-500">*</span>
          </div>
        </div>
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

          <div className="mt-4">
            <Label htmlFor="langgarBinatang" className="text-sm font-normal">
              Langgar Binatang
            </Label>
            <Select
              value={formData.langgarBinatang}
              onValueChange={(value) => setFormData({ ...formData, langgarBinatang: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sila Pilih..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Khinzir">Khinzir</SelectItem>
                <SelectItem value="Lembu">Lembu</SelectItem>
                <SelectItem value="Anjing">Anjing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Label htmlFor="khinzir" className="text-sm font-normal">
              Khinzir
            </Label>
            <Select value={formData.khinzir} onValueChange={(value) => setFormData({ ...formData, khinzir: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sila Pilih..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ya">Ya</SelectItem>
                <SelectItem value="Tidak">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

      {/* General Incident Images Upload */}
      <div className="mb-6 border-4 border-red-600 rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold text-red-600 mb-2">Muat Naik Lampiran</h3>
        <p className="text-sm mb-2">Adakah anda mempunyai gambar di lokasi kejadian atau objek yang ditinggal?</p>
        <p className="text-sm text-gray-600 mb-4">*Sila muat naik maksimum fail muat naik 5MB</p>

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasImages"
              value="Ya"
              checked={hasIncidentImages === "Ya"}
              onChange={() => setHasIncidentImages("Ya")}
              className="w-4 h-4"
            />
            <span className="text-sm">Ya</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasImages"
              value="Tidak"
              checked={hasIncidentImages === "Tidak"}
              onChange={() => setHasIncidentImages("Tidak")}
              className="w-4 h-4"
            />
            <span className="text-sm">Tidak</span>
          </label>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {[0, 1, 2, 3, 4].map((index) => {
            const uploadedImage = incidentImages[index]
            return (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {uploadedImage ? (
                  <div className="relative">
                    <div className="w-full h-24 relative rounded overflow-hidden">
                      <Image src={uploadedImage.url || "/placeholder.svg"} alt={`Upload ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage("incident", uploadedImage.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openFileUpload("incident")}
                    className="w-16 h-16 mx-auto bg-[#1e3a8a] text-white rounded-full flex items-center justify-center hover:bg-[#1e40af] transition-colors"
                  >
                    <span className="text-3xl">+</span>
                  </button>
                )}
                <p className="text-xs text-gray-600 mt-2">[ Gambar / Video ]</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-[#3b82f6] mb-4">
          Sila tekan butang &apos;Muat Naik&apos; untuk ambil gambar keadaan kenderaan semasa
        </p>
        <Button type="button" className="bg-cyan-500 hover:bg-cyan-600 text-white mb-6">
          Muat Naik
        </Button>

        {/* Selfie with ID Section */}
        <div className="mb-6">
          <p className="text-sm mb-2">
            Sila swafoto bersama kad pengenalan anda
            <br />
            <span className="text-red-500">*Sila maksimum fail muat naik 5MB</span>
          </p>
          <div className="flex gap-4 items-start">
            {selfieImage ? (
              <div className="relative w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="w-full h-full relative">
                  <Image src={selfieImage.url || "/placeholder.svg"} alt="Selfie with ID" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage("selfie")}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-sm">Tiada gambar</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => openCamera("selfie")}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>

        {/* Dashboard/Front Damage Section */}
        <div className="mb-6">
          <p className="text-sm mb-2">
            Gambar kerosakan kenderaan (Depan/Hadapan)
            <br />
            <span className="text-red-500">*Sila maksimum fail muat naik 5MB</span>
          </p>
          <div className="flex gap-4 items-start">
            {dashboardImage ? (
              <div className="relative w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="w-full h-full relative">
                  <Image src={dashboardImage.url || "/placeholder.svg"} alt="Dashboard" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage("dashboard")}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-sm">Tiada gambar</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => openCamera("dashboard")}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>

        {/* Vehicle Right Side Section */}
        <div className="mb-6">
          <p className="text-sm mb-2">
            Gambar kerosakan kenderaan (Kanan)
            <br />
            <span className="text-red-500">*Sila maksimum fail muat naik 5MB</span>
          </p>
          <div className="flex gap-4 items-start">
            {vehicleImage ? (
              <div className="relative w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="w-full h-full relative">
                  <Image src={vehicleImage.url || "/placeholder.svg"} alt="Vehicle" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage("vehicle")}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-sm">Tiada gambar</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => openCamera("vehicle")}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* </CHANGE> */}

      {/* Image Upload Buttons */}
      <div className="mb-6 flex gap-4">
        <Button type="button" className="bg-green-600 hover:bg-green-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Muat Naik Gambar
        </Button>
        <Button type="button" className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Kemas kini
        </Button>
      </div>

      {/* Description Text Area */}
      <div className="mb-6">
        <Textarea
          value={formData.keterangan}
          onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
          className="min-h-[200px] text-sm"
          required
        />
      </div>

      {/* Selection Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold mb-2">PILIHAN OLEH PENGADU</p>
        <div className="flex items-start space-x-2 mb-4">
          <input type="radio" id="pilihan1" name="pilihan" defaultChecked className="mt-1" />
          <label htmlFor="pilihan1" className="text-sm">
            1. ELAK/LANGGAR OBJEK/BINATANG, (LANGGAR BINATANG) - KHINZIR
          </label>
        </div>

        <p className="text-sm font-semibold mb-2">BERSAMA INI SAYA MELAMPIRKAN GAMBAR BERIKUT:</p>
        <ol className="text-sm space-y-1 ml-4">
          <li>1. GAMBAR KEJADIAN</li>
          <li>2. SWAFOTO BERSAMA KAD PENGENALAN</li>
          <li>3. GAMBAR KENDERAAN</li>
        </ol>
      </div>

      {/* Mandatory Note */}
      <div className="mb-4">
        <p className="text-red-500 text-sm">* Mandatori</p>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900">
          Sila pastikan anda menekan butang Kemas kini untuk menyimpan perubahan sebelum meneruskan ke langkah
          Seterusnya.
        </p>
      </div>

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
