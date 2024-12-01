'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getCookie } from "@/app/lib/auth"
import LogoutDialog from "./dialog/LogOutDialog"

export default function NavBar() {
  const router = useRouter()
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  useEffect(() => {
    const checkRoles = async () => {
      const role = await getCookie("roles")
      setUserRole(role)
    }
    checkRoles()
    console.log(userRole)
  }, [userRole])

  const cancelLogout = () => {
    setIsLogoutDialogOpen(false)
  }

  const toggleHamburgerMenu = () => {
    setHamburgerOpen(!hamburgerOpen)
  }

  const isPolice = userRole === 'Police'
  const isAdmin = userRole === 'Admin'
  const isUser = userRole === 'User'

  return (
    <nav>
      <div className="flex justify-between items-center px-2 shadow-bottom-custom-blue bg-[#303091] h-[50px] fixed top-2 left-2 right-2 rounded-lg z-50 text-white">
        <div className="flex items-center justify-start">
          <Link href={isPolice ? "/police" : "/user"} className="flex items-center">
            <Image src="/Images/navbarlogo.png" alt="Logo" className="w-9 h-9 rounded-lg mr-3" height={50} width={50}/>
            <div className="text-white text-2xl mb-[2px] font-bold">
              P.R.A.S
            </div>
          </Link>
        </div>

        <div onClick={toggleHamburgerMenu} className="sm:hidden flex justify-center text-white text-[35px] mr-1 cursor-pointer transition-transform duration-200">
          <FontAwesomeIcon icon={hamburgerOpen ? faXmark : faBars} />
        </div>
        
        <div className="hidden sm:flex items-center space-x-6">
          {isPolice && (
            <>
              <div>
                Police
              </div>
              <Link href="/police/report-management" className="hover:text-gray-200">
                Reports Management
              </Link>
              <Link href="/police/create-report" className="hover:text-gray-200">
                Create Report
              </Link>
              <Link href="/police/user" className="hover:text-gray-200">
                Users
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <div>
                Admin
              </div>
              <Link href="/admin/data" className="hover:text-gray-200 cursor-pointer">
                Data Analytics
              </Link>
              <Link href="/admin/police-management" className="hover:text-gray-200 cursor-pointer">
                Police Management
              </Link>
              <Link href="/admin/user-management/" className="hover:text-gray-200 cursor-pointer">
                User Management
              </Link>
              {/* need to change to police faq to answer user questions */}
              <Link href="/user/faq" className="hover:text-gray-200 cursor-pointer">
                    FAQ
                </Link>
            </>
            
            
          )}
          {
            isUser && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center hover:text-gray-200">
                    Reports <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/user/reports/new">Create New Report</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/user/reports/view">View Submitted Reports</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/user/faq" className="hover:text-gray-200 cursor-pointer">
                    FAQ
                </Link>
              </>
                
            )
          }
          <Button
            onClick={() => setIsLogoutDialogOpen(true)}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
          {isPolice ? (
            <UserCircle className="w-8 h-8 cursor-pointer" />
          ) : (
            <Link href="/user/profile" className="cursor-pointer">
              <FontAwesomeIcon icon={faUser} height={30} width={30}/>
            </Link>
          )}
        </div>
      </div>
      
      <div className={`sm:hidden fixed top-16 left-2 right-2 bg-[#303091] rounded-lg p-4 shadow-lg z-40 transition-all duration-500 ease-in-out ${hamburgerOpen ? 'visible animate-slideIn' : 'invisible animate-slideOut'}`}>
        <div className="flex flex-col gap-4 items-end text-white font-medium"> 
          {isPolice && (
            <>
              <Link href="/police/" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">Dashboard</span>
              </Link>
              <Link href="/police/reports/create" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">Create Report</span>
              </Link>
              <Link href="/police/reports/view" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">View Reports</span>
              </Link>
              <Link href="/police/user" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">Users</span>
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link href="/admin/data" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">Data</span>
              </Link>
              <Link href="/admin/police-management" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">Police Management</span>
              </Link>
              <Link href="/admin/user-management" onClick={() => setHamburgerOpen(false)}>
                <span className="cursor-pointer">User Management</span>
              </Link>
            </>
          )}
          <Link href={`${isPolice ? '/police' : '/user'}/communication`} onClick={() => setHamburgerOpen(false)}>
            <span className="cursor-pointer">Communication</span>
          </Link>
          <Link href={`${isPolice ? '/police' : '/user'}/faq`} onClick={() => setHamburgerOpen(false)}>
            <span className="cursor-pointer">FAQ</span>
          </Link>
          {!isPolice && (
            <Link href="/user/profile" onClick={() => setHamburgerOpen(false)}>
              <span className="cursor-pointer">Profile</span>
            </Link>
          )}
          <button type="button" onClick={() => setIsLogoutDialogOpen(true)} className="w-40 h-8 bg-red-500 text-white hover:bg-red-700 rounded-lg font-semibold shadow-md">
            Logout
          </button>
        </div>
      </div>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </nav>
  )
}