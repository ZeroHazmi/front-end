"use client"

import { useState } from "react"

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState("kemalangan")

  return (
    <div className="container mx-auto px-4 pt-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("kemalangan")}
          className={`px-6 py-2.5 rounded-t-lg font-medium transition-colors ${
            activeTab === "kemalangan" ? "bg-blue-500 text-white" : "bg-[#2a3580] text-white/80 hover:bg-[#3a4590]"
          }`}
        >
          Laporan Kemalangan Jalan Raya
        </button>
        <button
          onClick={() => setActiveTab("lain")}
          className={`px-6 py-2.5 rounded-t-lg font-medium transition-colors ${
            activeTab === "lain" ? "bg-blue-500 text-white" : "bg-[#2a3580] text-white/80 hover:bg-[#3a4590]"
          }`}
        >
          Laporan Polis Lain-Lain
        </button>
      </div>
    </div>
  )
}
