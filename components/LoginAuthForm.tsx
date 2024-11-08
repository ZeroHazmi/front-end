'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { loginFormSchema } from '@/lib/utils';
import { decodeToken, removeCookie, setCookie } from '@/app/lib/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Form } from './ui/form';
import LoginCustomInput from "@/components/LoginCustomInput";
import { cookies } from 'next/headers';

const LoginAuthForm = ({ type = "sign-in" }: { type: string }) => {
    const router = useRouter();
    const {toast} = useToast();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = loginFormSchema();
    const [role, setRole] = useState("");

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        password: '',
        },
    })
   
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Attempting to submit form"); // New log
        console.log("Form submitted with values:", values); 
        console.log("Form submitted with values:", values); // Add this line
        setIsLoading(true);
        try {
            const response = await login(values.username, values.password);

            if (response){
                setToken(response.token);
                const decodedToken = await decodeToken(response.token);
                console.log("Decoded Token:", decodedToken);
                if (decodedToken.role) {
                    const decodedRole = decodedToken.role.toString();
                    console.log("Role:", decodedRole);
                    setRole(decodedRole);
                }
                setLoginSuccess(true);
                console.log("Login Successful:", response);
            }
          
        } catch (error: any) {
            console.error("Login Failed:", error);
            toast({ title: "Login Failed" });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (loginSuccess && role) {
            
            console.log("Role in useeffect", role);
            console.log("Login Success:", loginSuccess);

            setCookie('session', token);
            setCookie('roles', role);
            
            toast({ title: "Login Successful", description: "You have been logged in." });

            const redirectTimeout = setTimeout(() => {
                if (role === 'User') {
                    console.log("Route:", "Within Role User Checker");
                    router.push('/user');
                } else if (role === 'Police') {
                    router.push('/police');
                }
            }, 2000); // 2-second delay
    
            return () => clearTimeout(redirectTimeout);
        }
    }, [loginSuccess, token, role]);

    return (
        <section className='w-full pl-4 pr-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <LoginCustomInput control={form.control} name='username' label="Username" placeholder='Enter your username' id='username-input'/>

                    <LoginCustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' id='password-input'/>

                    <div className="flex flex-col justify-center items-center gap-4">
                        <Button type="submit" disabled={isLoading} className="bg-[#0044cc] transition hover:bg-[#0022aa] size-[50%]">
                  
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                                </>
                            ) : type === 'sign-in' 
                                ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </div>
                </form>
            </Form>

            <footer className="flex justify-center gap-1">
                <p className="text-14 font-normal text-gray-600">
                    {type === 'sign-in'
                        ? "Don't have an account?"
                        : "Already have an account?"}
                </p>
                <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                    {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                </Link>
            </footer>
        </section>
    )
}

export default LoginAuthForm