import { Header } from "@/components/header/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function PeringatanPage() {
  return (
    <div className="min-h-screen police-gradient">

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <CardTitle className="text-3xl font-bold text-[#1a1a4d]">Peringatan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Sistem e-Reporting ini adalah untuk membuat laporan polis bagi kes kehilangan dokumen atau barang yang
                tidak berkait dengan jenayah sahaja.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="font-semibold text-amber-900 mb-2">Sila ambil perhatian:</p>
                <ul className="list-disc list-inside space-y-2 text-amber-900">
                  <li>Laporan yang dibuat adalah untuk tujuan dokumentasi sahaja</li>
                  <li>Laporan palsu adalah satu kesalahan di bawah undang-undang</li>
                  <li>Maklumat yang diberikan mestilah tepat dan benar</li>
                  <li>Laporan yang melibatkan jenayah perlu dibuat di balai polis</li>
                </ul>
              </div>

              <p>
                Untuk sebarang pertanyaan atau bantuan, sila hubungi talian helpline kami atau layari balai polis yang
                berhampiran.
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-white/80 space-y-1">
          <p className="text-sm">Helpline:</p>
          <p className="text-sm">sdas@rmp.gov.my</p>
          <p className="text-sm">03-91065731 / 03-91065732 / 03-91065735 / 03-91065736</p>
        </footer>
      </main>
    </div>
  )
}
