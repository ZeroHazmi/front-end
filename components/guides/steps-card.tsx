import { Card } from "@/components/ui/card"

export function StepsCard() {
  const steps = [
    "Layari sistem e-reporting (ereporting.rmp.gov.my)",
    "Daftar dan log masuk sistem e-reporting",
    "Semak butiran pengadu",
    "Masukkan butiran kejadian",
    "Masukkan keterangan kejadian",
    "Hantar butiran repot ke e-reporting PDRM",
  // MyBayar steps removed per request (payment handled outside this app)
  ]

  return (
    <Card className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Langkah-langkah membuat repot polis</h2>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="text-gray-800 leading-relaxed">
            <span className="font-medium">{index + 1}. </span>
            {step}
          </li>
        ))}
      </ol>
    </Card>
  )
}
