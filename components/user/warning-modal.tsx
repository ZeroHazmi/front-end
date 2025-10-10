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
          <h2 className="text-3xl font-bold text-red-600 mb-6">Notice</h2>

          {/* Main Notice (short) */}
          <div className="mb-4 space-y-2">
            <p className="text-base leading-relaxed">
              For emergencies, please contact the police station or emergency services first.
            </p>
            <p className="text-sm text-gray-600">Use this form only for non-emergency reports.</p>
          </div>

          {/* Short bullets */}
          <ul className="mb-4 space-y-2 list-disc list-inside text-base">
            <li>Do not use this form for situations requiring immediate action.</li>
            <li>Ensure information is accurate — false reports may lead to legal action.</li>
          </ul>

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
                I am 18 years old or older and a citizen of Malaysia.
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
                I confirm that this report does not involve any criminal elements.
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
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!checkbox1 || !checkbox2}
              className="px-8 py-6 text-base bg-[#2563eb] hover:bg-[#1d4ed8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}