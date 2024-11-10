import { toast } from '@/hooks/use-toast';
import { ReportType } from '@/types';
import { faKeyboard, faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, MicIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReportContent = () => {
    const router = useRouter();
    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [selectedReportType, setSelectedReportType] = useState<number>(0);
    const [icNumber, setIcNumber] = useState<string>('');
    const currentRoute = usePathname();

    async function fetchReportType() {
        const response = await fetch('http://localhost:5035/api/reporttype', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        setReportTypes(data);
    }

    function newReportButton(e: React.MouseEvent) {
        e.preventDefault();
        if (selectedReportType === 0) {
            toast({
                title: "Report Type",
                description: "Please select a valid report type",
                variant: "destructive",
            });
            return;
        } else {
            // Check the current route    
            if (currentRoute.includes('police')) {
                // If in the police route, navigate to the police-specific route
                router.push(`/police/reports/create/${selectedReportType}`);
            } else {
                // If in the user route, navigate to the user-specific route
                router.push(`/user/new-report/${selectedReportType}`);
            }
        }
    }

    useEffect(() => {
        fetchReportType();
    }, []);

  return (
    <section className='pt-16'>
        <div className=" flex justify-center items-center font-bold text-6xl  text-center text-7 my-12">
            <h1>Reporting Submission</h1>
        </div>
        {/* MAIN CONTAINER */}
        <div className=" flex flex-col justify-center items-center">
            <Card className="bg-white shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">Create a New Report</CardTitle>
                <CardDescription>The following features will be available when you start your report</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col items-start p-4 border rounded-lg">
                <FileTextIcon className="mb-2 h-6 w-6 text-blue-600" />
                <div className="font-semibold">Text Report</div>
                <p className="mt-1 text-sm text-gray-600">Type your report using our guided form</p>
                </div>
                <div className="flex flex-col items-start p-4 border rounded-lg">
                <MicIcon className="mb-2 h-6 w-6 text-blue-600" />
                <div className="font-semibold">Voice Report</div>
                <p className="mt-1 text-sm text-gray-600">Use speech-to-text to dictate your report</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start">
                <p className="mb-4 text-sm text-gray-600">
                Our speech-to-text feature allows you to speak your report, which will be automatically transcribed. 
                You can review and edit the text before submission.
                </p>
                <div className="w-full space-y-4">
                    
                    <Select onValueChange={(value) => setSelectedReportType(Number(value))} required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0" disabled>
                                Type of reports {/* placeholder */}
                            </SelectItem>
                            {reportTypes.map((reportType) => (
                                <SelectItem key={reportType.id} value={reportType.id.toString()}>
                                    {reportType.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* {currentRoute.includes('police') && (
                        <Input type="text" placeholder="Enter the IC Number of User" onChange={(e) => setIcNumber(e.target.value)}/>
                    )} */}
                    <Button className="w-full sm:w-auto bg-[#0044cc]  text-white rounded-lg font-bold hover:bg-[#0022aa]" onClick={newReportButton}>
                        Start New Report
                    </Button>

                </div>
            </CardFooter>
            </Card>
            
        </div>
    </section>
  )
}

export default ReportContent
