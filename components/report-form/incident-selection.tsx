"use client"

import { Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

const incidents = [
  {
    id: "hilang",
    title: "Hilang",
    icon: (
      <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="25" stroke="#4a5568" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="35" y="45" width="30" height="35" rx="2" stroke="#4a5568" strokeWidth="2" fill="none" />
        <line x1="40" y1="52" x2="60" y2="52" stroke="#4a5568" strokeWidth="1.5" />
        <line x1="40" y1="58" x2="60" y2="58" stroke="#4a5568" strokeWidth="1.5" />
        <circle cx="85" cy="50" r="15" stroke="#4a5568" strokeWidth="2" fill="none" />
        <path d="M95 60 L105 70" stroke="#4a5568" strokeWidth="3" strokeLinecap="round" />
        <circle cx="85" cy="50" r="5" fill="#4a5568" />
        <text x="85" y="53" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          ?
        </text>
      </svg>
    ),
  },
  {
    id: "bencana-alam",
    title: "Bencana Alam",
    icon: (
      <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="30" stroke="#4a5568" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="45" y="50" width="25" height="30" stroke="#4a5568" strokeWidth="2" fill="none" />
        <path d="M45 50 L57.5 30 L70 50" stroke="#4a5568" strokeWidth="2" fill="none" />
        <rect x="52" y="65" width="8" height="15" stroke="#4a5568" strokeWidth="1.5" fill="none" />
        <rect x="48" y="55" width="6" height="6" stroke="#4a5568" strokeWidth="1.5" fill="none" />
        <rect x="60" y="55" width="6" height="6" stroke="#4a5568" strokeWidth="1.5" fill="none" />
        <path d="M25 75 Q25 65 30 65 T35 75" stroke="#4a5568" strokeWidth="2" fill="none" />
        <circle cx="28" cy="60" r="8" fill="#4a5568" opacity="0.3" />
        <path d="M80 75 Q80 65 85 65 T90 75" stroke="#4a5568" strokeWidth="2" fill="none" />
        <circle cx="83" cy="60" r="8" fill="#4a5568" opacity="0.3" />
        <path d="M40 35 L45 40 L42 42 L47 47" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M75 35 L70 40 L73 42 L68 47" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "kemalangan-jalan-raya",
    title: "Kemalangan Jalan Raya",
    icon: (
      <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="85" rx="35" ry="8" fill="#4a5568" opacity="0.1" />
        <rect x="30" y="50" width="60" height="25" rx="8" stroke="#4a5568" strokeWidth="2" fill="none" />
        <path d="M35 50 Q40 35 50 35 L70 35 Q80 35 85 50" stroke="#4a5568" strokeWidth="2" fill="none" />
        <rect x="38" y="55" width="15" height="12" stroke="#4a5568" strokeWidth="1.5" fill="none" />
        <rect x="67" y="55" width="15" height="12" stroke="#4a5568" strokeWidth="1.5" fill="none" />
        <circle cx="42" cy="75" r="8" stroke="#4a5568" strokeWidth="2" fill="none" />
        <circle cx="42" cy="75" r="4" fill="#4a5568" />
        <circle cx="78" cy="75" r="8" stroke="#4a5568" strokeWidth="2" fill="none" />
        <circle cx="78" cy="75" r="4" fill="#4a5568" />
        <path d="M20 65 Q20 55 25 55 T30 65" stroke="#4a5568" strokeWidth="2" fill="none" />
        <circle cx="23" cy="50" r="8" fill="#4a5568" opacity="0.2" />
        <path d="M95 65 Q95 55 100 55 T105 65" stroke="#4a5568" strokeWidth="2" fill="none" />
        <circle cx="98" cy="50" r="8" fill="#4a5568" opacity="0.2" />
      </svg>
    ),
  },
]

export function IncidentSelection() {
  const router = useRouter()
  const [selectedIncident, setSelectedIncident] = useState<string>("")

  const [incidentDate, setIncidentDate] = useState("")
  const [incidentTime, setIncidentTime] = useState("")
  const [isPlusHighway, setIsPlusHighway] = useState("")
  const [hasInjuryOrDeath, setHasInjuryOrDeath] = useState("")
  const [hasThirdParty, setHasThirdParty] = useState("")
  const [vehicleOwnership, setVehicleOwnership] = useState("")
  const [isCommercial, setIsCommercial] = useState("")
  const [frequency, setFrequency] = useState("")
  const [reportPurpose, setReportPurpose] = useState("")

  const handleIncidentSelect = (incidentId: string) => {
    setSelectedIncident(incidentId)
  }

  const handleSubmit = () => {
    if (!selectedIncident) {
      alert("Sila pilih jenis insiden")
      return
    }

    // Validate based on incident type
    if (selectedIncident === "kemalangan-jalan-raya") {
      if (
        !incidentDate ||
        !incidentTime ||
        !isPlusHighway ||
        !hasInjuryOrDeath ||
        !hasThirdParty ||
        !vehicleOwnership ||
        !isCommercial
      ) {
        alert("Sila jawab semua soalan")
        return
      }
    } else if (selectedIncident === "bencana-alam" || selectedIncident === "hilang") {
      if (!frequency || !reportPurpose) {
        alert("Sila jawab semua soalan")
        return
      }
    }

    // Navigate to report page with query parameters
    const params = new URLSearchParams()
    if (selectedIncident === "kemalangan-jalan-raya") {
      params.set("date", incidentDate)
      params.set("time", incidentTime)
      params.set("plusHighway", isPlusHighway)
      params.set("injuryOrDeath", hasInjuryOrDeath)
      params.set("thirdParty", hasThirdParty)
      params.set("ownership", vehicleOwnership)
      params.set("commercial", isCommercial)
    } else {
      params.set("frequency", frequency)
      params.set("purpose", reportPurpose)
    }

    router.push(`/dashboard/report/${selectedIncident}?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-12">
        <h1 className="text-2xl font-semibold text-[#1a2470]">
          Jawab soalan-soalan berikut sebelum membuat laporan polis :
        </h1>
        {/* <Link href="/panduan" className="flex items-center gap-2 text-[#3b82f6] hover:text-[#2563eb] font-medium">
          <Info className="w-5 h-5" />
          Panduan Pengguna
        </Link> */}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-[#1a2470] mb-6">1. Insiden apa yang berlaku?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map((incident) => (
            <button
              key={incident.id}
              onClick={() => handleIncidentSelect(incident.id)}
              className={`border-2 rounded-lg p-8 transition-all duration-200 flex flex-col items-center justify-center gap-4 min-h-[200px] ${
                selectedIncident === incident.id
                  ? "bg-[#3b82f6] border-[#3b82f6] shadow-lg"
                  : "bg-white border-gray-200 hover:border-[#3b82f6] hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-center">{incident.icon}</div>
              <span
                className={`font-medium text-center leading-relaxed ${
                  selectedIncident === incident.id ? "text-white" : "text-[#4a5568]"
                }`}
              >
                {incident.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedIncident === "kemalangan-jalan-raya" && (
        <div className="space-y-8 mb-8">
          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">2. Bilakah kemalangan berlaku?</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-48 pr-10"
                />
              </div>
              <div className="relative">
                <Input
                  type="time"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-48 pr-10"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-medium text-[#1a2470]">
                3. Adakah kemalangan ini berlaku di Lebuhraya PLUS ?
              </h2>
              <Info className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <RadioGroup value={isPlusHighway} onValueChange={setIsPlusHighway}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ya" id="plus-ya" />
                  <Label htmlFor="plus-ya">Ya</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tidak" id="plus-tidak" />
                  <Label htmlFor="plus-tidak">Tidak</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">
              4. Adakah kemalangan ini melibatkan kecederaan atau kematian ?
            </h2>
            <RadioGroup value={hasInjuryOrDeath} onValueChange={setHasInjuryOrDeath}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ya" id="injury-ya" />
                  <Label htmlFor="injury-ya">Ya</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tidak" id="injury-tidak" />
                  <Label htmlFor="injury-tidak">Tidak</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">
              5. Adakah kemalangan ini melibatkan pihak ketiga / harta awam ?
            </h2>
            <RadioGroup value={hasThirdParty} onValueChange={setHasThirdParty}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ya" id="third-ya" />
                  <Label htmlFor="third-ya">Ya</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tidak" id="third-tidak" />
                  <Label htmlFor="third-tidak">Tidak</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">6. Siapa yang memiliki kenderaan ini ?</h2>
            <RadioGroup value={vehicleOwnership} onValueChange={setVehicleOwnership}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="persendirian" id="owner-personal" />
                  <Label htmlFor="owner-personal">Persendirian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bukan-persendirian" id="owner-not-personal" />
                  <Label htmlFor="owner-not-personal">Bukan Persendirian</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">
              7. Adakah kenderaan ini diguna untuk ehailing atau tujuan komersial ?
            </h2>
            <RadioGroup value={isCommercial} onValueChange={setIsCommercial}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ya" id="commercial-ya" />
                  <Label htmlFor="commercial-ya">Ya</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tidak" id="commercial-tidak" />
                  <Label htmlFor="commercial-tidak">Tidak</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      {(selectedIncident === "bencana-alam" || selectedIncident === "hilang") && (
        <div className="space-y-8 mb-8">
          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">2. Berapa kali kejadian berlaku?</h2>
            <RadioGroup value={frequency} onValueChange={setFrequency}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pertama-kali" id="freq-first" />
                  <Label htmlFor="freq-first">Pertama Kali</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dua-kali" id="freq-twice" />
                  <Label htmlFor="freq-twice">Dua Kali</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lebih-dua-kali" id="freq-more" />
                  <Label htmlFor="freq-more">Lebih Dua Kali</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#1a2470] mb-4">3. Apakah tujuan laporan polis dibuat?</h2>
            <RadioGroup value={reportPurpose} onValueChange={setReportPurpose}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tukar-ganti" id="purpose-replace" />
                  <Label htmlFor="purpose-replace">Tukar ganti</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tuntutan" id="purpose-claim" />
                  <Label htmlFor="purpose-claim">Tuntutan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mahkamah" id="purpose-court" />
                  <Label htmlFor="purpose-court">Mahkamah</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="persendirian" id="purpose-personal" />
                  <Label htmlFor="purpose-personal">Persendirian</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-[#93c5fd] hover:bg-[#60a5fa] text-white px-12 py-6 text-base">
          OK
        </Button>
      </div>
    </div>
  )
}