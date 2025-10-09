import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

export function VideoTutorialCard() {
  const videos = [
    "Laporan Kemalangan Jalan Raya",
    "Pendaftaran",
    "Log Masuk",
    "Terlupa Kata Laluan",
    "Kemas Kini Kata Laluan",
    "Log Keluar",
    "Cetak Repot",
  ]

  return (
    <Card className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Video Tutorial</h2>
      <p className="text-gray-600 text-sm mb-4">Panduan visual untuk membuat laporan kemalangan jalan raya</p>
      <ul className="space-y-3">
        {videos.map((video, index) => (
          <li key={index}>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm">
              <Play className="w-4 h-4 fill-current" />
              {video}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
