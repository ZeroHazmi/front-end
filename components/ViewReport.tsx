'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { getCookie } from '@/app/lib/auth';

interface ReportData {
  reportId: string;
  dateCreated: string;
  status: string;
  priority: string;
  incidentDateTime: string;
  address: string;
  transcript: string;
  policeNotes: string;
}

type UserType = 'user' | 'police' | 'admin';

interface ViewReportProps {
  reportId: string | undefined;
  userType: UserType;
}

export default function ViewReport({ reportId, userType }: ViewReportProps) {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [policeNotes, setPoliceNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = userType === 'police';

  const isValidDate = (date: string) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  useEffect(() => {
    if (!reportId) return;

    const fetchReportData = async () => {
      try {
        const response = await fetch(`http://localhost:5035/api/report/${reportId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }
        const data: ReportData = await response.json();
        console.log('Fetched Report Data:', data);

        // Ensure date validation before setting state
        setReportData({
          ...data,
          dateCreated: isValidDate(data.dateCreated) ? data.dateCreated : '',
          incidentDateTime: isValidDate(data.incidentDateTime) ? data.incidentDateTime : '',
        });

        setStatus(data.status);
        setPriority(data.priority);
        setPoliceNotes(data.policeNotes);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching the report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportId]);

  const handleStatusChange = (value: string) => setStatus(value);
  const handlePriorityChange = (value: string) => setPriority(value);
  const handlePoliceNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPoliceNotes(e.target.value);
  const handleEditToggle = () => canEdit && setIsEditing(!isEditing);

  const handleSaveChanges = async () => {
    if (!canEdit || !reportData) return;

    try {
      const token = await getCookie("session");
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing.",
          variant: "destructive",
        });
        return;
      }

      const requestBody = {
        status: status,
        priority: priority,
        extraInformation: policeNotes,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}report/put?id=${reportId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update report');
      }

      const updatedData = await response.json();
      setReportData(updatedData);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Report updated successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error updating report:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred while updating the report.',
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="container mx-auto p-4 mt-16">Loading...</div>;
  if (error || !reportData) return <div className="container mx-auto p-4 mt-16">Error: {error || 'Report not found'}</div>;

  return (
    <div className="container mx-auto p-4 mt-16">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>View Report</CardTitle>
              <CardDescription>Report details and management</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.back()} variant="outline">
                Back
              </Button>
              {canEdit && (
                <Button onClick={handleEditToggle} variant="outline" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Cancel Edit' : 'Edit Report'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <div>
                <Label className="font-bold">Report ID</Label>
                <p>{reportData.reportId}</p>
              </div>
              <div>
                <Label className="font-bold">Date Created</Label>
                <p>
                  {isValidDate(reportData.dateCreated)
                    ? format(new Date(reportData.dateCreated), 'PPP')
                    : 'Invalid date'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="w-1/3">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange} value={status} disabled={!isEditing}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/3">
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={handlePriorityChange} value={priority} disabled={!isEditing}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="font-bold">Date and Time of Incident</Label>
              <p>
                {isValidDate(reportData.incidentDateTime)
                  ? format(new Date(reportData.incidentDateTime), 'PPP p')
                  : 'Invalid date'}
              </p>
            </div>

            <div>
              <Label className="font-bold">Address</Label>
              <p>{reportData.address}</p>
            </div>

            <div>
              <Label className="font-bold">Transcript</Label>
              <p className="mt-2 whitespace-pre-wrap">{reportData.transcript}</p>
            </div>

            <div>
              <Label htmlFor="policeNotes" className="font-bold">Police Notes</Label>
              <Textarea
                id="policeNotes"
                placeholder="Add additional notes or details here..."
                value={policeNotes}
                onChange={handlePoliceNotesChange}
                disabled={!isEditing}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Back to Reports</Button>
          {isEditing && canEdit && <Button onClick={handleSaveChanges}>Save Changes</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}

