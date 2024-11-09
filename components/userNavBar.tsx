'use client'

import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from "react";
import { removeCookie } from "@/app/lib/auth";

export default function UserNavBar() {
    const router = useRouter(); // Next.js's rounter hook for router object | componenet navigation/route handling in component
    const [ hamburgerOpen, setHamburgerOpen,] = useState (false); 
    // useState create state variable called hamburgerOpen
    // setHamburgerOpen function update the hamburgerOpen false to true @ true to false

    const logout = () => {
        // Remove the token from local storage
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
            <div className="flex justify-between items-center px-2 shadow-bottom-custom-blue bg-[#303091] h-[50px] fixed top-2 left-2 right-2 rounded-lg z-50 ">
                {/* LOGO & TITLE */}
                <div className="flex items-center justify-start">
                    <Link href="/user/" className="flex items-center">
                        <Image src="/Images/navbarlogo.png" alt="Logo" className="w-9 h-9 rounded-lg mr-3" height={50} width={50}/>
                        <div className="text-white text-2xl mb-[2px] font-bold">
                            P.R.A.S
                        </div>
                    </Link>
                </div>

                {/* HAMBURGER PLS! - Pink Guy 2013 */}
                <div onClick={toggleHamburgerMenu} className={`sm:hidden flex justify-center text-white text-[35px] mr-1  cursor-pointer transition-transform duration-200 ${hamburgerOpen ? 'rotate-180' : 'rotate-0'}`} > {/* ${hamburgerOpen ? 'open' : 'start'}`} */}                                                                                        
                {/* <div className="sm:hidden flex justify-center text-white text-4xl mr-1  cursor-pointer" onClick={toggleHamburgerMenu}> */}
                    {/* <FontAwesomeIcon icon={faBars}/> */}
                    {hamburgerOpen ? (
                        <FontAwesomeIcon icon={faXmark} />
                    ) : ( 
                        <FontAwesomeIcon icon={faBars} />
                    )}
                </div>
                
                {/* LINK */}
                <div className="hidden sm:flex items-center gap-8 text-white font-medium ">
                    <Link href="/user/communication" className="cursor-pointer">
                        Communication
                    </Link>
                    <Link href="/user/faq" className="cursor-pointer">
                        FAQ
                    </Link>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={logout}  className="w-40 h-8 bg-red-500 text-white hover:bg-red-700 hover:text-white rounded-lg font-semibold cursor-pointer mr-3 shadow-[5px_5px_5px_rgba(0,0,0,0.25)]">
                            Logout
                        </button>
                        <Link href="/user/profile" className="cursor-pointer">
                            <Image src="https://via.placeholder.com/30x30" className="w-9 h-9 rounded-lg" alt="User"  height={30} width={30}/>
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* REPONSIVE BACKGROUND FOR MOBILE */}
                {/* <div> className={`hamburger-menu sm:hidden fixed top-16 left-2 right-2 bg-[#303091] rounded-lg p-4 shadow-lg z-40 transform transition-all duration-500 ease-in-out ${hamburgerOpen ? 'animate-slideIn' : 'animate-slideOut'}`}>   */}
                <div  className={`sm:hidden fixed top-16 left-2 right-2 bg-[#303091] rounded-lg p-4 shadow-lg z-40 transition-all duration-500 ease-in-out ${hamburgerOpen ? ' visible animate-slideIn' : 'invisible animate-slideOut'}`}>                 
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
