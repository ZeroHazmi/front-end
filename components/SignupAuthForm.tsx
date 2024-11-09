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
import { login, registerUser } from '@/actions/user';
import SelectInput from './SelectInput'
import { gender, nationality, descendants, religion, states } from '@/types/constants'
import { Router } from 'express'
import ICScanner from './ImageAnalysisForm'

const SignupAuthForm = () => {
    const formSchema = signUpFormSchema();
    const [district, setDistrict] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [registered, setRegistered] = useState(false);
    // Watch the selected state
    const router = useRouter();
    const {toast} = useToast();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            password: "",
            repassword: "",
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
    });

    const {watch} = form;
    const selectedState = watch('state');
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Attempting to submit form");
        setIsLoading(true);
        // Perform validation checks before proceeding
        const { repassword, ...filteredValues } = values;

        try {
            const response = await registerUser(filteredValues);
            console.log("Register Info:", response);
            
            if(response){
                setToken(response.token);
                const decodedToken = await decodeToken(response.token);
                console.log("Decoded Token:", decodedToken);
                if (decodedToken.role) {
                    const decodedRole = decodedToken.role.toString();
                    console.log("Role:", decodedRole);
                    setRole(decodedRole);
                }
                setRegistered(true);
                console.log("Registration Successful:", response);
            }
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

    useEffect(() => {
        if (registered && role) {
            
            console.log("Role in useeffect", role);
            console.log("Register Success:", registered);

            setCookie('session', token);
            setCookie('roles', role);
            
            toast({ title: "Register Successful", description: "You have successfully registered." });

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
    }, [registered, token, role]);

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* MAIN CONTAINER */}
                    <div className='w-[1200px] flex flex-wrap justify-center items-center mt-[15vh]'>
                        {/* TITLE CONTAINER */}
                        <div className="flex justify-center items-center font-bold text-6xl  text-center text-7 mb-[10vh]">
                            <h1>
                                Register
                            </h1> 
                        </div>
                        {/* CONTAINERS 1&2 */}
                        <div className="max-w-[1200px] min-w-[550px] flex justify-center items-center flex-wrap gap-5 mb-5">
                            <div className="w-[550px] bg-white  rounded-lg shadow-left-custom-blue p-4">
                                <RegisterCustomInput control={form.control} name='icNumber' label="IC Number" placeholder='Enter your IC' id='ic-input'/>
                                {/* <ICScanner /> */}
                                {/* add file picker beside IC input */}
                                <RegisterCustomInput control={form.control} name='userName' label="Username" placeholder='Enter your username' id='username-input'/>
                                <RegisterCustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' id='password-input'/>
                                <RegisterCustomInput control={form.control} name='repassword' label="Re-enter Password" placeholder='Enter your typed password' id='repassword-input'/>
                                <RegisterCustomInput control={form.control} name='phoneNumber' label="Phone Number" placeholder='Enter your phone number' id='phone-input'/>
                                <RegisterCustomInput control={form.control} name='housePhoneNumber' label="House Phone Number" placeholder='Enter your house phone number' id='house-phone-input'/>
                                <RegisterCustomInput control={form.control} name='officePhoneNumber' label="Office Phone Number" placeholder='Enter your office phone number' id='office-phone-input'/>
                            </div>
                            <div className="w-[550px] h bg-white   rounded-lg shadow-right-custom-blue p-4">
                            {/* Birthday Picker */}
                                <RegisterCustomInput control={form.control} name='birthday' label="Birthdate" placeholder='Enter your birthdate' id='birthday-input'/>
                                <SelectInput control={form.control} name='gender' label="Gender" placeholder='Enter your Gender' id='gender-input' options={gender}/>
                                <SelectInput control={form.control} name='nationality' label="Nationality" placeholder='Enter your nationality' id='nationality-input' options={nationality}/>
                                <SelectInput control={form.control} name='descendants' label="Descendants" placeholder='Enter your descendants' id='descendant-input' options={descendants}/>
                                <SelectInput control={form.control} name='religion' label="Religion" placeholder='Enter your Religion' id='religion-input' options={religion} />
                            </div>
                        </div>
                    
                        <div className=" max-w-[1200px] min-w-[550px] flex  justify-center items-center   border-solid flex-wrap gap-5 ">
                            <div className=" w-[550px] bg-white  rounded-lg shadow-bottom-custom-blue p-4">
                                <RegisterCustomInput control={form.control} name='address' label="Address" placeholder='Enter your address' id='address-input'/>
                                <RegisterCustomInput control={form.control} name='postcode' label="Postcode" placeholder='Enter your postcode' id='postcode-input'/>
                                <SelectInput control={form.control} name='state' label="States" placeholder='Select a State' id='state-input' options={states} />
                                <SelectInput control={form.control} name='region' label="Districts" placeholder='Select a district' id='district-input' options={district}  />
                                <RegisterCustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' id='email-input'/>
                            </div>
                            <div className="flex justify-around items-center w-[550px] bg-white rounded-lg shadow-bottom-custom-blue p-4">
                            <div className="flex flex-col justify-center items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#0044cc] transition hover:bg-[#0022aa]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                                        </>
                                    ) : 'Sign Up'}
                                </Button>
                            </div>
                                <Button type='button' onClick={returnToLogin} className='btn-secondary'>Back</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>

        </section>
    )
}

export default SignupAuthForm

