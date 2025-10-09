import type React from "react"
import { User, MapPin, FileEdit, CheckCircle, Printer } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    id: 1,
    title: "Butiran Peribadi",
    description: "Semak maklumat peribadi anda.",
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Butiran Kejadian",
    description: "Masukkan maklumat kejadian.",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "Keterangan Kejadian",
    description: "Terangkan apa yang berlaku.",
    icon: <FileEdit className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Perakuan",
    description: "Sahkan bahawa maklumat anda betul.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    id: 5,
    title: "Cetak Repot",
    description: "Cetak laporan anda untuk simpanan.",
    icon: <Printer className="w-6 h-6" />,
  },
]

interface ReportStepperProps {
  currentStep: number
}

export function ReportStepper({ currentStep }: ReportStepperProps) {
  return (
    // Make the sidebar occupy full viewport height and stick while content scrolls
    <aside className="w-[390px] bg-[#0f1654] h-screen sticky top-0 p-8">
      <h2 className="text-white text-4xl font-bold mb-12">e-Reporting</h2>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep

          return (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[23px] top-[56px] w-[2px] h-[40px] bg-[#2a3580]" />
              )}

              <div className={`flex items-start gap-4 ${isActive ? "opacity-100" : "opacity-50"}`}>
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-[#3b82f6]" : "bg-[#2a3580]"
                  }`}
                >
                  {step.icon}
                </div>

                <div className="flex-1 pt-1">
                  <h3 className="text-white font-semibold text-base mb-1">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
