import { getCookie } from "@/app/lib/auth";

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
    try {
      const token = getCookie("session");
      if (!token) {
        console.error("Session token is missing");
        return;
      }

      // Construct the endpoint dynamically based on the type
      const endpoint =
        type === "police"
          ? `http://localhost:5035/api/police/delete/${id}`
          : `http://localhost:5035/api/user/delete/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Failed to delete ${type}`);
        return;
      }

      onDeleted(); // Notify parent to refresh the list
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  if (!isOpen) {
    return null; // Don't render the dialog if it is not open
  }

  return (
    <div className="dialog-backdrop">
      <div className="dialog-content">
        <p>
          Are you sure you want to delete this {type === "police" ? "police officer" : "user"}?
        </p>
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
