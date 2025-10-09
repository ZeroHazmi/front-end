'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
interface LogoutDialogProps {
  isOpen: boolean
  onClose: () => void
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose }) => {
  const router = useRouter()

  const logout = () => {
    // Clear client-side cookies and storage, then redirect to landing
    try {
      const deleteCookie = (name: string) => {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax;`;
      };

      ["session", "roles", "userId", "language"].forEach(deleteCookie);

      try {
        localStorage.removeItem("session");
        localStorage.removeItem("roles");
        localStorage.removeItem("userId");
      } catch {
        /* ignore localStorage errors */
      }
    } catch {
      /* ignore cookie errors */
    }

    // Full reload to ensure server-side middleware sees cleared cookies
    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      router.push("/");
    }

    // Close the dialog
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will be redirected to the login page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LogoutDialog
