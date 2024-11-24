import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCookie, removeCookie } from "@/app/lib/auth";

const AdminNavBar = () => {

    const router = useRouter(); // Next.js's rounter hook for router object | componenet navigation/route handling in component
    const [ hamburgerOpen, setHamburgerOpen,] = useState (false); 
    // useState create state variable called hamburgerOpen
    // setHamburgerOpen function update the hamburgerOpen false to true / true to false

    const logout = () => {
        removeCookie("session");
        removeCookie("roles");
        
        // Redirect to the login page
        router.push('/login'); // Adjust the path based on your routes
    };

    const toggleHamburgerMenu = () => { // switcher
        setHamburgerOpen(!hamburgerOpen); // setHamburgerOpen updates hamburgerOpen depends on false or true and switch it
    };
    
  return (
    <nav>
      {/* STANDARD BACKGROUND */}
      <div className="flex justify-between items-center px-2 shadow-bottom-custom-blue bg-[#303091] h-[50px] fixed top-2 left-2 right-2 rounded-lg z-50 text-white">
        {/* LOGO & TITLE */}
        <div className="flex items-center justify-start">
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/Images/navbarlogo.png"
              alt="Logo"
              className="w-9 h-9 rounded-lg mr-3"
              height={50}
              width={50}
            />
            <div className="text-white text-2xl mb-[2px] font-bold">
              Admin Panel
            </div>
          </Link>
        </div>

        {/* HAMBURGER */}
        <button
          onClick={toggleHamburgerMenu}
          className="sm:hidden text-white text-[35px] mr-1 cursor-pointer"
        >
          {hamburgerOpen ? (
            <FontAwesomeIcon icon={faXmark} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>

        {/* NAV LINKS */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="/admin/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>

          {/* POLICE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:text-gray-200">
              Police <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/admin/police/reports">Reports</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/police/users">Users</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:text-gray-200">
              Users <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/admin/user/profile">Profiles</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/user/management">Management</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* DATA LINK */}
          <Link href="/admin/data" className="hover:text-gray-200">
            Data
          </Link>

          {/* LOGOUT */}
          <Button
            onClick={logout}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>

          <UserCircle className="w-8 h-8 cursor-pointer" />
        </div>
      </div>

      {/* RESPONSIVE MOBILE MENU */}
      {hamburgerOpen && (
        <div className="sm:hidden fixed top-16 left-2 right-2 bg-[#303091] rounded-lg p-4 shadow-lg z-40 text-white">
          <div className="flex flex-col gap-4">
            <Link href="/admin/dashboard" onClick={toggleHamburgerMenu}>
              Dashboard
            </Link>
            <Link href="/admin/police/reports" onClick={toggleHamburgerMenu}>
              Police Reports
            </Link>
            <Link href="/admin/police/users" onClick={toggleHamburgerMenu}>
              Police Users
            </Link>
            <Link href="/admin/user/profile" onClick={toggleHamburgerMenu}>
              User Profiles
            </Link>
            <Link href="/admin/user/management" onClick={toggleHamburgerMenu}>
              User Management
            </Link>
            <Link href="/admin/data" onClick={toggleHamburgerMenu}>
              Data
            </Link>
            <button
              type="button"
              onClick={logout}
              className="w-40 h-8 bg-red-500 text-white hover:bg-red-700 rounded-lg font-semibold shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default AdminNavBar
