import { getCookie } from "@/app/lib/auth";

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
  const handleDelete = async () => {
    try {
      const token = getCookie("session");
      if (!token) {
        console.error("Session token is missing");
        return;
      }

      const response = await fetch(`http://localhost:5035/api/police/delete/${policeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to delete officer");
        return;
      }

      onOfficerDeleted(); // Notify parent to refresh the list
    } catch (error) {
      console.error("Error deleting officer:", error);
    }
  };

  if (!isOpen) {
    return null; // Don't render the dialog if it is not open
  }

  return (
    <div className="dialog-backdrop">
      <div className="dialog-content">
        <p>Are you sure you want to delete this officer?</p>
        <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
          Yes, Delete
        </button>
        <button onClick={() => onOpenChange(false)} className="bg-gray-300 p-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
