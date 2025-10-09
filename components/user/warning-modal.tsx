"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export function WarningModal({ isOpen, onClose, onContinue }: WarningModalProps) {
  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)

  if (!isOpen) return null

  const handleContinue = () => {
    if (checkbox1 && checkbox2) {
      onContinue()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-red-600 mb-6">Peringatan</h2>

          {/* Main Notice */}
          <div className="mb-6 space-y-2">
            <p className="text-base leading-relaxed">
              Anda dinasihatkan menghubungi Pusat Kawalan Malaysia di talian{" "}
              <span className="font-semibold">03-2266 3333 / 03-2031 9999, 999</span> atau{" "}
              <span className="font-semibold">Balai Polis berhampiran</span>.
            </p>
            <p className="text-base font-semibold">Bagi Kes-kes Kecemasan seperti berikut :</p>
          </div>

          {/* Emergency Cases List */}
          <ol className="mb-6 space-y-2 list-decimal list-inside text-base">
            <li>Kes yang MEMERLUKAN tindakan segera Polis;</li>
            <li>Kes yang sedang berlaku;</li>
            <li>Saspek masih berada di tempat kejadian atau berhampiran;</li>
            <li>Nyawa seseorang sedang terancam;</li>
            <li>Kes orang hilang;</li>
            <li>
              Bukti fizikal (termasuk darah, cap jari atau apa-apa barang) yang ditinggalkan di tempat kejadian
              jenyayah; atau
            </li>
            <li>
              Sekiranya pihak berkenaan memerlukan pengesahan laporan polis, anda perlu mendapatkan tandatangan
              pegawai/Ketua Polis Balai di balai berkenaan.
            </li>
          </ol>

          {/* Warning Section */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Amaran</h3>
            <ul className="space-y-4 text-base">
              <li>
                <span className="font-semibold">Seksyen 182, Kanun Keseksaan (Akta 574). Memberi maklumat palsu.</span>{" "}
                Membawa hukuman maksimum 6 bulan penjara, atau denda yang boleh sampai dua ribu ringgit (RM2,000.00),
                atau kedua-duanya sekali.
              </li>
              <li>
                <span className="font-semibold">
                  Seksyen 233, Akta Komunikasi dan Multimedia 1998. Menggunakan kemudahan rangkaian untuk menghantar
                  apa-apa komen, permintaan, cadangan atau komunikasi yang palsu.
                </span>{" "}
                Membawa hukuman maksimum 1 tahun penjara, atau denda yang boleh sampai lima puluh ribu ringgit
                (RM50,000.00) atau kedua-duanya sekali dan boleh didenda selanjutnya satu ribu ringgit (RM1,000.00) bagi
                setiap hari kesalahan itu diteruskan selepas disabitkan kesalahan.
              </li>
            </ul>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-8 border-t pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="checkbox1"
                checked={checkbox1}
                onCheckedChange={(checked) => setCheckbox1(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="checkbox1" className="text-base leading-relaxed cursor-pointer">
                Saya berumur 18 tahun dan ke atas serta warganegara Malaysia.
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="checkbox2"
                checked={checkbox2}
                onCheckedChange={(checked) => setCheckbox2(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="checkbox2" className="text-base leading-relaxed cursor-pointer">
                Saya mengesahkan bahawa laporan polis yang saya buat ini tidak melibat sebarang unsur jenayah.
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-8 py-6 text-base bg-gray-300 hover:bg-gray-400 text-gray-800 border-0"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!checkbox1 || !checkbox2}
              className="px-8 py-6 text-base bg-[#2563eb] hover:bg-[#1d4ed8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sambung
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}