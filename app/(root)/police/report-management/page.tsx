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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2, Eye, Search, Filter, ArrowUpDown } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

type Report = {
  id: string
  reportType: string
  createdAt: string
  status: 'Open' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  userName: string
  icNumber: string
}

const dummyReports: Report[] = [
  { id: 'R001', reportType: 'Theft', createdAt: '2023-11-15', status: 'Open', priority: 'High', userName: 'John Doe', icNumber: 'IC123456' },
  { id: 'R002', reportType: 'Vandalism', createdAt: '2023-11-14', status: 'In Progress', priority: 'Medium', userName: 'Jane Smith', icNumber: 'IC789012' },
  { id: 'R003', reportType: 'Assault', createdAt: '2023-11-13', status: 'Completed', priority: 'Critical', userName: 'Bob Wilson', icNumber: 'IC345678' },
  { id: 'R004', reportType: 'Fraud', createdAt: '2023-11-12', status: 'Open', priority: 'Low', userName: 'Alice Green', icNumber: 'IC901234' },
  { id: 'R005', reportType: 'Burglary', createdAt: '2023-11-11', status: 'In Progress', priority: 'High', userName: 'Sam Lee', icNumber: 'IC567890' },
]

const priorityOrder = { 'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3 }

export default function ReportManagementPage() {
  const [reports, setReports] = useState<Report[]>(dummyReports)
  const [filteredReports, setFilteredReports] = useState<Report[]>(dummyReports)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)

  useEffect(() => {
    filterAndSortReports()
  }, [searchQuery, statusFilter, priorityFilter, sortOption, reports])

  const filterAndSortReports = () => {
    let result = reports
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      result = result.filter(report => 
        report.userName.toLowerCase().includes(lowerCaseQuery) ||
        report.icNumber.toLowerCase().includes(lowerCaseQuery)
      )
    }
    if (statusFilter) {
      result = result.filter(report => report.status === statusFilter)
    }
    if (priorityFilter) {
      result = result.filter(report => report.priority === priorityFilter)
    }

    if (sortOption) {
      result.sort((a, b) => {
        if (sortOption === 'dateAsc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        } else if (sortOption === 'dateDesc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortOption === 'priorityAsc') {
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        } else if (sortOption === 'priorityDesc') {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return 0
      })
    }

    setFilteredReports(result)
  }

  const handleDeleteReport = () => {
    if (!reportToDelete) return

    setReports(prev => prev.filter(report => report.id !== reportToDelete))
    setIsDeleteDialogOpen(false)
    setReportToDelete(null)
    toast({
      title: "Success",
      description: "Report deleted successfully",
    })
  }

  const handleViewReport = (reportId: string) => {
    toast({
      title: "View Report",
      description: `Viewing report with ID: ${reportId}`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Report Management</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by user name or IC number"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter || 'Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Open')}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('In Progress')}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {priorityFilter || 'Priority'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>All Priorities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Low')}>Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Medium')}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('High')}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Critical')}>Critical</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOption ? sortOption.replace(/([A-Z])/g, ' $1').trim() : 'Sort'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOption('dateAsc')}>Date (Oldest First)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('dateDesc')}>Date (Newest First)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('priorityAsc')}>Priority (Low to High)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('priorityDesc')}>Priority (High to Low)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report ID</TableHead>
            <TableHead>Report Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>IC Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.id}</TableCell>
              <TableCell>{report.reportType}</TableCell>
              <TableCell>{report.createdAt}</TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell>{report.priority}</TableCell>
              <TableCell>{report.userName}</TableCell>
              <TableCell>{report.icNumber}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)}>
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setReportToDelete(report.id)
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteReport}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}