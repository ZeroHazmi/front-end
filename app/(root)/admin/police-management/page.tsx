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
import { PlusCircle, Trash2, Eye, Filter, Loader } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import AddOfficerDialog from '@/components/dialog/AddOfficerDialog'
import DeleteOfficerDialog from '@/components/dialog/DeleteOfficerDialog'
import { getCookie } from '@/app/lib/auth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DeleteEntityDialog from '@/components/dialog/DeleteEntityDialog'

type PoliceOfficer = {
  id: string
  name: string
  username: string,
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
  const [genderFilter, setGenderFilter] = useState<string>('all')

  const fetchOfficers = async (gender: string = 'all') => {
    try {
      const token = await getCookie("session")
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing. Redirecting to login...",
          variant: "destructive",
        })
        return
      }

      setLoading(true)
      const response = await fetch(`http://localhost:5035/api/police/all?gender=${gender}`, {
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
    fetchOfficers(genderFilter)
  }, [genderFilter])

  const handleOfficerAdded = () => {
    setIsAddDialogOpen(false)
    fetchOfficers(genderFilter)
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

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Police Officers</h1>

      <div className="flex justify-between mb-4">
        <Button
          className="bg-police-blue hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Police Officer
        </Button>
        <div className="flex items-center space-x-2">
          <Select value={genderFilter} onValueChange={handleGenderFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
          {loading ? (
            // Ensure proper handling of loading state
            <TableRow>
              <TableCell colSpan={5} className="flex flex-row justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                Loading officers...
              </TableCell>
            </TableRow>
          ) : officers.length > 0 ? (
            officers.map((officer) => (
              <TableRow key={officer.id}>
                <TableCell>{officer.name}</TableCell>
                <TableCell>{officer.username}</TableCell>
                <TableCell>{officer.icNumber}</TableCell>
                <TableCell>{officer.email}</TableCell>
                <TableCell>{officer.gender == "0" ? "Male" : "Female"}</TableCell>
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
                        console.log("Deleting officer with ID:", officer.id);
                        setOfficerToDelete(officer.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Ensure consistent output when no data is available
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No officers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Officer Dialog */}
      <AddOfficerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onOfficerAdded={handleOfficerAdded}
      />

      <DeleteEntityDialog 
        id={officerToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type="police"
        onDeleted={handleOfficerDeleted}
      />
    </div>
  )
}