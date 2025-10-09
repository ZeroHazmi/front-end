import { Header } from "@/components/header/header"
import { LoginCard } from "@/components/user/login-card"
import { InfoCard } from "@/components/user/info-card"

export default function LegacyHome() {
  return (
    <div className="min-h-screen bg-[#1a2470] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 border-2 border-blue-400 rounded-full" />
        <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-blue-400 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 border-2 border-blue-400 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 border-2 border-blue-400 rounded-full" />
      </div>

      <div className="relative z-10">
            <main className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <InfoCard />
            <LoginCard />
          </div>
        </main>
      </div>
    </div>
  )
}
