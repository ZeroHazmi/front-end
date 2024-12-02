'use client';

import React, { useEffect, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import RegisterCustomInput from '../input/RegisterCustomInput'
import { convertBirthdayFormat, getDistricts, signUpFormSchema } from '@/lib/utils';
import { decodeToken, setCookie } from '@/app/lib/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/actions/user';
import SelectInput from '../input/SelectInput'
import { gender, nationality, descendants, religion, states } from '@/types/constants'
import ICScanner, { ICScannerFields } from './ImageAnalysisForm'

const SignupAuthForm = () => {
    const formSchema = signUpFormSchema();
    const [district, setDistrict] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [registered, setRegistered] = useState(false);
    const [userId, setUserId] = useState("");
    const router = useRouter();
    const {toast} = useToast();

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
            icNumber: "",
            name: ""
        },
    });

    const {watch} = form;
    const selectedState = watch('state');
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Attempting to submit form");
        setIsLoading(true);
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
                    setUserId(decodedToken.nameid);
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

    const onScanComplete = (data: ICScannerFields) => {
        const convertedBirthday = convertBirthdayFormat(data.dateOfBirth);
        form.setValue('icNumber', data.documentNumber);
        form.setValue('name', data.fullName);
        form.setValue('birthday', convertedBirthday);
        form.setValue('gender', data.gender); 
        form.setValue('address', data.address);
        form.setValue('postcode', data.addressFields?.postalCode || '');
        
        const normalizedState = Object.keys(states).find(
            (key) => states[key as keyof typeof states].toLowerCase() === data.addressFields?.state.toLowerCase()
        );
        form.setValue('state', normalizedState || '');
        
        form.setValue('nationality', nationality.Malaysian);
        form.setValue('religion', data.religion || '');
    };
    
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
            setCookie('userId', userId);
            
            toast({ title: "Register Successful", description: "You have successfully registered." });

            const redirectTimeout = setTimeout(() => {
                if (role === 'User') {
                    console.log("Route:", "Within Role User Checker");
                    router.push('/user');
                } else if (role === 'Police') {
                    router.push('/police');
                }
            }, 2000);
            return () => clearTimeout(redirectTimeout);
        }
    }, [registered, token, role, router, userId, toast]);

    return (
        <section className="w-full px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className='w-full max-w-[1200px] mx-auto flex flex-col items-center mt-4 md:mt-[15vh]'>
                        <div className="text-center mb-8 md:mb-[10vh]">
                            <h1 className="font-bold text-4xl md:text-6xl text-7">
                                Register
                            </h1> 
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-5 mb-5">
                            <div className="w-full md:w-[550px] bg-white rounded-lg shadow-left-custom-blue p-4 flex-1">
                                <ICScanner onScanComplete={onScanComplete}/>
                                <RegisterCustomInput control={form.control} name='icNumber' label="IC Number" placeholder='Enter your IC' id='ic-input'/>
                                <RegisterCustomInput control={form.control} name='name' label="Name" placeholder='Enter your name' id='name-input'/>
                                <RegisterCustomInput control={form.control} name='userName' label="Username" placeholder='Enter your username' id='username-input'/>
                                <RegisterCustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' id='password-input'/>
                                <RegisterCustomInput control={form.control} name='repassword' label="Re-enter Password" placeholder='Enter your typed password' id='repassword-input'/>
                                <RegisterCustomInput control={form.control} name='phoneNumber' label="Phone Number" placeholder='Enter your phone number' id='phone-input'/>
                                <RegisterCustomInput control={form.control} name='housePhoneNumber' label="House Phone Number" placeholder='Enter your house phone number' id='house-phone-input'/>
                                <RegisterCustomInput control={form.control} name='officePhoneNumber' label="Office Phone Number" placeholder='Enter your office phone number' id='office-phone-input'/>
                            </div>
                            <div className="w-full md:w-[550px] bg-white rounded-lg shadow-right-custom-blue p-4 flex-1">
                                <RegisterCustomInput control={form.control} name='birthday' label="Birthdate" placeholder='Enter your birthdate' id='birthday-input'/>
                                <SelectInput control={form.control} name='gender' label="Gender" placeholder='Enter your Gender' id='gender-input' options={gender} setValue={form.setValue}/>
                                <SelectInput control={form.control} name='nationality' label="Nationality" placeholder='Enter your nationality' id='nationality-input' options={nationality}/>
                                <SelectInput control={form.control} name='descendants' label="Descendants" placeholder='Enter your descendants' id='descendant-input' options={descendants}/>
                                <SelectInput control={form.control} name='religion' label="Religion" placeholder='Enter your Religion' id='religion-input' options={religion} />
                                <RegisterCustomInput control={form.control} name='address' label="Address" placeholder='Enter your address' id='address-input'/>
                                <RegisterCustomInput control={form.control} name='postcode' label="Postcode" placeholder='Enter your postcode' id='postcode-input'/>
                                <SelectInput control={form.control} name='state' label="States" placeholder='Select a State' id='state-input' options={states} />
                                <SelectInput control={form.control} name='region' label="Districts" placeholder='Select a district' id='district-input' options={district}  />
                                <RegisterCustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' id='email-input'/>
                            </div>
                        </div>
                    
                        <div className="w-full flex justify-center items-center gap-4 mt-5">
                            <Button type='button' onClick={returnToLogin} className='btn-secondary'>Back</Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#0044cc] transition hover:bg-[#0022aa]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Loading...
                                    </>
                                ) : 'Sign Up'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    )
}

export default SignupAuthForm

