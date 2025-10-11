"use client"

import { Button } from "@/components/ui/button"

export function ConfirmationForm({ onBack, onSubmit, data }: { onBack: () => void; onSubmit: () => void; data?: any }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Declaration</h2>
        <p className="text-sm text-gray-700 mb-4">
          I declare that the information provided is true and accurate. I grant permission for this report to be used by the relevant authorities.
        </p>
      </div>

      <div className="flex justify-between">
  <Button onClick={onBack} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2">{`« Back`}</Button>
  <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2">Submit Report</Button>
      </div>
    </div>
  )
}
