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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, ArrowUpDown, Loader, Eye } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { getCookie } from '@/app/lib/auth'
import { useRouter } from 'next/navigation'

// Enum for Status mapping
enum StatusEnum {
  Open = 0,
  InProgress = 1,
  Completed = 2
}

// Reverse mapping for display
const StatusDisplay: { [key: number]: string } = {
  [StatusEnum.Open]: 'Open',
  [StatusEnum.InProgress]: 'In Progress',
  [StatusEnum.Completed]: 'Completed'
}

type Report = {
  id: string
  userId: string
  reportTypeName: string
  createAt: string
  status: number
}

export default function UserReportTable() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | null>(null)
  const [sortOption, setSortOption] = useState<string>("asc")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchReports = async () => {
    setLoading(true)
    try {
      const token = await getCookie("session");
      const userId = await getCookie("userId");
      
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing. Redirecting to login...",
          variant: "destructive",
        });
        router.push('/login')
        return;
      }
  
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      
      // Convert status filter to string for API
      if (statusFilter !== null) {
        params.append("status", statusFilter.toString());
      }
      
      if (userId) params.append("userId", userId);
      params.append("sortOrder", sortOption);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}report?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to fetch reports");
      }
  
      const data = await response.json();
      setReports(data);
      setFilteredReports(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchQuery, statusFilter, sortOption]);

  const handleViewReport = (reportId: string) => {
    router.push(`/user/reports/${reportId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Reports</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search report type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" className="flex items-center" onClick={fetchReports}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter !== null ? StatusDisplay[statusFilter] : 'Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter(StatusEnum.Open)}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter(StatusEnum.InProgress)}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter(StatusEnum.Completed)}>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOption === 'asc' ? 'Oldest First' : 'Newest First'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Reports</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOption('asc')}>Date (Oldest First)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('desc')}>Date (Newest First)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <span className="mt-2 block">Loading Reports...</span>
              </TableCell>
            </TableRow>
          ) : filteredReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No reports found</TableCell>
            </TableRow>
          ) : (
            filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.reportTypeName}</TableCell>
                <TableCell>{new Date(report.createAt).toLocaleString()}</TableCell>
                <TableCell>{StatusDisplay[report.status]}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)}>
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}