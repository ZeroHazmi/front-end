import type React from "react"
import { User, MapPin, FileEdit, CheckCircle, Printer, Menu, X } from "lucide-react"
import { useState } from "react"
import { useLanguage } from '@/contexts/LanguageContext'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const baseSteps = (t: any): Step[] => [
  {
    id: 1,
    title: t.step_title_personal,
    description: t.step_desc_personal,
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 2,
    title: t.step_title_incident,
    description: t.step_desc_incident,
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    id: 3,
    title: t.step_title_description,
    description: t.step_desc_description,
    icon: <FileEdit className="w-6 h-6" />,
  },
  {
    id: 4,
    title: t.step_title_declaration,
    description: t.step_desc_declaration,
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    id: 5,
    title: t.step_title_print,
    description: t.step_desc_print,
    icon: <Printer className="w-6 h-6" />,
  },
]

interface ReportStepperProps {
  currentStep: number
}

export function ReportStepper({ currentStep }: ReportStepperProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const steps = baseSteps(t)

  // Desktop sidebar (hidden on small screens)
  const desktop = (
    <aside className="hidden md:block w-[390px] bg-[#0f1654] h-screen sticky top-0 p-8">
      <h2 className="text-white text-4xl font-bold mb-12">{t.pras || 'PRAS'}</h2>

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

  // Mobile top drawer
  const mobile = (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} aria-label="Open steps" className="p-2 rounded-md bg-[#0f1654] text-white">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">{t.pras || 'PRAS'}</h2>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute left-0 top-0 right-0 bg-[#0f1654] text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Langkah</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md bg-white/10"><X className="w-5 h-5 text-white" /></button>
            </div>

            <div className="mt-4 space-y-4">
              {steps.map((step) => (
                <div key={step.id} className={`p-3 rounded ${step.id === currentStep ? 'bg-white/10' : 'bg-transparent'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#2a3580] flex items-center justify-center">{step.icon}</div>
                    <div>
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-sm text-gray-300">{step.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {desktop}
      {mobile}
    </>
  )
}
