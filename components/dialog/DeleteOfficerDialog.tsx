'use client'

import { useState } from 'react'
import { getCookie } from "@/app/lib/auth"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

interface DeleteOfficerDialogProps {
  policeId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOfficerDeleted: () => void;
}

export default function DeleteOfficerDialog({
  policeId,
  isOpen,
  onOpenChange,
  onOfficerDeleted,
}: DeleteOfficerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const token = await getCookie("session");
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing",
          variant: "destructive",
        })
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}police/delete?userId=${policeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to delete officer");
      }

      onOfficerDeleted(); // Notify parent to refresh the list
      onOpenChange(false); // Close the dialog
      toast({
        title: "Success",
        description: "Officer deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting officer:", error);
      toast({
        title: "Error",
        description: "Failed to delete officer",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Officer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this officer? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}