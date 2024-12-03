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
import { Trash2, Eye, FileText, Search, Filter, PlusCircle, Loader, ArrowUpDown } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import DeleteEntityDialog from '@/components/dialog/DeleteEntityDialog'
import AddUserDialog from '@/components/dialog/AddUserDialog'
import { signUpFormSchema } from '@/lib/utils'
import { z } from 'zod'
import { getCookie } from '@/app/lib/auth'
import { User } from '@/types/types'

type AddUserFormValues = z.infer<ReturnType<typeof signUpFormSchema>>

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddUserDialogOpen, setisAddUserDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      const token = await getCookie("session");
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing. Redirecting to login...",
          variant: "destructive",
        });
        return;
      }
  
      setLoading(true);
  
      // Construct query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (genderFilter) params.append("gender", genderFilter);
      params.append("sortOrder", sortOrder);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/getusers?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
  
      const data = await response.json();

      console.log("Fetched Users:", data);
  
      // Directly set the filtered users from the server response
      setUsers(data); // Update all users
      setFilteredUsers(data); // Update displayed users
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return

    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
    fetchUsers()
    toast({
      title: "Success",
      description: "User deleted successfully",
    })
  }

  const handleAddUser = (newUser: AddUserFormValues) => {
    setisAddUserDialogOpen(false);
    fetchUsers();
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

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, genderFilter, sortOrder]);

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
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
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
          {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="flex flex-row justify-center">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  Loading Users...
                </TableCell>
              </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.icNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.gender == "0" ? "Male" : "Female"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(user.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReports(user.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" /> Reports
                    </Button> */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setUserToDelete(user.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )))
          }
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