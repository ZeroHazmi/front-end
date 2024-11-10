'use client'

import { useToast } from "@/hooks/use-toast";
import { AppUser, Priority, Report, Status } from "@/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, Loader2, PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

async function fetchReports(reportMode: 'Open' | 'InProgress' | 'Closed'): Promise<Report[]> {
    try {
        const response = await fetch(`http://localhost:5035/api/report?status=${reportMode === 'Open' ? 'InProgress' : 'Closed'}`);
        const data = await response.json();
        
        return data.map((item: any) => ({
            id: item.id,
            userId: item.userId,
            status: item.status === 0 ? 'Open' : 'Closed',
            priority: item.priority === 0 ? 'Low' : 'Medium',
            reportType: item.reportTypeId,
            createdAt: item.createdAt,
        }));
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        return [];
    }
}

export default function PoliceReportTable() {
    const [reports, setReports] = useState<Report[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [reportMode, setReportMode] = useState<'Open' | 'Closed' | 'InProgress'>('Open');
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const mode = reportMode === 'Open' ? 'InProgress' : 'Closed';
            const reports = await fetchReports(mode);
            setReports(reports);
            setIsLoading(false);
        };

        fetchData();
    }, [reportMode]);

    const handleEdit = (report: Report) => {
        setReportToEdit(report);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: string) => {
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

    const confirmEdit = async () => {
        if (reportToEdit) {
            const response = await fetch(`http://localhost:5035/api/report/${reportToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: reportToEdit.status === 'Open' ? 0 : 1,
                    priority: reportToEdit.priority === 'Low' ? 0 : 1,
                }),
            });
            if (response.ok) {
                toast({ title: "Report Updated", description: "Report has been updated successfully" });
                setReports((prevReports) =>
                    prevReports.map((report) => (report.id === reportToEdit.id ? reportToEdit : report))
                );
            } else {
                toast({ title: "Report Update Failed", description: "Failed to update report" });
            }
        }
        setIsEditDialogOpen(false);
    };

    return (
        <>
            <Card className="w-full mt-52">
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-between items-center">
                            <span>Police Reports</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {reportMode === 'Open' ? 'Open Reports' : reportMode === 'InProgress' ? 'In-Progress Reports' : 'Closed Reports'} <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setReportMode("Open")}>Open Reports</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setReportMode("InProgress")}>In-Progress Reports</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setReportMode("Closed")}>Closed Reports</DropdownMenuItem>
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
                                                        onClick={() => handleEdit(report)}
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

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Report</DialogTitle>
                        <DialogDescription>
                            Update the status and priority of the report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                onValueChange={(value) => setReportToEdit(prev => prev ? { ...prev, status: value as Status } : null)}
                                defaultValue={reportToEdit?.status}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="InProgress">In Progress</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                                Priority
                            </Label>
                            <Select
                                onValueChange={(value) => setReportToEdit(prev => prev ? { ...prev, priority: value as Priority } : null)}
                                defaultValue={reportToEdit?.priority}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="crtical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}