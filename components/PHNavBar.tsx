import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { removeCookie } from '@/app/lib/auth';

export default function PHNavBar() {
    const router = useRouter();

    const logout = () => {
        // Remove the token from local storage
        removeCookie("session");
        removeCookie("roles");
        // Redirect to the login page
        router.push('/login'); // Adjust the path based on your routes
    };

  return (
        <nav>
            <div className="fixed top-2 left-2 right-2 z-[1000] h-[50px] bg-[#303091] rounded-lg flex items-center justify-between px-2 shadow-bottom-custom-blue">
                {/* LOGO/TILTE */}
                <div>
                    <Link href="/user/" className="flex items-center">
                        <Image src="/Images/navbarlogo.png" className="w-[35px] h-[35px] rounded-lg mr-[10px]" alt="Logo" height={50} width={50}/>
                        <div className="text-white text-[30px] font-bold">                            
                            P.R.A.S
                        </div>
                    </Link>
                </div>
                {/* LINK */}
                <div className="flex gap-[50px] text-white text-[16px] font-medium items-center">
                    <div className="cursor-pointer">
                        [PH]
                    </div>
                        <Link href="/user/communication">
                            Communication
                        </Link>
                    <div className="">
                        <Link href="/user/faq">
                            FAQ
                        </Link>
                    </div>
                    {/* <div className="cursor-pointer"></div> */}
                    <div className="flex items-center gap-[10px]">
                        <button type='button' onClick={logout} className="bg-red-600 text-white hover:bg-red-700 hover:text-white rounded-lg  font-semibold px-4 h-[35px] w-[175px] cursor-pointer mr-[10px] shadow-[5px_5px_5px_rgba(0,0,0,0.25)] ">
                            Logout
                        </button>
                        <Image src="https://via.placeholder.com/30x30" className="w-[35px] h-[35px] rounded-lg" alt="User" height={30} width={30}/>
                    </div>
                </div>
            </div>
        </nav>    
    )
};




