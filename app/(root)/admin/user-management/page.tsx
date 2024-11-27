'use client'

import { useState, useEffect } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Eye, FileText, Search, Filter, PlusCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import DeleteEntityDialog from '@/components/dialog/DeleteEntityDialog'
import AddUserDialog from '@/components/dialog/AddUserDialog'
import { signUpFormSchema } from '@/lib/utils'
import { z } from 'zod'

type User = {
  id: string
  username: string
  name: string
  icNumber: string
  email: string
  age: number
  gender: string
}

const dummyUsers: User[] = [
  { id: '1', username: 'johnd', name: 'John Doe', icNumber: 'IC123456', email: 'john@example.com', age: 30, gender: 'Male' },
  { id: '2', username: 'janes', name: 'Jane Smith', icNumber: 'IC789012', email: 'jane@example.com', age: 28, gender: 'Female' },
  { id: '3', username: 'bobw', name: 'Bob Wilson', icNumber: 'IC345678', email: 'bob@example.com', age: 35, gender: 'Male' },
  { id: '4', username: 'aliceg', name: 'Alice Green', icNumber: 'IC901234', email: 'alice@example.com', age: 42, gender: 'Female' },
  { id: '5', username: 'saml', name: 'Sam Lee', icNumber: 'IC567890', email: 'sam@example.com', age: 25, gender: 'Other' },
]

type AddUserFormValues = z.infer<ReturnType<typeof signUpFormSchema>>

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(dummyUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(dummyUsers)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddUserDialogOpen, setisAddUserDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState<string | null>(null)

  useEffect(() => {
    const filterUsers = () => {
      let result = users
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase()
        result = result.filter(user => 
          user.name.toLowerCase().includes(lowerCaseQuery) || 
          user.username.toLowerCase().includes(lowerCaseQuery)
        )
      }
      if (genderFilter && genderFilter !== 'all') {
        result = result.filter(user => user.gender === genderFilter)
      }
      setFilteredUsers(result)
    }

    filterUsers()
  }, [searchQuery, genderFilter, users])

  const handleDeleteUser = () => {
    if (!userToDelete) return

    setUsers(prev => prev.filter(user => user.id !== userToDelete))
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
    toast({
      title: "Success",
      description: "User deleted successfully",
    })
  }

  const handleAddUser = (newUser: AddUserFormValues) => {
    const user = {
      id: `${users.length + 1}`,
      username: newUser.userName,
      name: newUser.name,
      icNumber: newUser.icNumber,
      email: newUser.email,
      age: newUser.birthday ? new Date().getFullYear() - new Date(newUser.birthday).getFullYear() : 0,
      gender: newUser.gender,
    }
    setUsers((prevUsers) => [...prevUsers, user])
    toast({
      title: "Success",
      description: "User added successfully",
    })
  }

  const handleViewProfile = (userId: string) => {
    toast({
      title: "View Profile",
      description: `Viewing profile for user ID: ${userId}`,
    })
  }

  const handleViewReports = (userId: string) => {
    toast({
      title: "View Reports",
      description: `Viewing reports for user ID: ${userId}`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={genderFilter || 'all'} onValueChange={(value) => setGenderFilter(value === 'all' ? null : value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
          className="bg-police-blue hover:bg-blue-700"
          onClick={() => setisAddUserDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>IC Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.icNumber}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(user.id)}>
                    <Eye className="h-4 w-4 mr-2" /> Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewReports(user.id)}>
                    <FileText className="h-4 w-4 mr-2" /> Reports
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setUserToDelete(user.id)
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

      <DeleteEntityDialog 
        id={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type="user"
        onDeleted={handleDeleteUser}
        />

      <AddUserDialog 
        isOpen={isAddUserDialogOpen} 
        onOpenChange={setisAddUserDialogOpen} 
        onUserAdded={handleAddUser}
      />

    </div>
  )
}