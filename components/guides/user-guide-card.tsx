import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function UserGuideCard() {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Panduan Pengguna</h2>
      <p className="text-gray-600 text-sm mb-4">Klik untuk melihat dokumentasi penuh</p>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
        <FileText className="w-4 h-4 mr-2" />
        Panduan Pengguna
      </Button>
    </Card>
  )
}
