'use client'

import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCookie, removeCookie } from "@/app/lib/auth";

export default function PoliceNavBar() {
    const router = useRouter(); // Next.js's rounter hook for router object | componenet navigation/route handling in component
    const [ hamburgerOpen, setHamburgerOpen,] = useState (false); 
    const [admin, setAdmin] = useState(false);
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

    useEffect(() => {
        const checkRoles = async () => {
            const roles = await getCookie("roles");
            if (roles != null) {
                if (roles === "Admin") {
                    setAdmin(true);
                }
            }
        };
        
        checkRoles();
    }, []);

    return (
        <nav>
            {/* STANDARD BACKGROUND */}
            <div className="flex justify-between items-center px-2 shadow-bottom-custom-blue bg-[#303091] h-[50px] fixed top-2 left-2 right-2 rounded-lg z-50 text-white ">
                {/* LOGO & TITLE */}
                <div className="flex items-center justify-start">
                    <Link href="/user/report-submission" className="flex items-center">
                        <Image src="/Images/navbarlogo.png" alt="Logo" className="w-9 h-9 rounded-lg mr-3" height={50} width={50}/>
                        <div className="text-white text-2xl mb-[2px] font-bold">
                            P.R.A.S
                        </div>
                    </Link>
                </div>

                {/* HAMBURGER PLS! - Pink Guy 2013 */}
                <input type="checkbox" id="menu-toggle" className="menu-toggle hidden" />
                <label htmlFor="menu-toggle" className="menu-icon sm:hidden flex justify-center text-white text-[35px] mr-1 cursor-pointer transition-transform duration-200">
                    <FontAwesomeIcon icon={faBars} className="icon-open" />
                    <FontAwesomeIcon icon={faXmark} className="icon-close hidden" />
                </label>
                
                {/* LINK */}
                <div className="flex items-center space-x-6">
                    <Link href="/police/" className="hover:text-gray-200">
                        Dashboard
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center hover:text-gray-200">
                        Reports <ChevronDown className="ml-1 h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link href="/police/reports/create">Create Report</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/police/reports/view">View Reports</Link>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/police/user" className="hover:text-gray-200">
                        Users
                    </Link>
                    <Link href="/police/communication" className="hover:text-gray-200">
                        Communication
                    </Link>
                    <Link href="/police/faq" className="hover:text-gray-200">
                        FAQ
                    </Link>
                    
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
            
            {/* REPONSIVE BACKGROUND FOR MOBILE */}
            <div className="menu sm:hidden fixed top-16 left-2 right-2 bg-[#303091] rounded-lg p-4 shadow-lg z-40 transition-all duration-500 ease-in-out opacity-0 pointer-events-none">
            {/* <div  className={`sm:hidden fixed top-16 left-2 right-2 bg-[#303091] rounded-lg p-4 shadow-lg z-40 transition-all duration-500 ease-in-out ${hamburgerOpen ? 'block opacity-100 animate-slideIn' : 'hidden opacity-0 animate-slideOut'} `}>                  */}
                    <div className="flex flex-col gap-4 items-end text-white font-medium"> 
                        <Link href="/user/communication" onClick={() => setHamburgerOpen(false)}>
                            <span className="cursor-pointer">Communication</span>
                        </Link>
                        <Link href="/user/faq" onClick={() => setHamburgerOpen(false)}>
                            <span className="cursor-pointer">FAQ</span>
                        </Link>
                        <Link href="/user/profile" onClick={() => setHamburgerOpen(false)}>
                            <span className="cursor-pointer">Profile</span>
                        </Link>
                        <button type="button" onClick={logout} className="w-40 h-8 bg-red-500 text-white hover:bg-red-700 rounded-lg font-semibold shadow-md">
                            Logout
                        </button>
                    </div>
                </div>
        </nav>
      );
    };