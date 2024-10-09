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
            // You can handle redirection or other logic here based on the role
            if(roles === 'Police') router.push('/police-user-management');
            if(roles === 'User') router.push('/user-report-submission');
        }
    }, [roles, router]);

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
        <div className="login-container">
            <div className="login-logo-text">
                    <Image className="login-logo" src="/Images/loginlogo.png" alt="Logo" width={358} height={361}/>
                    <div className="login-text">
                        <div className="login-font-police">Police</div>
                        <div className="login-font-reporting">Reporting</div>
                        <div className="login-font-ai">Artificial Intelligence</div>
                        <div className="login-font-system">System</div>
                    </div>
                </div>
                <div className="login-form">
                    <div className="login-form-container">
                        <div className="login-form-bg"></div>
                        <form onSubmit={Login}>
                            <button className="login-login-button" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            <div className="login-form-or">
                                Or
                            </div>
                            <button className="login-register-button">
                                <Link href="/register">
                                    Register
                                </Link>
                            </button>
                            <div className="login-username-id">
                                <input type="text" name="username" placeholder="Username or id..." className="login-username-id-textfield" required/>
                            </div>
                            <div className="login-password">
                                <input type="password" name="password" placeholder="Password" className="login-password-textfield" required/>
                            </div>
                            <div className="login-leftformmustache"></div>
                            <div className="login-rightformmustache"></div>
                            <div className="login-discription">
                                This is an AI powered Police Reporting system. It provide online convenience for the public to submit police complaint via the Internet. This facility is specially provided for lodging police report pertaining to case of lost document or item that does not relate to crime.
                            </div>
                            <div className="login-title">
                                Welcome to
                            </div>
                            <div className="login-subtitle">
                                Police Reporting Ai System
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
};
