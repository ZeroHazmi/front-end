'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data for the report
const reportData = {
  reportId: "REP12345",
  dateCreated: new Date("2023-11-24T10:30:00"),
  status: "In Progress",
  priority: "High",
  incidentDateTime: new Date("2023-11-23T18:45:00"),
  address: "123 Main St, Anytown, AN 12345",
  transcript: "At approximately 6:45 PM, I witnessed a suspicious individual lurking around the neighborhood. The person was wearing dark clothing and appeared to be looking into car windows...",
  policeNotes: ""
}

type UserRole = 'user' | 'admin' | 'police'

interface ViewReportProps {
  userRole: UserRole
}

export default function ViewReport({ userRole }: ViewReportProps) {
  const [status, setStatus] = useState(reportData.status)
  const [priority, setPriority] = useState(reportData.priority)
  const [policeNotes, setPoliceNotes] = useState(reportData.policeNotes)
  const [isEditing, setIsEditing] = useState(false)

  const isPolice = userRole === 'police'
  const canEdit = isPolice

  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  const handlePriorityChange = (value: string) => {
    setPriority(value)
  }

  const handlePoliceNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPoliceNotes(event.target.value)
  }

  const handleEditToggle = () => {
    if (canEdit) {
      setIsEditing(!isEditing)
    }
  }

  const handleSaveChanges = () => {
    // Here you would typically make an API call to update the report
    console.log('Saving changes:', { status, priority, policeNotes })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>View Report</CardTitle>
              <CardDescription>Report details and management</CardDescription>
            </div>
            {canEdit && (
              <Button onClick={handleEditToggle} variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel Edit' : 'Edit Report'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <div>
                <Label className="font-bold">Report ID</Label>
                <p>{reportData.reportId}</p>
              </div>
              <div>
                <Label className="font-bold">Date Created</Label>
                <p>{format(reportData.dateCreated, 'PPP')}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="w-1/3">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange} value={status} disabled={!isEditing || !canEdit}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/3">
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={handlePriorityChange} value={priority} disabled={!isEditing || !canEdit}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="font-bold">Date and Time of Incident</Label>
              <p>{format(reportData.incidentDateTime, 'PPP p')}</p>
            </div>

            <div>
              <Label className="font-bold">Address</Label>
              <p>{reportData.address}</p>
            </div>

            <div>
              <Label className="font-bold">Transcript</Label>
              <p className="mt-2 whitespace-pre-wrap">{reportData.transcript}</p>
            </div>

            <div>
              <Label htmlFor="policeNotes" className="font-bold">Police Notes</Label>
              <Textarea
                id="policeNotes"
                placeholder="Add additional notes or details here..."
                value={policeNotes}
                onChange={handlePoliceNotesChange}
                disabled={!isEditing || !canEdit}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Back to Reports</Button>
          {isEditing && canEdit && (
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}