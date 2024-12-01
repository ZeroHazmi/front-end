'use client'

import { getCookie } from "@/app/lib/auth";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface DeleteEntityDialogProps {
  id: string | null; // Either userId or policeId
  type: "user" | "police"; // Specify the type of entity
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDeleted: () => void; // Notify parent to refresh the list
}

export default function DeleteEntityDialog({
  id,
  type,
  isOpen,
  onOpenChange,
  onDeleted,
}: DeleteEntityDialogProps) {
  const handleDelete = async () => {
    console.log("Deleting", type, "with ID:", id);
    try {
      const token = await getCookie("session");
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing",
          variant: "destructive",
        });
        return;
      }

      // Construct the endpoint dynamically based on the type
      const endpoint =
        type === "police"
          ? `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}police/delete?userId=${id}`
          : `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/delete?userId=${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      onDeleted(); // Notify parent to refresh the list
      onOpenChange(false); // Close the dialog
      toast({
        title: "Success",
        description: `${type === "police" ? "Police officer" : "User"} deleted successfully`,
      });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type === "police" ? "police officer" : "user"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {type === "police" ? "police officer" : "user"}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}