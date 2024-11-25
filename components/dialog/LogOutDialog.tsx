'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { removeCookie } from "@/app/lib/auth"

interface LogoutDialogProps {
  isOpen: boolean
  onClose: () => void
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose }) => {
  const router = useRouter()

  const logout = () => {
    // Remove cookies
    removeCookie("session")
    removeCookie("roles")

    // Redirect to the login page
    router.push('/login')

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
