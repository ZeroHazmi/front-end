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
import { mapStatus, renderFormattedDate } from '@/lib/utils'
import { format } from 'date-fns'

type Report = {
  id: string
  reportTypeName: string
  createAt: string
  status: 'Low' | 'Medium' | 'High' | 'Critical'
}

export default function UserReportTable() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function renderFormattedDate(date: string) {
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date); // Log the invalid date for debugging
      return 'Invalid Date'; // Return a fallback value or handle accordingly
    }
  
    return format(parsedDate, 'yyyy-MM-dd HH:mm:ss'); // Adjust date format as necessary
  }

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await getCookie("session");
      const userId = await getCookie("userId");
      console.log("Token:", userId);
      
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing. Redirecting to login...",
          variant: "destructive",
        });
        router.push('/login')
        return;
      }

      // Construct query parameters
      const params = new URLSearchParams();
      
      // Add search parameter
      if (searchQuery) params.append("search", searchQuery);
      
      // Add status filter
      if (statusFilter) params.append("status", statusFilter);
      
      // Add priority filter
      if (priorityFilter) params.append("priority", priorityFilter);
      
      // Add sorting parameters
      switch (sortOption) {
        case "dateAsc":
          params.append("sortOrder", "asc");
          break;
        case "dateDesc":
          params.append("sortOrder", "desc");
          break;
        case "priorityAsc":
          params.append("sortOrder", "asc");
          break;
        case "priorityDesc":
          params.append("sortOrder", "desc");
          break;
      }

      // Add userId if available
      if (userId) params.append("userId", userId);

      // Construct the full URL
      const url = `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}report?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch reports");
      }

      const data = await response.json();
      console.log("Fetched Reports:", data);

      // Update state with fetched data
      setReports(data);
      setFilteredReports(data);
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

  useEffect(() => {
    fetchReports();
  }, [searchQuery, statusFilter, priorityFilter, sortOption]);

  const handleViewReport = (reportId: string) => {
    router.push(`/user/reports/view/${reportId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Reports</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search report type or name"
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
                {statusFilter || 'Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Open')}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('InProgress')}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>Completed</DropdownMenuItem>
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
            <TableHead>Report Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <div className="flex justify-center items-center">
                  <Loader className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                  Loading Reports...
                </div>
              </TableCell>
            </TableRow>
          ) : filteredReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No reports found.
              </TableCell>
            </TableRow>
          ) : (
            filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.reportTypeName}</TableCell>
                <TableCell suppressHydrationWarning>
                 {renderFormattedDate(report.createAt)}
                </TableCell>
                <TableCell>{mapStatus(Number(report.status))}</TableCell>
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