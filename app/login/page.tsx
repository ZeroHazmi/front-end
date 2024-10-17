'use client';

import React, { useState, FormEvent } from 'react';
import '../globals.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../globals.css';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRole] = useState<string | null>(null);
    const router = useRouter();
    const {toast} = useToast();

    function decodeToken(token: string) {
        try {
            const decodedToken: any = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);
    
            if (decodedToken.role) {
                setRole(decodedToken.role); // Set the role in state
            }
        } catch (error) {
            console.error('Invalid token:', error);
        }
    }

    useEffect(() => {
        if (roles) {
            console.log('User Role updated:', roles);
            toast({title: 'Login Successful'});
            // You can handle redirection or other logic here based on the role
            if(roles === 'Police') router.push('/police/dashboard');
            if(roles === 'User') router.push('/user/report-submission');
        }
    }, [roles, router, toast]);

    async function Login(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true); // Set loading to true when the request starts
        setError(null); // Reset error state before making the request

        try {
            const formData = new FormData(event.currentTarget);
            const loginData = {
                username: formData.get('username') as string,
                password: formData.get('password') as string
            };

            const response = await fetch('http://localhost:5035/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.status === 401) {
                // Handle 401 specifically for failed login
                toast({variant: 'destructive', title: 'Invalid username or password.'});
                return; // Exit the function if login fails
            }

            if (!response.ok) {
                const errorResponse = await response.json();
                // Use setError to directly store the error message
                toast({variant: 'destructive', title: 'Invalid username or password.'});
                setIsLoading(false); // Stop loading if the request fails
                return; // Exit early if there’s an error
            }

            const data = await response.json();
            const { token } = data;

            // Store token in localStorage (or cookies, depending on your preference)
            localStorage.setItem('token', token);
            

            if (localStorage.getItem('token')) {
                const token = localStorage.getItem('token');
                if (token) {
                    decodeToken(token);
                }
            }

            // Redirect to another page (e.g., dashboard) after successful login

        } catch (error: any) {
            console.error('Login error:', error);
            toast({variant: 'destructive', title: 'Login Failed'});
        } finally {
            setIsLoading(false); // Set loading to false when the request ends
        }
    }

    return (

    <div className="flex flex-col justify-center items-center min-h-screen md:min-w-[1190px] max-w-[1200px] mx-auto">
        <div className="flex md:flex-row flex-col justify-center items-center">
            {/* LTS */}
            <div className="flex md:flex-row flex-col justify-center items-center md:pr-10 md:pl-8 md:mr-10 m-2">
                <div className="w-[240px] h-[240px] m-auto my-4 ">
                    <Image src="/Images/loginlogo.png" alt="Logo" width={245} height={245} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="text-8xl font-extrabold">
                        P.R.A.S
                    </div>
                    <div className="font-bold break-words text-[15px] md:mr-2">
                        Police Reporting Artificial intelligence System.
                    </div>
                </div>
            </div>
            <div className="md:hidden animate-bounce flex justify-center items-center px-4 bg-white mt-[30vh] mb-[5vh] z-30 font-medium rounded-lg h-[35px]  bg-white/20 shadow-lg backdrop-blur-custom border border-white/30">
                <div>
                    <FontAwesomeIcon icon={faAnglesDown} />
                </div>
                <div className='px-4'>
                    login
                </div>
                <div>
                    <FontAwesomeIcon icon={faAnglesDown} />
                </div>
            </div>
            {/* FORM */}
            <div className="login-bg-animation bg-white md:py-10 md:px-10 px-6 py-6 md:ml-8 rounded-lg w-fit m-2">
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
                        <form onSubmit={Login}>     
                            <div className="text-center">
                                <input type="text" name="username" placeholder="Username or id..." className="w-[90%] h-[35px] bg-white border border-gray-400 rounded-lg text-black/50 px-3" required/>
                            </div>
                            <div className="text-center my-2">
                                <input type="password" name="password" placeholder="Password" className="w-[90%] h-[35px] bg-white border border-gray-400 rounded-lg text-black/50  px-3 box-border" required/>
                            </div>
                            <div className='flex items-center justify-center w-[90%] h-[35px] my-2 text-sm'>
                                 <button className="w-[90%] h-[35px]  text-sky-500  flex items-center">
                                    Forgot password?
                                </button>
                            </div>
                            <div className='flex items-center justify-center'>
                                 <button className="w-[90%] h-[35px] bg-[#0044cc] text-white rounded-lg shadow-md font-bold flex items-center justify-center transition duration-400 hover:bg-[#0022aa]" disabled={isLoading} >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                            <div className="flex flex-row items-center justify-center my-2">
                                <div className=" w-32 h-1 bg-black rounded-full"></div>
                                <div className="text-center text-xs font-medium mx-4">
                                    or
                                </div>
                                <div className="w-32 h-1 bg-black rounded-full"></div>
                            </div>
                            <div className='flex items-center justify-center'>
                                <button className="w-[90%] h-[35px] bg-[#0044cc] text-white rounded-lg shadow-md font-bold flex items-center justify-center transition duration-400 hover:bg-[#0022aa]">
                                    <Link href="/register">
                                        Register
                                    </Link>
                                </button>
                            </div>
                        </form>   
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center text-justify font-medium mt-10 m-4">
            If there are any problems while using the Ai Police Reporting System, please email the IT Department: zalhazmi.it@pras.inc.my 
        </div>
    </div>

    );
};
