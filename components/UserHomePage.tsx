import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, MicIcon, ShieldIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8 text-center">
        <ShieldIcon className="mx-auto h-16 w-16 text-blue-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Police Report Assistance System</h1>
        <p className="mt-2 text-lg text-gray-600">File your report quickly and easily</p>
      </header>

      <main className="mx-auto max-w-4xl">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Create a New Report</CardTitle>
            <CardDescription>Choose an option to begin your police report</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button 
              className="h-auto flex-col items-start p-4 text-left" 
              variant="outline"
            >
              <FileTextIcon className="mb-2 h-6 w-6" />
              <div className="font-semibold">Text Report</div>
              <p className="mt-1 text-sm text-gray-600">Type your report using our guided form</p>
            </Button>
            <Button 
              className="h-auto flex-col items-start p-4 text-left" 
              variant="outline"
            >
              <MicIcon className="mb-2 h-6 w-6" />
              <div className="font-semibold">Voice Report</div>
              <p className="mt-1 text-sm text-gray-600">Use speech-to-text to dictate your report</p>
            </Button>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="mb-4 text-sm text-gray-600">
              Our speech-to-text feature allows you to speak your report, which will be automatically transcribed. 
              You can review and edit the text before submission.
            </p>
            <Button className="w-full sm:w-auto">Start New Report</Button>
          </CardFooter>
        </Card>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>If this is an emergency, please call 911 immediately.</p>
        <p className="mt-2">© 2023 Police Department. All rights reserved.</p>
      </footer>
    </div>
  )
}