'use client'

import { useToast } from "@/hooks/use-toast";
import { AppUser, Report } from "@/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, Loader2, PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

async function fetchReports(reportMode: 'current' | 'archive'): Promise<Report[]> {
    try {
        const response = await fetch(`http://localhost:5035/api/report?status=${reportMode === 'current' ? '0' : '1'}`);
        const data = await response.json();
        
        return data.map((item: any) => ({
            id: item.id,
            userId: item.userId,
            status: item.status === 0 ? 'open' : 'closed',
            priority: item.priority === 0 ? 'low' : 'high',
            reportType: item.reportTypeId,
            createdAt: item.createdAt,
        }));
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        return [];
    }
}

async function fetchUsers(): Promise<AppUser[]> {
    try {
        const response = await fetch(`http://localhost:5035/api/report`);
        const data = await response.json();
        
        return data.map((item: any) => ({
            id: item.id,
            userId: item.userId,
            status: item.status === 0 ? 'open' : 'closed',
            priority: item.priority === 0 ? 'low' : 'high',
            reportType: item.reportTypeId,
            createdAt: item.createdAt,
        }));
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        return [];
    }
}

function PoliceReportTable() {
    const [reports, setReports] = useState<Report[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [reportToEdit, setReportToEdit] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [reportMode, setReportMode] = useState<'current' | 'archive'>('current');
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const reports = await fetchReports(reportMode);
            setReports(reports);
            setIsLoading(false);
        };

        fetchData();
    }, [reportMode]);

    const handleEdit = (id: string) => {
        console.log(`Edit report with id: ${id}`);
        setReportToEdit(id);
    };

    const handleDelete = (id: string) => {
        console.log(`Delete report with id: ${id}`);
        setReportToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (reportToDelete !== null) {
            const response = await fetch(`http://localhost:5035/api/report/${reportToDelete}`, { method: 'DELETE' });
            if (response.ok) {
                toast({ title: "Report Removed", description: "Report has been removed successfully" });
                setReports((prevReports) => prevReports.filter((report) => report.id !== Number(reportToDelete)));
            } else {
                toast({ title: "Report Removal Failed", description: "Failed to remove report" });
            }
        }
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-between items-center">
                            <span>Police Reports</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {reportMode === 'current' ? 'Open Reports' : 'Closed Reports'} <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setReportMode("current")}>Open Reports</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setReportMode("archive")}>Closed Reports</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date of Report</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Report Type</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {reports.map((report, index) => (
                                        <motion.tr
                                            key={report.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <TableCell>{report.userId || 'Unknown'}</TableCell>
                                            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{report.status}</Badge>
                                            </TableCell>
                                            <TableCell>{report.priority}</TableCell>
                                            <TableCell>{report.reportType.toString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    // Change to handleView
                                                    onClick={() => handleEdit(report.id.toString())}
                                                    className="hover:bg-muted"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(report.id.toString())}
                                                        className="hover:bg-muted"
                                                    >
                                                        <PencilIcon className="h-4 w-4 mr-1" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(report.id.toString())}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <TrashIcon className="h-4 w-4 mr-1" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

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
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default PoliceReportTable;
