import Image from 'next/image'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import RegisterCustomInput from './RegisterCustomInput'
import { getDistricts, signUpFormSchema } from '@/lib/utils';
import { decodeToken, setCookie, removeCookie } from '@/app/lib/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, useToast } from '@/hooks/use-toast';
import { login } from '@/lib/actions/user.actions';
import SelectInput from './SelectInput'
import { gender, nationality, descendants, religion, states } from '@/types/constants'
import { Router } from 'express'

const SignupAuthForm = () => {
    const formSchema = signUpFormSchema();
    const [district, setDistrict] = useState<string[]>([]);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // Watch the selected state

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: '',
            birthday: "",
            gender: "",
            nationality: "",
            descendants: "",
            religion: "",
            phoneNumber: "",
            housePhoneNumber: "",
            officePhoneNumber: "",
            address: "",
            postcode: "",
            state: "",
            region: "",
            email: "",
            icNumber: ""
        },
    })

    const {watch} = form;
    const selectedState = watch('state');

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        // Perform validation checks before proceeding
        try {
    
            const response = await fetch('http://localhost:5035/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse); // Log the full error
            
                // Extract a meaningful message from the errorResponse object
                const errorMessage = errorResponse.title || 'Registration failed'; // You can customize this based on the structure of the errorResponse
            
                // Pass the error message as a string to the toast
                toast({ variant: 'destructive', description: errorMessage });
                
                return;
            }else{
                toast({description: 'Registration successful'});
            }
    
            const data = await response.json();
            const { token, userName } = data;
    
            // Store token in localStorage (or cookies)
    
            // Redirect to another page (e.g., dashboard) after successful registration
            router.push('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            toast({variant: 'destructive', description: 'Registration failed'});

        } finally {
            setIsLoading(false);
        }
    }

    function returnToLogin() {
        router.push('/login');
    }

    useEffect(() => {
        if (selectedState) {
            const districts = getDistricts(selectedState);
            setDistrict(districts);
        }
    }, [selectedState])

    return (
        <section>
      
            <div className="user-signup-title">
                Register
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="user-signup-left-form">
                        <RegisterCustomInput control={form.control} name='icnumber' label="IC Number" placeholder='Enter your IC' id='ic-input'/>
                        {/* add file picker beside IC input */}
                        <RegisterCustomInput control={form.control} name='username' label="Username" placeholder='Enter your username' id='username-input'/>
                        <RegisterCustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' id='password-input'/>
                        <RegisterCustomInput control={form.control} name='repassword' label="Re-enter Password" placeholder='Enter your typed password' id='repassword-input'/>
                        
                        {/* Birthday Picker */}
                        <RegisterCustomInput control={form.control} name='birthday' label="Birthdate" placeholder='Enter your birthdate' id='birthday-input'/>
                        <SelectInput control={form.control} name='gender' label="Gender" placeholder='Enter your Gender' id='gender-input' options={gender}/>
                        <SelectInput control={form.control} name='nationality' label="Nationality" placeholder='Enter your nationality' id='nationality-input' options={nationality}/>
                        <SelectInput control={form.control} name='descendants' label="Descendants" placeholder='' id='descendant-input' options={descendants}/>
                        <SelectInput control={form.control} name='religion' label="Religion" placeholder='Enter your Religion' id='religion-input' options={religion} />

                        <RegisterCustomInput control={form.control} name='phoneNumber' label="Phone Number" placeholder='Enter your phone number' id='phone-input'/>
                        <RegisterCustomInput control={form.control} name='housePhoneNumber' label="House Phone Number" placeholder='Enter your house phone number' id='house-phone-input'/>
                        <RegisterCustomInput control={form.control} name='officePhoneNumber' label="Office Phone Number" placeholder='Enter your office phone number' id='office-phone-input'/>
                    </div>
                    <div className="user-signup-right-form">
                        <RegisterCustomInput control={form.control} name='address' label="Address" placeholder='Enter your address' id='address-input'/>
                        <RegisterCustomInput control={form.control} name='postcode' label="Postcode" placeholder='Enter your postcode' id='postcode-input'/>
                        <SelectInput control={form.control} name='state' label="States" placeholder='Select a State' id='state-input' options={states} />
                        <SelectInput control={form.control} name='region' label="Districts" placeholder='Select a district' id='district-input' options={district}  />
                        <RegisterCustomInput control={form.control} name='email' label="Email" placeholder='Enter your password' id='password-input'/>
                        <RegisterCustomInput control={form.control} name='reemail' label="Re-enter Email" placeholder='Enter your password' id='password-input'/>
                        <Button type="submit" className="btn-primary">Sign Up</Button>
                        <Button type='button' onClick={returnToLogin} className='btn-secondary'>Back</Button>
                    </div>
                </form>
            </Form>

        </section>
    )
}

export default SignupAuthForm
