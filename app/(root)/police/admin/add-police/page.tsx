'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from 'lucide-react'

type PoliceOfficer = {
  id: string
  username: string
  email: string
  icNumber: string
}

export default function AddPolicePage() {
  const [officers, setOfficers] = useState<PoliceOfficer[]>([
    { id: '1', username: 'officer1', email: 'officer1@example.com', icNumber: 'IC12345' },
    { id: '2', username: 'officer2', email: 'officer2@example.com', icNumber: 'IC67890' },
  ])

  const [newOfficer, setNewOfficer] = useState({
    username: '',
    password: '',
    email: '',
    icNumber: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewOfficer(prev => ({ ...prev, [name]: value }))
  }

  const handleAddOfficer = () => {
    const id = (officers.length + 1).toString()
    setOfficers(prev => [...prev, { id, ...newOfficer }])
    setNewOfficer({ username: '', password: '', email: '', icNumber: '' })
  }

  const handleDeleteOfficer = (id: string) => {
    setOfficers(prev => prev.filter(officer => officer.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Police Officers</h1>
      
      <div className="mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-police-blue hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Police Officer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Police Officer</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOfficer(); }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={newOfficer.username}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newOfficer.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newOfficer.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icNumber" className="text-right">
                    IC Number
                  </Label>
                  <Input
                    id="icNumber"
                    name="icNumber"
                    value={newOfficer.icNumber}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-police-blue hover:bg-blue-700">
                  Add Officer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>IC Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officers.map((officer) => (
            <TableRow key={officer.id}>
              <TableCell>{officer.username}</TableCell>
              <TableCell>{officer.email}</TableCell>
              <TableCell>{officer.icNumber}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteOfficer(officer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}