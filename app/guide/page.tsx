import { Header } from "@/components/header/header"
import { TabNavigation } from "@/components/guides/tab-navigation"
import { StepsCard } from "@/components/guides/steps-card"
import { UserGuideCard } from "@/components/guides/user-guide-card"
import { VideoTutorialCard } from "@/components/guides/video-tutorial-card"
import { Footer } from "@/components/header/footer"

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#1a2470] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 border-2 border-blue-400 rounded-full" />
        <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-blue-400 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 border-2 border-blue-400 rounded-full" />
      </div>

      <div className="relative z-10">
        <TabNavigation />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StepsCard />
            </div>
            <div className="space-y-6">
              <UserGuideCard />
              <VideoTutorialCard />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
