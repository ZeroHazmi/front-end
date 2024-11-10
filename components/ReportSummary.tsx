'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, MapPin, FileText, List } from "lucide-react"
import { useRouter } from 'next/navigation'
import UserNavBar from '@/components/userNavBar'

export default function ReportSummary() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    router.push('/report-submitted')
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <UserNavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Report Summary</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2" />
              Incident Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              Map Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="mr-2" />
              Key Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Traffic accident occurred at Main St. and Oak Ave.</li>
              <li>Red sedan ran a red light, collided with blue SUV.</li>
              <li>Minor injuries reported, one person hospitalized.</li>
              <li>Eyewitnesses corroborated the events.</li>
              <li>No signs of impairment in drivers.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" />
              Report Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              On June 15, 2023, at 2:30 PM, a traffic accident occurred at Main St. and Oak Ave. 
              A red sedan ran a red light and collided with a blue SUV. The sedan driver had minor injuries, 
              while the SUV driver was taken to the hospital with non-life-threatening injuries. 
              Eyewitnesses confirmed the sedan failed to stop at the red light. Both drivers passed field sobriety tests. 
              The intersection was closed for two hours for investigation and cleanup.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button 
            onClick={() => router.back()} 
            variant="outline"
            className="bg-white text-police-blue hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Edit Report
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-police-blue hover:bg-[#0022AA] text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'} 
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </main>
    </div>
  )
}