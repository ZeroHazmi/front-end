"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { states } from "@/types/constants"
import { Camera, X, Upload, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface IcScannerProps {
  onScanComplete: (data: any) => void
}

export function IcScanner({ onScanComplete }: IcScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [showRawResponse, setShowRawResponse] = useState(false)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      toast({ title: "Akses Kamera Gagal", description: "Tidak dapat mengakses kamera. Sila pastikan kebenaran kamera telah diberikan.", variant: "destructive" })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        processIcScan()
      }
    }
  }

  const processIcScan = async () => {
    if (!canvasRef.current) return
    try {
      setIsProcessing(true)
      const canvas = canvasRef.current

      // convert canvas to blob
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95))
      if (!blob) {
        throw new Error("Gagal menghasilkan imej daripada kanvas")
      }

      // create a File so fetch/FormData includes a filename
      const file = new File([blob], "ic.jpg", { type: "image/jpeg" })

      const formData = new FormData()
      formData.append("file", file)

      // call pixlab proxy
      const resp = await fetch("/api/pixLabProxy", {
        method: "POST",
        body: formData,
      })

      const data = await resp.json()
      // store raw response for debugging and log
      setRawResponse(data)
      console.debug("PixLab raw response:", data)
      try {
        console.log("PixLab raw response (formatted):", JSON.stringify(data, null, 2))
      } catch (e) {
        console.log("PixLab raw response:", data)
      }

      if (!resp.ok) {
        console.error("Pixlab proxy error:", data)
        toast({ title: "Ralat Pengimbasan", description: data?.error || "Ralat daripada perkhidmatan pengimbasan. Sila cuba lagi.", variant: "destructive" })
        return
      }

  // PixLab proxy now returns a normalized shape at top-level. Prefer that (data)
  // but fall back to extractedFields/fields if present for backward compatibility.
  const payload: any = data || {}
  const extracted = data?.extractedFields || data?.fields || payload

      // Helper: normalize common date formats to YYYY-MM-DD
      const normalizeDate = (d?: string) => {
        if (!d) return ""
        d = d.toString().trim()
        // If already ISO-like
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
        // DD/MM/YYYY or DD-MM-YYYY
        let m
        if ((m = d.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/))) {
          const dd = m[1].padStart(2, "0")
          const mm = m[2].padStart(2, "0")
          const yyyy = m[3]
          return `${yyyy}-${mm}-${dd}`
        }
        // YYYYMMDD
        if ((m = d.match(/^(\d{4})(\d{2})(\d{2})$/))) {
          return `${m[1]}-${m[2]}-${m[3]}`
        }
        // Try parsing with Date
        const parsed = new Date(d)
        if (!Number.isNaN(parsed.getTime())) {
          const yyyy = parsed.getFullYear()
          const mm = String(parsed.getMonth() + 1).padStart(2, "0")
          const dd = String(parsed.getDate()).padStart(2, "0")
          return `${yyyy}-${mm}-${dd}`
        }
        return ""
      }

      const addressText = [
        payload.address,
        extracted.fullAddress,
        extracted.fullAddressText,
        data?.fullAddress,
        data?.address,
        data?.mrzRawText,
        extracted.issuingState,
      ]
        .filter(Boolean)
        .join(" ")

      // Try to find postcode (Malaysia uses 5-digit postcodes)
      const postcodeMatch = addressText.match(/\b(\d{5})\b/)
      const postcode = postcodeMatch ? postcodeMatch[1] : ""

      // Detect state using fuzzy matching including substring and Levenshtein fallback
      let detectedStateKey = ""
      if (addressText) {
        const lower = addressText.toLowerCase()

        // quick substring match first
        for (const [k, label] of Object.entries(states)) {
          if (label && lower.includes(String(label).toLowerCase())) {
            detectedStateKey = k
            break
          }
        }

        // if not found, try fuzzy matching (Levenshtein distance) on labels
        if (!detectedStateKey) {
          const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
          const candidates = Object.entries(states).map(([k, label]) => ({ key: k, label: String(label) }))
          const target = normalize(addressText)
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
          // accept best candidate if normalized distance is reasonable
          if (best && best.score < 0.45) detectedStateKey = best.key
        }
      }

      // Normalize gender values
  const rawGender = (payload.sex || extracted.sex || data?.sex || extracted.gender || "").toString().trim()
      let genderKey = ""
      if (rawGender) {
        const g = rawGender.toLowerCase()
        if (g.startsWith("m") || g === "male") genderKey = "male"
        else if (g.startsWith("f") || g === "female") genderKey = "female"
        else genderKey = g
      }

      // prefer explicit fields from extracted object
      const result: any = {
        name: payload.name || extracted.fullName || extracted.full_name || data?.fullName || "",
        icNumber: payload.icNumber || extracted.documentNumber || extracted.document_number || data?.documentNumber || "",
        dateOfBirth:
          normalizeDate(payload.dateOfBirth || extracted.dateOfBirth || extracted.date_of_birth || data?.dateOfBirth || extracted.dob || ""),
        gender: genderKey,
        nationality: payload.nationality || extracted.nationality || data?.nationality || "",
        dateOfExpiry: normalizeDate(payload.dateOfExpiry || extracted.dateOfExpiry || extracted.date_of_expiry || data?.dateOfExpiry || ""),
        issuingCountry: extracted.issuingCountry || extracted.issuing_country || data?.issuingCountry || "",
        issuingState: extracted.issuingState || extracted.issuing_state || "",
        personalNumber: extracted.personalNumber || extracted.personal_number || "",
        finalCheckDigit: extracted.finalCheckDigit || extracted.finalcheckDigit || "",
        religion: payload.religion || extracted.religion || "",
        address: addressText || "",
        postcode,
        state: detectedStateKey || "",
      }

      // Pass the mapped result back to the parent form
      onScanComplete(result)

      // log mapped result for debugging
      try {
        console.log("PixLab mapped result:", JSON.stringify(result, null, 2))
      } catch (e) {
        console.log("PixLab mapped result:", result)
      }

      // show success toast
      toast({ title: "Imbasan Berjaya", description: "Maklumat telah diisi secara automatik.", variant: "default" })

      // stop camera and close dialog after successful scan
      handleClose()
    } catch (error) {
      console.error("[v1] Error processing IC scan:", error)
      toast({ title: "Ralat", description: "Ralat semasa memproses imbasan. Sila cuba lagi atau isi maklumat secara manual.", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    stopCamera()
    setIsOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      ;(async () => {
        setIsProcessing(true)
        try {
          const formData = new FormData()
          formData.append("file", file)

          const resp = await fetch("/api/pixLabProxy", {
            method: "POST",
            body: formData,
          })

          const data = await resp.json()
          // store raw response for debugging and log
          setRawResponse(data)
          console.debug("PixLab raw response (upload):", data)
          try {
            console.log("PixLab raw response (upload, formatted):", JSON.stringify(data, null, 2))
          } catch (e) {
            console.log("PixLab raw response (upload):", data)
          }
          if (!resp.ok) {
            console.error("Pixlab proxy error:", data)
            toast({ title: "Ralat Pengimbasan", description: data?.error || "Ralat daripada perkhidmatan pengimbasan. Sila cuba lagi.", variant: "destructive" })
            return
          }

          const payload: any = data || {}
          const extracted = data?.extractedFields || data?.fields || payload
          const result: any = {
            name: payload.name || extracted.fullName || data?.fullName || "",
            icNumber: payload.icNumber || extracted.documentNumber || data?.documentNumber || "",
            dateOfBirth: payload.dateOfBirth || extracted.dateOfBirth || "",
            gender: payload.gender || extracted.sex || extracted.gender || "",
            nationality: payload.nationality || extracted.nationality || "",
            address: payload.address || [extracted.address, extracted.fullAddress, data?.address].filter(Boolean).join(" "),
            postcode: payload.postcode || (data?.fullAddress || "").match(/\b(\d{5})\b/)?.[1] || "",
            state: payload.state || "",
          }

          // try detect state similar to processIcScan
          const lower = (result.address || "").toLowerCase()
          for (const [k, label] of Object.entries(states)) {
            if (label && lower.includes(String(label).toLowerCase())) {
              result.state = k
              break
            }
          }

          onScanComplete(result)
          try {
            console.log("PixLab mapped result (upload):", JSON.stringify(result, null, 2))
          } catch (e) {
            console.log("PixLab mapped result (upload):", result)
          }
          toast({ title: "Imbasan Berjaya", description: "Maklumat telah diisi secara automatik.", variant: "default" })
          handleClose()
        } catch (err) {
          console.error("Error uploading file for IC scan:", err)
          toast({ title: "Ralat Muat Naik", description: "Ralat semasa memuat naik gambar. Sila cuba lagi.", variant: "destructive" })
        } finally {
          setIsProcessing(false)
        }
      })()
    }
  }

  return (
    <>
      <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Imbas Kad Pengenalan (IC)</h3>
          <p className="text-sm text-gray-600">
            Gunakan kamera untuk mengimbas kad pengenalan anda. Maklumat akan diisi secara automatik.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-2"
        >
          <Camera className="w-4 h-4" />
          Imbas IC
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={(open: boolean) => {
        if (!open) handleClose()
        else setIsOpen(true)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Imbas Kad Pengenalan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!isCameraActive ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button onClick={startCamera} className="w-full gap-2 bg-[#2563eb] hover:bg-[#1d4ed8]">
                    <Camera className="w-5 h-5" />
                    Buka Kamera
                  </Button>

                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="ic-upload" />
                    <label htmlFor="ic-upload">
                      <Button type="button" variant="outline" className="w-full gap-2 bg-transparent" asChild>
                        <span>
                          <Upload className="w-5 h-5" />
                          Muat Naik Gambar IC
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Panduan:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Pastikan kad pengenalan berada dalam keadaan terang dan jelas</li>
                    <li>Letakkan kad pengenalan pada permukaan rata</li>
                    <li>Pastikan semua maklumat dapat dilihat dengan jelas</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                  <div className="absolute inset-0 border-4 border-blue-500 m-8 rounded-lg pointer-events-none" />
                </div>

                <div className="flex gap-3">
                  <Button onClick={captureImage} className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8]" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Camera className="w-5 h-5 mr-2" />}
                    {isProcessing ? "Memproses..." : "Ambil Gambar"}
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent" disabled={isProcessing}>
                    <X className="w-5 h-5 mr-2" />
                    Batal
                  </Button>
                </div>

                <p className="text-sm text-center text-gray-600">
                  Letakkan kad pengenalan dalam kotak biru dan tekan butang untuk mengambil gambar
                </p>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
