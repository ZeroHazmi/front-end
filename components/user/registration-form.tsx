"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IcScanner } from "./ic-scanner"
import { WarningModal } from "./warning-modal"
import { Calendar } from "lucide-react"
import { registerUser } from "@/actions/user"
import {AppUser} from "@/types";
import { states, stateDistrictsMap, gender as genderConst, races as racesConst, religion as religionConst } from "@/types/constants"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface FormData {
  icNumber: string
  name: string
  dateOfBirth: string
  gender: string
  citizenship: string
  race: string
  religion: string
  homePhone: string
  mobilePhone: string
  mobilePhoneConfirm: string
  officePhone: string
  address1: string
  address2: string
  address3: string
  address4: string
  address5: string
  postcode: string
  state: string
  district: string
  email: string
  emailConfirm: string
  password: string
  passwordConfirm: string
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    icNumber: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    citizenship: "",
    race: "",
    religion: "",
    homePhone: "",
    mobilePhone: "",
    mobilePhoneConfirm: "",
    officePhone: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    address5: "",
    postcode: "",
    state: "",
    district: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
  })

  const [showWarningModal, setShowWarningModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Updated: sanitize icNumber to digits only (no dashes) and centralize input handling
  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === "icNumber") {
      // remove any non-digit characters (blocks dashes, letters, spaces)
      value = value.replace(/[^0-9]/g, "")
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleIcScanComplete = (scannedData: Partial<FormData>) => {
    // ensure scanned IC is sanitized if present
    const mapped: Partial<FormData> = {}
    if (scannedData.icNumber) {
      mapped.icNumber = scannedData.icNumber.replace(/[^0-9]/g, "")
    }

    if (scannedData.name) mapped.name = scannedData.name

    // Normalize DOB into YYYY-MM-DD when possible
    if (scannedData.dateOfBirth) {
      const tryNormalize = (s: string) => {
        // prefer already ISO-like
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
        const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
        if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`
        const dt = new Date(s)
        if (!Number.isNaN(dt.getTime())) return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`
        return ""
      }
      const norm = tryNormalize(String(scannedData.dateOfBirth))
      if (norm) mapped.dateOfBirth = norm
    }

    if (scannedData.gender) {
      const gRaw = String(scannedData.gender).toLowerCase()
      if (gRaw.startsWith("m") || gRaw === "male") mapped.gender = "male"
      else if (gRaw.startsWith("f") || gRaw === "female") mapped.gender = "female"
      else mapped.gender = gRaw
    }

    // nationality mapping: PixLab may return 'Malaysia' etc. Map to our select values
    const sdAny: any = scannedData as any
    if (sdAny.nationality) {
      const n = String(sdAny.nationality).toLowerCase()
      if (n.includes("malay") || n.includes("malaysia") || n === "mys") mapped.citizenship = "malaysian"
      else if (n.includes("permanent")) mapped.citizenship = "pr"
      else mapped.citizenship = "foreigner"
    }

    // Religion mapping: map OCR value to form select values (lowercase keys used in form)
    if (sdAny.religion) {
      const r = String(sdAny.religion).toLowerCase()
      if (r.includes("islam")) mapped.religion = "islam"
      else if (r.includes("budd")) mapped.religion = "buddhism"
      else if (r.includes("christ")) mapped.religion = "christianity"
      else if (r.includes("hindu")) mapped.religion = "hinduism"
      else mapped.religion = "other"
    }

    // Race mapping: try to map OCR value to racesConst keys (case-insensitive)
    if (sdAny.race || sdAny.descendants || sdAny.ethnicity) {
      const raceRaw = String(sdAny.race || sdAny.descendants || sdAny.ethnicity).toLowerCase()
      const raceKey = Object.keys(racesConst).find((k) => k.toLowerCase() === raceRaw || raceRaw.includes(k.toLowerCase()) || k.toLowerCase().includes(raceRaw))
      if (raceKey) mapped.race = raceKey
    }

    // address -> address1 (put full address into address1) and extract postcode
    const addressCandidates = [sdAny.address, sdAny.fullAddress, sdAny.fullAddressText, sdAny.issuingState, sdAny.mrzRawText].filter(Boolean).join(" ")
    if (addressCandidates) mapped.address1 = addressCandidates

    // postcode: try to extract 5-digit Malaysian postcode from addressCandidates or scanned postcode
    if (sdAny.postcode) mapped.postcode = String(sdAny.postcode)
    else {
      const m = String(addressCandidates || "").match(/\b(\d{5})\b/)
      if (m) mapped.postcode = m[1]
    }

    // state: the scanner returns either a state key (like 'johor') or a label; normalize to key
    const mapStateLabelToKey = (input?: string) => {
      if (!input) return ""
      const s = input.toString().trim()
      if (!s) return ""
      // if it's already a key present in states, use it
      if ((states as any)[s]) return s

      // try substring match on labels
      const lower = s.toLowerCase()
      const found = Object.entries(states).find(([, label]) => String(label).toLowerCase().includes(lower))
      if (found) return found[0]

      // fuzzy match using Levenshtein distance on normalized labels
      const normalize = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, "")
      const target = normalize(s)
      const candidates = Object.entries(states).map(([k, label]) => ({ key: k, label: String(label) }))
      let best: { key: string; score: number } | null = null
      const levenshtein = (a: string, b: string) => {
        const al = a.length
        const bl = b.length
        const dp: number[][] = Array.from({ length: al + 1 }, () => Array(bl + 1).fill(0))
        for (let i = 0; i <= al; i++) dp[i][0] = i
        for (let j = 0; j <= bl; j++) dp[0][j] = j
        for (let i = 1; i <= al; i++) {
          for (let j = 1; j <= bl; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
          }
        }
        return dp[al][bl]
      }

      for (const c of candidates) {
        const lab = normalize(c.label)
        const dist = levenshtein(lab, target)
        const maxLen = Math.max(lab.length, target.length)
        const score = maxLen > 0 ? dist / maxLen : 1
        if (!best || score < best.score) best = { key: c.key, score }
      }
      if (best && best.score < 0.45) return best.key
      return ""
    }

    const maybeStateInput = sdAny.state || sdAny.issuingState || addressCandidates
    if (maybeStateInput) {
      const mappedState = mapStateLabelToKey(String(maybeStateInput))
      if (mappedState) mapped.state = mappedState
    }

    setFormData((prev) => {
      const next = { ...prev, ...mapped }
      // compute which fields were auto-filled (keys present in mapped and non-empty)
      const filled = Object.keys(mapped).filter((k) => mapped[k as keyof typeof mapped])
      const labelMap: Record<string, string> = {
        icNumber: "No. Kad Pengenalan",
        name: "Nama Penuh",
        dateOfBirth: "Tarikh Lahir",
        gender: "Jantina",
        citizenship: "Warganegara",
        address1: "Alamat",
        postcode: "Poskod",
        state: "Negeri",
      }
      const friendly = filled.map((k) => labelMap[k] || k)
      if (friendly.length) setAutoFilledFields(friendly)
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowWarningModal(true)
  }

  // New helper: check age >= 18
  const isAtLeast18 = (dateStr: string) => {
    if (!dateStr) return false
    const dob = new Date(dateStr)
    if (Number.isNaN(dob.getTime())) return false
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age >= 18
  }

  // New helper: required fields check
  const validateRequiredFields = (data: FormData) => {
    const required: (keyof FormData)[] = [
      "icNumber",
      "name",
      "dateOfBirth",
      "gender",
      "citizenship",
      "race",
      "religion",
      "mobilePhone",
      "mobilePhoneConfirm",
      "address1",
      "postcode",
      "state",
      "district",
      "email",
      "emailConfirm",
      "password",
      "passwordConfirm",
    ]

    for (const key of required) {
      const val = (data[key] ?? "").toString().trim()
      if (!val) return { ok: false, field: key }
    }

    return { ok: true }
  }

  // Updated: stronger validations including DOB >= 18 and confirm-fields
  const handleModalContinue = async () => {
    setShowWarningModal(false)

    // Required fields
    const requiredCheck = validateRequiredFields(formData)
    if (!requiredCheck.ok) {
      toast({ variant: "destructive", description: `Sila lengkapkan medan: ${requiredCheck.field}` })
      return
    }

    // IC number numeric-only check (already sanitized on input)
    if (!/^\d+$/.test(formData.icNumber)) {
      toast({ variant: "destructive", description: "No. Kad Pengenalan mesti mengandungi nombor sahaja." })
      return
    }

    // DOB -> minimum 18
    if (!isAtLeast18(formData.dateOfBirth)) {
      toast({ variant: "destructive", description: "Umur mesti 18 tahun ke atas." })
      return
    }

    // Confirm fields
    if (formData.password !== formData.passwordConfirm) {
      toast({ variant: "destructive", description: "Kata laluan tidak sepadan." })
      return
    }
    if (formData.email !== formData.emailConfirm) {
      toast({ variant: "destructive", description: "Emel tidak sepadan." })
      return
    }
    if (formData.mobilePhone !== formData.mobilePhoneConfirm) {
      toast({ variant: "destructive", description: "Nombor telefon bimbit tidak sepadan." })
      return
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({ variant: "destructive", description: "Emel tidak sah." })
      return
    }

    setIsSubmitting(true)

    // Map FormData → AppUser
    const userData: AppUser = {
      userName: formData.name,
      // Some backends expect a 'Name' field; include it to satisfy validation
      Name: formData.name,
      password: formData.password,
      email: formData.email,
      icNumber: formData.icNumber,
      birthday: formData.dateOfBirth,
      gender: formData.gender,
      nationality: formData.citizenship,
      descendants: formData.race,
      religion: formData.religion,
      phoneNumber: formData.mobilePhone,
      housePhoneNumber: formData.homePhone,
      officePhoneNumber: formData.officePhone,
      address: [formData.address1, formData.address2, formData.address3, formData.address4, formData.address5]
        .filter(Boolean)
        .join(", "),
      postcode: formData.postcode,
      region: formData.district,
      state: formData.state,
    }

    try {
      const response = await registerUser(userData)
      console.log("✅ Registration successful:", response)
      toast({ title: "Pendaftaran berjaya!", description: "Akaun anda telah didaftarkan dengan jayanya." })
      // After successful registration, send user back to login so they can sign in manually
      router.push("/login")
    } catch (error: any) {
      console.error("❌ Registration failed:", error)
      // Try to parse validation error objects thrown by registerUser
      let message = error?.message || "Pendaftaran gagal. Sila cuba lagi.";
      try {
        const parsed = JSON.parse(message)
        // If server returned an errors object, join the messages
        if (parsed?.errors && typeof parsed.errors === "object") {
          const combined = Object.entries(parsed.errors)
            .flatMap(([k, v]: any) => (Array.isArray(v) ? v : [v]))
            .join(" ")
          message = combined || message
        }
      } catch {
        // not JSON — keep original message
      }

      toast({ variant: "destructive", description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {autoFilledFields.length > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">Maklumat Diisi Automatik</div>
              <div className="text-sm text-gray-700">Kedua-dua medan berikut telah diisi berdasarkan imbasan:</div>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-800">
                {autoFilledFields.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <button className="text-sm text-gray-600 underline" onClick={() => setAutoFilledFields([])}>Tutup</button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IC Scanner */}
        <div className="mb-6">
          <IcScanner onScanComplete={handleIcScanComplete} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* IC Number */}
            <div className="space-y-2">
              <Label htmlFor="icNumber">No. Kad Pengenalan Baru <span className="text-red-600">*</span></Label>
              <Input
                id="icNumber"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={formData.icNumber}
                onChange={(e) => handleInputChange("icNumber", e.target.value)}
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Tarikh Lahir <span className="text-red-600">*</span></Label>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Jantina <span className="text-red-600">*</span></Label>
              <Select value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sila Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(genderConst).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Citizenship */}
            <div className="space-y-2">
              <Label>Warganegara <span className="text-red-600">*</span></Label>
              <Select value={formData.citizenship} onValueChange={(v) => handleInputChange("citizenship", v)}>
                <SelectTrigger><SelectValue placeholder="Sila Pilih..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="malaysian">Warganegara Malaysia</SelectItem>
                  <SelectItem value="pr">Pemastautin Tetap</SelectItem>
                  <SelectItem value="foreigner">Warga Asing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Religion */}
            <div className="space-y-2">
              <Label>Agama <span className="text-red-600">*</span></Label>
              <Select value={formData.religion} onValueChange={(v) => handleInputChange("religion", v)}>
                <SelectTrigger><SelectValue placeholder="Sila Pilih..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="islam">Islam</SelectItem>
                  <SelectItem value="buddhism">Buddha</SelectItem>
                  <SelectItem value="christianity">Kristian</SelectItem>
                  <SelectItem value="hinduism">Hindu</SelectItem>
                  <SelectItem value="other">Lain-lain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Race / Descendants */}
            <div className="space-y-2">
              <Label>Bangsa <span className="text-red-600">*</span></Label>
              <Select value={formData.race} onValueChange={(v) => handleInputChange("race", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sila Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(racesConst).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Phone */}
            <div className="space-y-2">
              <Label>No. Telefon Bimbit <span className="text-red-600">*</span></Label>
              <Input
                type="tel"
                value={formData.mobilePhone}
                onChange={(e) => handleInputChange("mobilePhone", e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Sahkan No. Telefon Bimbit"
                value={formData.mobilePhoneConfirm}
                onChange={(e) => handleInputChange("mobilePhoneConfirm", e.target.value)}
                required
              />
            </div>

            {/* Office Phone */}
            <div className="space-y-2">
              <Label>No. Telefon Pejabat</Label>
              <Input
                type="tel"
                value={formData.officePhone}
                onChange={(e) => handleInputChange("officePhone", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Alamat <span className="text-red-600">*</span></Label>
              {[1, 2, 3, 4, 5].map((i) => (
                <Input
                  key={i}
                  type="text"
                  value={formData[`address${i}` as keyof FormData] as string}
                  onChange={(e) => handleInputChange(`address${i}` as keyof FormData, e.target.value)}
                />
              ))}

              {/* Confirm Fields */}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label>Nama Penuh <span className="text-red-600">*</span></Label>
              <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Emel <span className="text-red-600">*</span></Label>
              <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
            </div>

            {/* Confirm Email */}
            <div className="space-y-2">
              <Label>Confirm Emel <span className="text-red-600">*</span></Label>
              <Input type="email" value={formData.emailConfirm} onChange={(e) => handleInputChange("emailConfirm", e.target.value)} required />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Kata Laluan <span className="text-red-600">*</span></Label>
              <Input type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Kata Laluan <span className="text-red-600">*</span></Label>
              <Input type="password" value={formData.passwordConfirm} onChange={(e) => handleInputChange("passwordConfirm", e.target.value)} required />
            </div>

            {/* Postcode and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Poskod <span className="text-red-600">*</span></Label>
                <Input value={formData.postcode} onChange={(e) => handleInputChange("postcode", e.target.value)} required />
              </div>
              <div>
                <Label>Negeri <span className="text-red-600">*</span></Label>
                <Select value={formData.state} onValueChange={(v) => {
                  // When state changes, clear district to avoid mismatch
                  handleInputChange("state", v)
                  handleInputChange("district", "")
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sila Pilih Negeri" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(states).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label>Daerah <span className="text-red-600">*</span></Label>
              <Select value={formData.district} onValueChange={(v) => handleInputChange("district", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sila Pilih Daerah" />
                </SelectTrigger>
                <SelectContent>
                  {(stateDistrictsMap[formData.state as keyof typeof stateDistrictsMap]?.districts || []).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-police-blue" disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : "Daftar"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <WarningModal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} onContinue={handleModalContinue} />
    </>
  )
}

