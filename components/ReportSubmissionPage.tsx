'use client'

import React, { useState, useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import { ReportType } from "@/types/index.d";
import Recorder, { mimeType } from "@/components/Recorder";
import { useFormState } from "react-dom";
import transcribe from "@/actions/transcribe";
import MapForm from "@/components/MapForm";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Types
type LocationState = {
  address: string;
  date: string;
  time: number;
};

type Message = {
  sender: string;
  message: string;
  id: string;
};

const initialState = {
  sender: "",
  message: "",
};

export default function SubmitReportPage() {
    const [reportType, setReportType] = useState<ReportType | null>(null);
    const [templateFields, setTemplateFields] = useState<[string, string][]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [textareaContent, setTextareaContent] = useState<string>("");
    const [isEditable, setIsEditable] = useState(false);

    const router = useRouter();
    const currentPath = usePathname();
    const { reporttype } = useParams();
    const reportTypeID = reporttype as string;
    const reportTypeName = reportType?.name;

    const fileRef = useRef<HTMLInputElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const [state, formAction] = useFormState(transcribe, initialState);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [location, setLocation] = useState<LocationState>({
      address: '',
      date: '',
      time: 0,
    });

    useEffect(() => {
        const fetchReportType = async () => {
            try {
                const response = await fetch(`http://localhost:5035/api/reporttype/${reportTypeID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch report type');
                }
    
                const data = await response.json();
                setReportType(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching report type:', error);
            }
        };
    
        fetchReportType();
    }, [reportTypeID]);
    

    // async function renderReport() {
    //     try {
    //         const reportTypeData = await fetchReportType();
    //         setReportType(reportTypeData);

    //         let parsedTemplate = {};
    //         if (typeof reportTypeData.templateStructure === 'string') {
    //             parsedTemplate = JSON.parse(reportTypeData.templateStructure);
    //         } else {
    //             parsedTemplate = reportTypeData.templateStructure;
    //         }

    //         const fields = Object.entries(parsedTemplate).map(([key, value]) => {
    //             return [key, typeof value === 'string' ? value : String(value)] as [string, string];
    //         });

    //         setTemplateFields(fields);
    //         setLoading(false);
    //     } catch (parseError) {
    //         setLoading(false);
    //         console.error('Error fetching report type:', parseError);
    //     }
    // }

    const uploadAudio = (blob: Blob) => {
        const file = new File([blob], "audio.webm", { type: mimeType });

        if (fileRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileRef.current.files = dataTransfer.files;

            if (submitButtonRef.current) {
                submitButtonRef.current.click();
            }
        }
    };

    // Create report
    const createReport = async () => {
      try {
          setSubmitting(true);

          if (!reportTypeID || !reportTypeName) {
              console.error('Missing report type information');
          }

          if (!textareaContent.trim()) {
              console.error('Report content cannot be empty');
          }

          if (!location.address) {
              console.error('Location is required');
          }

          const reportData = {
            reportTypeID,
            reportContent: textareaContent,
            reportTypeName,
            location: location.address,
            date: location.date,
            time: location.time,
        };

          const response = await fetch('/api/create-report', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(reportData),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to create report');
          }

          toast({
              title: "Success",
              description: "Report submitted successfully",
          });

          setIsConfirmDialogOpen(false);
          if(currentPath.includes('police')) {
            router.push('/police');
          } else {
            router.push('/user');
          }
      } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error creating report';
          toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
          });
      } finally {
          setSubmitting(false);
      }
    };

    // useEffect(() => {
    //     renderReport();
    // }, [reportTypeID]);

    useEffect(() => {
        if (state.message) {
            const newMessage = `${state.message}\n`;
            setTextareaContent((prevContent) => prevContent + newMessage);
            setMessages((prev) => [
                {
                    sender: state.sender,
                    message: state.message,
                    id: `${Date.now()}-${Math.random()}`,
                },
                ...prev,
            ]);
        }
    }, [state.message, state.sender]);


    // Split template fields into two columns
    const halfLength = Math.ceil(templateFields.length / 2);
    const firstColumn = templateFields.slice(0, halfLength);
    const secondColumn = templateFields.slice(halfLength);

    return (
        <div className="flex flex-row justify-center items-center bg-[#f2f2f2]">
            <form action="">
                <div className="w-[100%] h-[100%] text-center p-20 pt-3vh pb-2vh">
                    <div className="font-bold text-6xl max-w-[1200px] text-center text-[500%] p-20 ">
                        {reportTypeName} Report
                    </div>

                    {/* MAP CONTAINER */}
                    <MapForm onLocationChange={(address, date, time) => setLocation({ address, date, time })}/>

                    {/* One button to enable edit */}
                    {/* By default the textarea is not editable */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <Label htmlFor="report-content">Report Content</Label>
                            <textarea
                                id="report-content"
                                className="w-full h-64 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none"
                                value={textareaContent}
                                onChange={(e) => setTextareaContent(e.target.value)}
                                placeholder="Type or dictate your report here..."
                                disabled={!isEditable} // Disable the textarea if not editable
                            ></textarea>
                            <Button
                                type="button"
                                className={`w-[20%] text-white ${isEditable ? 'bg-red-500 hover:bg-red-600' : 'bg-police-blue hover:bg-[#0022AA]'} mt-4`}
                                onClick={() => setIsEditable(!isEditable)}
                            >
                                {isEditable ? 'Stop Editing' : 'Edit'}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between items-center">
                        <Button onClick={() => router.push('/user/')} className="text-white bg-police-blue hover:bg-[#0022AA]">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Return
                        </Button>
                        <Button type="button" className="text-white bg-police-blue hover:bg-[#0022AA]" onClick={() => setIsConfirmDialogOpen(true)}>
                            Confirm <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </form>

            <form action={formAction}>
                <input type="file" hidden ref={fileRef} name="audio" />
                <button type="submit" hidden ref={submitButtonRef} name="submit" />
                <Recorder uploadAudio={uploadAudio} />
            </form>

            <ConfirmDialog isConfirmDialogOpen={isConfirmDialogOpen} setIsConfirmDialogOpen={setIsConfirmDialogOpen} onConfirm={createReport} />
        </div>
    );
}

function ConfirmDialog({ isConfirmDialogOpen, setIsConfirmDialogOpen, onConfirm }: { 
    isConfirmDialogOpen: boolean, 
    setIsConfirmDialogOpen: (value: boolean) => void,
    onConfirm: () => void 
}) {
    const handleClose = () => setIsConfirmDialogOpen(false);

    return (
        <Dialog open={isConfirmDialogOpen} onOpenChange={handleClose} aria-label="Confirmation Dialog">
            <DialogTitle className="text-xl font-semibold" hidden>Confirm Submission</DialogTitle>
            <DialogOverlay className="fixed inset-0 z-50 bg-black opacity-50" />
            <DialogContent className="fixed top-[30%] left-[50%] transform -translate-x-[50%] bg-white p-8 rounded-md shadow-md max-w-lg">
                <p>Are you sure you want to submit this report?</p>
                <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="default" onClick={onConfirm}>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
