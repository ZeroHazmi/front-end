'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Trash2, Eye } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import AddOfficerDialog from '@/components/dialog/AddOfficerDialog'
import DeleteOfficerDialog from '@/components/dialog/DeleteOfficerDialog'
import { getCookie } from '@/app/lib/auth'

type PoliceOfficer = {
  id: string
  name: string
  username: string
  email: string
  icNumber: string
  gender: string
}

export default function PoliceManagementPage() {
  const [officers, setOfficers] = useState<PoliceOfficer[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [officerToDelete, setOfficerToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchOfficers = async () => {
    try {
      const token = getCookie("session")
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing. Redirecting to login...",
          variant: "destructive",
        })
        return
      }

      setLoading(true)
      const response = await fetch("http://localhost:5035/api/police/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch officers")
      }

      const data = await response.json()
      setOfficers(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOfficers()
  }, [])

  const handleOfficerAdded = () => {
    setIsAddDialogOpen(false)
    fetchOfficers() // Refresh the list after adding an officer
    toast({
      title: "Success",
      description: "Police officer added successfully.",
    })
  }

  const handleOfficerDeleted = () => {
    if (!officerToDelete) return
    setOfficers(prev => prev.filter(officer => officer.id !== officerToDelete))
    setOfficerToDelete(null)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Police officer deleted successfully.",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Police Officers</h1>

      <div className="mb-4">
        <Button
          className="bg-police-blue hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Police Officer
        </Button>
      </div>

      {loading ? (
        <p>Loading officers...</p>
      ) : officers.length === 0 ? (
        <p>No officers found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IC Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {officers.map((officer) => (
              <TableRow key={officer.id}>
                <TableCell>{officer.name}</TableCell>
                <TableCell>{officer.icNumber}</TableCell>
                <TableCell>{officer.email}</TableCell>
                <TableCell>{officer.gender}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Info",
                          description: "View Reports functionality coming soon!",
                        })
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Reports
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setOfficerToDelete(officer.id)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Officer Dialog */}
      <AddOfficerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onOfficerAdded={handleOfficerAdded}
      />

      {/* Delete Officer Dialog */}
      <DeleteOfficerDialog
        policeId={officerToDelete!}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onOfficerDeleted={handleOfficerDeleted}
      />
    </div>
  )
}
