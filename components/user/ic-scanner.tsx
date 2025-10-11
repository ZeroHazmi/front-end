"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { states } from "@/types/constants"
import { Camera, X, Upload, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FileUploadScanner from '@/components/Form/ImageAnalysisForm'
import { useToast } from "@/hooks/use-toast"

interface IcScannerProps {
  onScanComplete: (data: any) => void
}

export function IcScanner({ onScanComplete }: IcScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isCameraDenied, setIsCameraDenied] = useState(false)
  const [permissionState, setPermissionState] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [showRawResponse, setShowRawResponse] = useState(false)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const startCamera = async () => {
    try {
      if (!navigator?.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported')
      }
      // Try to request the environment-facing camera. On some browsers autoplay
      // will be blocked unless the video is muted; we'll mute programmatically
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        // set muted to allow autoplay in some browsers
        try { videoRef.current.muted = true } catch (e) {}
        // Try to play the video to satisfy autoplay policies
        try {
          await videoRef.current.play()
        } catch (playErr) {
          // ignore; user may need to interact before playback
          console.debug('video play() failed:', playErr)
        }
      }
      setIsCameraActive(true)
      setIsCameraDenied(false)
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      // detect denied/permission errors
      const name = (error as any)?.name || ''
      if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
        setIsCameraDenied(true)
        toast({ title: "Camera permission denied", description: "Please allow camera access in your browser settings and try again, or upload an image as an alternative.", variant: "destructive" })
      } else {
        toast({ title: "Camera access failed", description: "Unable to access the camera. Please ensure camera permission is granted or use Upload Image on mobile devices.", variant: "destructive" })
      }
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
    // capture from video into canvas and open preview for confirm
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const vw = video.videoWidth || video.clientWidth || 1280
      const vh = video.videoHeight || video.clientHeight || Math.round(vw * 0.75)
      canvas.width = vw
      canvas.height = vh
      const ctx = canvas.getContext("2d")
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        } catch (e) {
          ctx.drawImage(video, 0, 0)
        }
        // create preview and blob
        canvas.toBlob((b) => {
          if (b) {
            const url = URL.createObjectURL(b)
            setPreviewDataUrl(url)
            setPreviewBlob(b)
            setIsPreviewMode(true)
            // stop camera preview but keep dialog open so user can confirm/retake
            stopCamera()
          }
        }, "image/jpeg", 0.92)
      }
    }
  }

  const processIcScan = async (blobArg?: Blob | null) => {
    try {
      setIsProcessing(true)
      let blob: Blob | null = blobArg || null
      if (!blob) {
        if (!canvasRef.current) throw new Error('No image available to process')
        blob = await new Promise<Blob | null>((resolve) => canvasRef.current!.toBlob(resolve, 'image/jpeg', 0.95))
      }
      if (!blob) throw new Error('Failed to generate image from source')

      // create a File so fetch/FormData includes a filename
      const file = new File([blob], 'ic.jpg', { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', file)

      // call pixlab proxy
      const resp = await fetch('/api/pixLabProxy', {
        method: 'POST',
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
        toast({ title: "Scan error", description: data?.error || "Scanner service returned an error. Please try again.", variant: "destructive" })
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
  toast({ title: "Scan successful", description: "Fields have been filled automatically.", variant: "default" })

      // stop camera and close dialog after successful scan
      // revoke preview URL
      if (previewDataUrl) {
        try { URL.revokeObjectURL(previewDataUrl) } catch (e) {}
      }
      setPreviewDataUrl(null)
      setPreviewBlob(null)
      setIsPreviewMode(false)
      handleClose()
    } catch (error) {
  console.error("[v1] Error processing IC scan:", error)
  toast({ title: "Error", description: "An error occurred while processing the scan. Please try again or enter details manually.", variant: "destructive" })
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
      // Instead of immediately uploading, create a preview (fix orientation), then let user confirm
      ;(async () => {
        setIsProcessing(true)
        try {
          // read file ArrayBuffer to detect EXIF orientation
          const arr = await file.arrayBuffer()
          const orientedBlob = await (async function applyOrientation(buf: ArrayBuffer, srcFile: File) {
            // helper to read orientation
            const getOrientation = (arrayBuffer: ArrayBuffer) => {
              const view = new DataView(arrayBuffer)
              if (view.getUint16(0, false) !== 0xffd8) return -2
              let offset = 2
              const length = view.byteLength
              while (offset < length) {
                const marker = view.getUint16(offset, false)
                offset += 2
                if (marker === 0xffe1) {
                  if (view.getUint32(offset += 2, false) !== 0x45786966) return -1
                  const little = view.getUint16(offset += 6, false) === 0x4949
                  offset += view.getUint32(offset + 4, little)
                  const tags = view.getUint16(offset, little)
                  offset += 2
                  for (let i = 0; i < tags; i++) {
                    if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                      return view.getUint16(offset + (i * 12) + 8, little)
                    }
                  }
                } else if ((marker & 0xff00) !== 0xff00) break
                else offset += view.getUint16(offset, false)
              }
              return -1
            }

            const orientation = getOrientation(buf)

            // If no orientation to fix, return original file as blob
            if (!srcFile.type.includes('jpeg') && !srcFile.type.includes('jpg')) {
              return srcFile
            }

            // load image into HTMLImageElement
            const blob = new Blob([buf], { type: srcFile.type })
            const url = URL.createObjectURL(blob)
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
              const i = document.createElement('img') as HTMLImageElement
                i.onload = () => resolve(i)
                i.onerror = reject
                i.src = url
            })

            // draw into canvas with rotation if needed
            const cvs = document.createElement('canvas')
            const ctx = cvs.getContext('2d')!
            const w = img.naturalWidth
            const h = img.naturalHeight
            if (orientation >= 5 && orientation <= 8) {
              cvs.width = h
              cvs.height = w
            } else {
              cvs.width = w
              cvs.height = h
            }
            // transform context
            switch (orientation) {
              case 2: ctx.transform(-1, 0, 0, 1, w, 0); break
              case 3: ctx.transform(-1, 0, 0, -1, w, h); break
              case 4: ctx.transform(1, 0, 0, -1, 0, h); break
              case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
              case 6: ctx.transform(0, 1, -1, 0, h, 0); break
              case 7: ctx.transform(0, -1, -1, 0, h, w); break
              case 8: ctx.transform(0, -1, 1, 0, 0, w); break
              default: break
            }
            ctx.drawImage(img, 0, 0)
            const outBlob: Blob | null = await new Promise((res) => cvs.toBlob(res, 'image/jpeg', 0.92))
            URL.revokeObjectURL(url)
            return outBlob || srcFile
          })(arr, file)

          // create preview URL to let user confirm
          const b = orientedBlob instanceof Blob ? orientedBlob : new Blob([orientedBlob], { type: file.type })
          const url = URL.createObjectURL(b)
          setPreviewDataUrl(url)
          setPreviewBlob(b)
          setIsPreviewMode(true)
          // if camera was active, stop it to show preview
          stopCamera()
        } catch (err) {
          console.error('Error preparing preview for upload:', err)
          toast({ title: 'Error', description: 'An error occurred while preparing the image preview. Please try again.', variant: 'destructive' })
        } finally {
          setIsProcessing(false)
        }
      })()
    }
  }

  const handleConfirmPreview = async () => {
    // User confirmed preview; process upload using previewBlob
    if (!previewBlob) return
    try {
      setIsProcessing(true)
      await processIcScan(previewBlob)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetake = () => {
    // clear preview and reactivate camera (if supported)
    if (previewDataUrl) {
      try { URL.revokeObjectURL(previewDataUrl) } catch (e) {}
    }
    setPreviewDataUrl(null)
    setPreviewBlob(null)
    setIsPreviewMode(false)
    // attempt to restart camera if available
    startCamera().catch(() => {})
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Optional: query permission status when component mounts / when dialog opens
  const checkPermission = async () => {
    try {
      if ((navigator as any).permissions && (navigator as any).permissions.query) {
        // "camera" name is not supported in all browsers; try "camera" then fallback to "microphone" or generic
        try {
          const p = await (navigator as any).permissions.query({ name: 'camera' })
          setPermissionState(p.state)
          p.onchange = () => setPermissionState(p.state)
        } catch (_) {
          // some browsers don't support camera permission query; ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    if (isOpen) {
      checkPermission()
    }
    // if dialog closed, reset denied hint
    if (!isOpen) {
      setIsCameraDenied(false)
    }
  }, [isOpen])

  return (
    <>
      <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Scan Identity Card (IC)</h3>
          <p className="text-sm text-gray-600">
            Use your camera to scan your identity card. Fields will be filled automatically.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-2"
        >
          <Camera className="w-4 h-4" />
          Scan ID
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={(open: boolean) => {
        if (!open) handleClose()
        else setIsOpen(true)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Identity Card</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
                {isPreviewMode && previewDataUrl ? (
              <div className="space-y-4 text-center">
                <div className="bg-gray-100 p-2 rounded">
                  <div className="relative w-full flex items-center justify-center" style={{ minHeight: 200 }}>
                    {/* use native img for blob/data URLs (Next Image doesn't support blob: URLs reliably) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewDataUrl} alt="IC Preview" className="object-contain max-h-[320px] w-auto" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleConfirmPreview} className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8]" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Camera className="w-5 h-5 mr-2" />}
                    {isProcessing ? 'Processing...' : 'Confirm & Scan'}
                  </Button>
                  <Button onClick={handleRetake} variant="outline" className="flex-1 bg-transparent" disabled={isProcessing}>
                    <X className="w-5 h-5 mr-2" />
                    Retake
                  </Button>
                </div>
              </div>
            ) : !isCameraActive ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button onClick={startCamera} className="w-full gap-2 bg-[#2563eb] hover:bg-[#1d4ed8]">
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </Button>

                  <div className="relative">
                    <input
                      ref={fileInputRef as any}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="ic-upload"
                    />
                    <Button type="button" variant="outline" className="w-full gap-2 bg-transparent" onClick={triggerFileInput}>
                      <Upload className="w-5 h-5" />
                      Upload ID Image
                    </Button>
                  </div>
                </div>

                {isCameraDenied && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <div className="font-semibold text-sm text-yellow-800">Camera permission required</div>
                    <div className="text-sm text-yellow-700 mt-1">Please allow camera access in your browser settings to use the scanner. You can try again with the button below or upload an image instead.</div>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => { setIsCameraDenied(false); startCamera(); }} className="bg-yellow-600 text-white">Request Permission Again</Button>
                      <Button variant="outline" onClick={triggerFileInput}>Upload Instead</Button>
                    </div>
                  </div>
                )}

                {isCameraDenied && (
                  <div className="mt-4">
                    {/* render the robust file-upload based scanner as a fallback */}
                    <FileUploadScanner onScanComplete={onScanComplete} />
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Guidelines:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Make sure the ID card is well-lit and clear</li>
                    <li>Place the ID card on a flat surface</li>
                    <li>Ensure all information is visible</li>
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
                    {isProcessing ? "Processing..." : "Capture Image"}
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent" disabled={isProcessing}>
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                </div>

                <p className="text-sm text-center text-gray-600">
                  Place the ID card inside the blue box and press the button to capture the image
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
