'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { loginFormSchema } from '@/lib/utils';
import { decodeToken, setCookie } from '@/app/lib/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Form } from '../ui/form';
import LoginCustomInput from "@/components/input/LoginCustomInput";
import { login } from '@/actions/user';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginAuthForm = ({ type = "sign-in" }: { type: string }) => {
    const router = useRouter();
    const {toast} = useToast();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = loginFormSchema();
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState("");
    const { language, setLanguage, t } = useLanguage();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            icNumber: "",
            password: "",
        },
    })
   
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const response = await login(values.icNumber, values.password);

            if (response){
                setToken(response.token);
                const decodedToken = await decodeToken(response.token);
                if (decodedToken.role) {
                    const decodedRole = decodedToken.role.toString();
                    setRole(decodedRole);
                    setUserId(decodedToken.nameid);
                }
                setLoginSuccess(true);
                toast({ title: t.loginSuccess, description: t.loginSuccessDesc });

            }
          
        } catch (error: any) {
            toast({ title: t.loginFailed, description: t.loginFailedDesc, variant: "destructive" });

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (loginSuccess && role) {
            setCookie('session', token);
            setCookie('roles', role);
            setCookie('userId', userId);
            
            const redirectTimeout = setTimeout(() => {
                if (role === 'User') {
                    console.log("Route:", "Within Role User Checker");
                    router.push('/dashboard');
                } else if (role === 'Police') {
                    router.push('/police');
                } else if (role === 'Admin') {
                    router.push('/admin');
                }
            }, 2000); // 2-second delay
    
            return () => clearTimeout(redirectTimeout);
        } else {
            console.log("Login Failed");
        }
    }, [loginSuccess, token, role, router, userId]);

    return (
        <section className='w-full pl-4 pr-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <LoginCustomInput 
                        control={form.control} 
                        name='icNumber' 
                        label={t.icNumber || t.username} 
                        placeholder={t.enterIC || t.enterUsername} 
                        id='ic-input'
                    />

                    <LoginCustomInput 
                        control={form.control} 
                        name='password' 
                        label={t.password} 
                        placeholder={t.enterPassword} 
                        id='password-input'
                    />

                    <div className="flex flex-col justify-center items-center gap-4">
                        <Button type="submit" disabled={isLoading} className="bg-[#0044cc] transition hover:bg-[#0022aa] size-[50%]">
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                                    {t.loading}
                                </>
                            ) : type === 'sign-in' 
                                ? t.signIn : t.signUp}
                        </Button>
                    </div>
                </form>
            </Form>

            <footer className="flex justify-center gap-1 mt-2">
                <p className="text-14 font-normal text-gray-600">
                    {type === 'sign-in'
                        ? t.noAccount
                        : t.haveAccount}
                </p>
                <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link text-police-blue">
                    {type === 'sign-in' ? t.signUp : t.signIn}
                </Link>
            </footer>
        </section>
    )
}

export default LoginAuthForm

