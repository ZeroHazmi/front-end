import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '@/lib/actions/user.actions';
import AuthForm from '@/components/AuthForm';
import { cookies } from 'next/headers';

export default async function LoginPage() {
    return (

    <div className="flex flex-col justify-center items-center min-h-screen lg:min-w-[1190px] max-w-[1200px] mx-auto">
        <div className="flex lg:flex-row flex-col justify-center items-center z-30">
            {/* LTS */}
            <div className="flex flex-row justify-center items-center lg:pr-10 lg:pl-8 lg:mr-10 m-2 lg:mb-5 mb-0 z-30">
                <div className="lg:w-[240px] lg:h-[240px] w-[60px] h-[60px]  m-auto my-4 transition-all duration-700 ease-in-out">
                    <Image src="/Images/loginlogo.png" alt="Logo" width={245} height={245}/>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="lg:text-8xl text-5xl font-extrabold font-animation transition-all duration-300 ease-in-out bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-black">
                        P.R.A.S
                    </div>
                    <p className="font-bold break-words lg:text-[15px] text-[7.5px] lg:mr-2 transition-all duration-300 ease-in-out">
                        Police Reporting Artificial intelligence System.
                    </p>
                </div>
            </div>
            <div className="login-bg-animation bg-white lg:py-10 lg:px-10 px-6 py-6 lg:ml-8 rounded-lg lg:w-fit max-w-[475px] m-2">
                <div>
                    <div className="text-4xl font-bold">
                        Welcome to
                    </div>
                    <div className="text-2xl font-medium">
                        Police Reporting Ai System
                    </div>
                    <div className="text-justify text-black py-4 mb-1">
                        This is an AI powered Police Reporting System. It provide online convenience for the public to sumbit police complaint via the internet. This facility is specially provided for lodging police report pertaining to case of lost document or item that doest not relate to the crime
                    </div>
                    <div className="flex flex-col justify-center items-center">     
                           <AuthForm type="sign-in" />
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center text-justify font-medium mt-10 m-4 z-30">
            If there are any problems while using the Ai Police Reporting System, please email the IT Department: zalhazmi.dev@pras.inc.my 
        </div>
    </div>

    );
};


