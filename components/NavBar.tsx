import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const router = useRouter();

    const logout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        // Redirect to the login page
        router.push('/login'); // Adjust the path based on your routes
    };

  return (
        <nav>
            <div className="fixed top-[8px] left-[8px] right-[8px] z-[1000] h-[50px] bg-[#303091] rounded-[8px] flex items-center justify-between px-[10px]">
                <div className="flex items-center">
                    <Image src="/Images/navbarlogo.png" className="w-[35px] h-[35px] rounded-lg mr-[10px]" alt="Logo" height={50} width={50}/>
                    <div className="text-white text-[30px] font-bold">
                        P.R.A.S
                    </div>
                </div>
                <div className="flex gap-[50px] text-white text-[16px] font-medium items-center">
                    <div className="cursor-pointer">Communication</div>
                    <div className="cursor-pointer">FAQ</div>
                    <div className="flex items-center gap-[10px]">
                        <button className="bg-[#e7e7e7] rounded-lg text-black font-semibold px-4 h-[35px] w-[175px] cursor-pointer mr-[10px] shadow-[5px_5px_5px_rgba(0,0,0,0.25)] hover:bg-red-500 hover:text-white" type='button' onClick={logout}>Logout</button>
                        <Image src="https://via.placeholder.com/30x30" className="w-[35px] h-[35px] rounded-lg" alt="User" height={30} width={30}/>
                    </div>
                </div>
            </div>
        </nav>    
    )
};




