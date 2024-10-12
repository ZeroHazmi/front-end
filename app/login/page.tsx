'use client';

import React, { useState, FormEvent } from 'react';
import '../globals.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

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
        <div className="flex justify-center items-center min-h-[98vh] pl-[50px] gap-[300px]">
            <div className="flex items-center relative w-[630px] h-[361px]">
                <Image className="w-[358px] h-[361px]" src="/Images/loginlogo.png" alt="Logo" width={358} height={361}/>
                <div>
                    <div className="ml-[-50px] w-[344px] h-full  flex flex-col justify-center">
                        <h1 className="text-8xl font-extrabold absolute top-[110px] ">
                            P.R.A.S
                        </h1>
                        <p className="font-bold absolute top-[200px] right-[-27px]">
                            Police Reporting Artificial Intelligence System
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-[10px] transform -translate-x-[115px]">
                <div className="relative w-[550px] h-[593px]">
                    <div className="login-bg-animation">
                        <form onSubmit={Login}>
                            <button className="absolute top-[440px] left-[175px] w-[200px] h-[35px] bg-[#0044cc] text-white rounded-[8px] shadow-md font-bold text-[16px] flex items-center justify-center transition duration-400 hover:bg-[#0022aa]" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            <div className="absolute top-[489px] left-[269px] text-center text-black text-[10.24px] font-normal">
                                Or
                            </div>
                            <button className="absolute top-[514px] left-[175px] w-[200px] h-[35px] bg-[#0044cc] text-white rounded-[8px] shadow-md font-bold text-[16px] flex items-center justify-center transition duration-400 hover:bg-[#0022aa]">
                                <Link href="/register">
                                    Register
                                </Link>
                            </button>
                            <div className="absolute top-[342px] left-[130px] w-[290px] h-[35px]">
                                <input type="text" name="username" placeholder="Username or id..." className="w-full h-full bg-white border border-gray-400 rounded-[8px] text-black/50 text-[16px] px-[13px] box-border" required/>
                            </div>
                            <div className="absolute top-[392px] left-[130px] w-[290px] h-[35px]">
                                <input type="password" name="password" placeholder="Password" className="w-full h-full bg-white border border-gray-400 rounded-[8px] text-black/50 text-[16px] px-[13px] box-border" required/>
                            </div>
                            <div className="absolute top-[492px] left-[312px] w-[172px] h-[5px] bg-black rounded-full"></div>
                            <div className="absolute top-[492px] left-[65px] w-[172px] h-[5px] bg-black rounded-full"></div>
                            <div className="absolute top-[148px] left-[65px] w-[420px] text-justify text-black text-[16px] font-normal leading-snug">
                                This is an AI powered Police Reporting system. It provide online convenience for the public to submit police complaint via the Internet. This facility is specially provided for lodging police report pertaining to case of lost document or item that does not relate to crime.
                            </div>
                            <div className="absolute top-[45px] left-[65px] w-[419px] text-justify text-black text-[40px] font-bold">
                                Welcome to
                            </div>
                            <div className="login-subtitle absolute top-[93px] left-[69px] w-[415px] text-justify text-black text-[25px] font-medium">
                                Police Reporting Ai System
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
