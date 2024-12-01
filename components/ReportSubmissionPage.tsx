'use client'

import React, { useState, useEffect, useRef, useCallback, useActionState } from "react";
import { useParams, usePathname, useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import { ReportType } from "@/types/index.d";
import Recorder, { mimeType } from "@/components/Recorder";
import transcribe from "@/actions/transcribe";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import GoogleMap, { LatLng } from "./GoogleMap";
import { Input } from "./ui/input";
import { states } from "@/types/constants";

type Message = {
  sender: string;
  message: string;
  id: string;
};

interface LocationWithAddress {
    coordinates: LatLng;
    geocodeObject: google.maps.GeocoderResult;
  }

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
    const [state, formAction] = useActionState(transcribe, initialState);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    // State for parsed address fields and date/time
    const [addressFields, setAddressFields] = useState({
        lotRoomBuilding: '',
        streetName: '',
        placeName: '',
        postcode: '',
        city: '',
        state: '',
    });
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState<LocationWithAddress | null>(null);
    const handleLocationChange = useCallback((coordinates: LatLng, geocodeObject: google.maps.GeocoderResult) => {
        setLocation({ coordinates, geocodeObject });
    }, []);

    useEffect(() => {
        const fetchReportType = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}reporttype/${reportTypeID}`, {
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

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value; // Get the new value from the input
        setTime(timeValue); // Update the state with the new time value
        console.log('Time selected:', timeValue); // Log the value to the console
      };
      // Update date state when the input value changes
      const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value; // Get the new value from the input
        setDate(dateValue); // Update the state with the new time value
        console.log('Date Selected:', dateValue); // Log the value to the console
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

          if (!location) {
              console.error('Location is required');
          }

          const reportData = {
            reportTypeID,
            reportContent: textareaContent,
            reportTypeName,
            address: location?.geocodeObject.formatted_address,
            latitue: location?.coordinates.lat,
            longitude: location?.coordinates.lng,
            state: location?.geocodeObject.address_components.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '',
            date: date,
            time: time,
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
          router.push(currentPath.includes('police') ? '/police' : '/user');
      } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || 'Error creating report',
            variant: "destructive",
        });
      } finally {
          setSubmitting(false);
      }
    };

    

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

    useEffect(() => {
        const splitAddress = async () => {
            if (!location?.geocodeObject) {
                console.error("No geocode object available");
                return;
              }
            
              try {
                const geocodeObject = location.geocodeObject;
                const addressComponents: google.maps.GeocoderAddressComponent[] = geocodeObject.address_components;
            
                // Extract address components
                const lotRoomBuilding = addressComponents.find(component => component.types.includes('street_number'))?.long_name || '';
                const streetName = addressComponents.find(component => component.types.includes('route'))?.long_name || '';
                const placeName = addressComponents.find(component => component.types.includes('neighborhood') || component.types.includes('sublocality'))?.long_name || '';
                const postcode = addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '';
                const city = addressComponents.find(component => component.types.includes('locality'))?.long_name || '';
                const stateFromAPI = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '';
            
                // Set the state based on the provided states object
                const state = Object.values(states).find(state => stateFromAPI.toLowerCase().includes(state.toLowerCase())) || stateFromAPI;
            
                // Update the addressFields state
                setAddressFields({
                  lotRoomBuilding,
                  streetName,
                  placeName,
                  postcode,
                  city,
                  state,
                });
            
              } catch (error) {
                console.error("Error parsing address:", error);
              }
        }

        if (location) {
            splitAddress();
        }
        console.log('Location:', addressFields);
    }, [location, addressFields]);


    // Split template fields into two columns
    const halfLength = Math.ceil(templateFields.length / 2);
    const firstColumn = templateFields.slice(0, halfLength);
    const secondColumn = templateFields.slice(halfLength);

    return (
        <div className="flex flex-row justify-center items-center bg-[#f2f2f2]">
                <div className="h-[100%] text-center p-20 pt-3vh pb-2vh">
                    
                    {/*## need to fix the width... it looks fine on the desktop but mobile ain't ##*/}
                    <div className="font-bold text-6xl max-w-[1200px] text-center text-[500%] p-20 ">
                        {reportTypeName} Report
                    </div>
                    {/* INCIDENT TYPE TITLE */}
                    <div className="font-semibold text-2xl max-w-[1200px] text-center text-[300%] p-20">
                        Location of Incident
                    </div>
                    {/* GOOGLE MAPS */}
                    <div className="flex justify-center ite">
                        <GoogleMap onLocationChange={handleLocationChange}  />                    

                    </div>

                    <form action="">

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <Card>
                            <CardContent className="p-6">
                            <div className="mb-4">
                                <Label htmlFor="lotRoomBuilding" className='w-full flex items-start mb-2'>Lot/Room/Office/Building No.</Label>
                                <Input
                                id="lotRoomBuilding"
                                placeholder="Enter lot/room/office/building no."
                                value={addressFields.lotRoomBuilding}
                                onChange={(e) => setAddressFields({ ...addressFields, lotRoomBuilding: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="streetName" className='w-full flex items-start mb-2'>Street Name</Label>
                                <Input
                                id="streetName"
                                placeholder="Enter street name"
                                value={addressFields.streetName}
                                onChange={(e) => setAddressFields({ ...addressFields, streetName: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="placeName" className='w-full flex items-start mb-2'>Park/Place Name</Label>
                                <Input
                                id="placeName"
                                placeholder="Enter park/place name"
                                value={addressFields.placeName}
                                onChange={(e) => setAddressFields({ ...addressFields, placeName: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="postcode" className='w-full flex items-start mb-2'>Postcode</Label>
                                <Input
                                id="postcode"
                                placeholder="Enter postcode"
                                value={addressFields.postcode}
                                onChange={(e) => setAddressFields({ ...addressFields, postcode: e.target.value })}
                                />
                            </div>
                            </CardContent>
                        </Card>

                            <Card>
                            <CardContent className="p-6">
                                <div className="mb-4">
                                <Label htmlFor="city" className='w-full flex items-start mb-2'>City</Label>
                                <Input
                                    id="city"
                                    placeholder="Enter city"
                                    value={addressFields.city}
                                    onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
                                />
                                </div>
                                <div className="mb-4">
                                <Label htmlFor="state" className='w-full flex items-start mb-2'>State</Label>
                                <Input
                                    id="state"
                                    placeholder="Enter state"
                                    value={addressFields.state}
                                    onChange={(e) => setAddressFields({ ...addressFields, state: e.target.value })}
                                />
                                </div>
                                <div className="mb-4">
                                <Label htmlFor="date" className='w-full flex items-start mb-2'>Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    placeholder="Enter date of incident"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor="time" className="w-full flex items-start mb-2">Time</Label>
                                    <Input
                                    id="time"
                                    type="time"
                                    placeholder="Enter time of incident"
                                    value={time}
                                    onChange={handleTimeChange}
                                    />
                                </div>
                            </CardContent>
                            </Card>

                        </div>

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
                </form>

                </div>

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
