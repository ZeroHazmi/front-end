'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import CustomInput from '@/components/CustomInput';
import { authFormSchema } from '@/lib/utils';
import { decodeToken, setCookie, removeCookie } from '@/app/lib/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, useToast } from '@/hooks/use-toast';
import { login } from '@/lib/actions/user.actions';

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const {toast} = useToast();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = authFormSchema(type);
    let _role = '';

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
            if (type === 'sign-in') {

                const response = await login(values.username, values.password);

                if(response){
                    setLoginSuccess(true);
                    setToken(response.token);
                    console.log("Login Successful:", response);

                    const decodedToken = await decodeToken(response.token);
                    console.log("Decoded Token:", decodedToken);
                    console.log("Role:", decodedToken.role);
                    const role : string = decodedToken.role;
                    if(decodedToken.role){
                        
                        console.log("Role found in token is string", role);
                        _role = role;
                        console.log("Role found in token", _role);
                    }else {
                        console.log("Role not found in token");
                    }
                }

        }
          
      } catch (error: any) {
        console.error("Login Failed:", error);
        toast({ title: "Login Failed" });
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {

        if (loginSuccess) {
            setCookie('session', token);

            // need to fix setting role cookie
            setCookie('roles', _role);
            toast({ title: "Login Successful", description: "You have been logged in." });
            console.log("Role in useeffect", _role);

            if(_role === 'User'){
                router.push('/user');
            }else if(_role === 'Police'){
                router.push('/police');
            }
        }
    }, [loginSuccess]);

  return (
    <section className='w-full pl-4 pr-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  
                </>
              )}

              <CustomInput control={form.control} name='username' label="Username" placeholder='Enter your username' id='username-input'/>

              <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' id='password-input'/>

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

export default AuthForm