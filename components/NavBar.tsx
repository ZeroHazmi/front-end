'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'
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
import { useLanguage } from "@/contexts/LanguageContext"

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage();

  const isActive = (href: string) => pathname === href

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
              <Link href="/police" className={`hover:text-gray-200 cursor-pointer ${isActive('/police') ? 'font-bold underline' : ''}`}>
                Police
              </Link>
              <Link href="/police/report-management" className={`hover:text-gray-200 cursor-pointer ${isActive('/police/report-management') ? 'font-bold underline' : ''}`}>
                Reports Management
              </Link>
              <Link href="/police/create-report" className={`hover:text-gray-200 cursor-pointer ${isActive('/police/create-report') ? 'font-bold underline' : ''}`}>
                Create Report
              </Link>
              <Link href="/police/user" className={`hover:text-gray-200 cursor-pointer ${isActive('/police/user') ? 'font-bold underline' : ''}`}>
                Users
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link href="/admin/data" className={`hover:text-gray-200 cursor-pointer ${isActive('/admin/data') ? 'font-bold underline' : ''}`}>
                Data Analytics
              </Link>
              <Link href="/admin/police-management" className={`hover:text-gray-200 cursor-pointer ${isActive('/admin/police-management') ? 'font-bold underline' : ''}`}>
                Police Management
              </Link>
              <Link href="/admin/user-management" className={`hover:text-gray-200 cursor-pointer ${isActive('/admin/user-management') ? 'font-bold underline' : ''}`}>
                User Management
              </Link>
              <Link href="/admin/faq" className={`hover:text-gray-200 cursor-pointer ${isActive('/admin/faq') ? 'font-bold underline' : ''}`}>
                FAQ
              </Link>
            </>
          )}
          {isUser && (
            <>
                <button
                    onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {language === 'en' ? 'BM' : 'EN'}
                </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center hover:text-gray-200">
                  Reports <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/user/reports/new" className={`hover:text-gray-200 cursor-pointer ${isActive('/user/reports/new') ? 'font-bold underline' : ''}`}>
                      Create New Report
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/user/reports/view" className={`hover:text-gray-200 cursor-pointer ${isActive('/user/reports/view') ? 'font-bold underline' : ''}`}>
                      View Submitted Reports
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/user/faq" className={`hover:text-gray-200 cursor-pointer ${isActive('/user/faq') ? 'font-bold underline' : ''}`}>
                FAQ
              </Link>
            </>
          )}
          <Button
            onClick={() => setIsLogoutDialogOpen(true)}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
          {isPolice || isAdmin ? (
            <UserCircle className="w-8 h-8 cursor-pointer" />
          ) : (
            <Link href="/user/profile" className={`hover:text-gray-200 cursor-pointer ${isActive('/user/profile') ? 'font-bold underline' : ''}`}>
              <FontAwesomeIcon icon={faUser} height={30} width={30} />
            </Link>
          )}
        </div>
      </div>

      {/* ...rest of the mobile menu implementation... */}
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </nav>
  )
}