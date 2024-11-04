'use client'

import React, { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AppUser } from '@/types/index.d';
import { registerUser } from '@/lib/actions/user.actions';
import Tesseract from 'tesseract.js';
import Image from 'next/image';

export default function SignUpPage(){
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { toast } = useToast();
    const [icImage, setIcImage] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<Partial<AppUser>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function Register(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const form = event.currentTarget;
        const password = form.password.value;
        const repassword = form.repassword.value;
        const email = form.email.value;
        const reemail = form.reemail.value;

        if (password !== repassword) {
            setIsLoading(false);
            toast({ variant: 'destructive', description: 'Password does not match' });
            return;
        }

        const validatePassword = (password: string): boolean => {
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
            return passwordRegex.test(password);
        };

        if (!validatePassword(password)) {
            setIsLoading(false);
            toast({
                variant: 'destructive',
                description: 'Password does not meet the requirement: at least one digit, one lowercase and uppercase letter, one special character, and a minimum of 6 characters.'
            });
            return;
        }

        if (email !== reemail) {
            setIsLoading(false);
            toast({ variant: 'destructive', description: 'Email does not match' });
            return;
        }

        const formData = new FormData(form);
        const registerData: AppUser = {
            userName: formData.get('username') as string,
            email: formData.get('email') as string,
            phoneNumber: formData.get('phone') as string,
            password: formData.get('password') as string,
            icNumber: formData.get('icnumber') as string,
            birthday: formData.get('birthday') as string,
            gender: formData.get('gender') as string,
            nationality: formData.get('nationality') as string,
            descendants: formData.get('descendants') as string,
            religion: formData.get('religion') as string,
            housePhoneNumber: formData.get('housephone') as string,
            officePhoneNumber: formData.get('officephone') as string,
            address: formData.get('address') as string,
            postcode: formData.get('postcode') as string,
            region: formData.get('region') as string,
            state: formData.get('states') as string,
        };

        try {
            const data = await registerUser(registerData);
            const { token } = data;

            toast({ description: 'Registration successful' });
            router.push('/login');  
        } catch (error: any) {
            console.error('Registration error:', error);
            toast({ variant: 'destructive', description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIcImage(file);
            const { data: { text } } = await Tesseract.recognize(file, 'eng', {
                logger: (m) => console.log(m) // Optional: for logging the recognition progress
            });

            // Process the extracted text to fill the form
            extractInfoFromIc(text);
        }
    };

    const extractInfoFromIc = (text: string) => {
        // Basic parsing logic to extract necessary fields from the text
        // You might need to adjust this logic based on the actual text format you get from the IC
        const lines = text.split('\n');
        const icNumber = lines.find(line => /\d{6}-\d{2}-\d{4}/.test(line))?.trim(); // Match the IC Number format
        const address = lines.find(line => line.includes("Address"))?.split(":")[1]?.trim();
        const religion = lines.find(line => line.includes("Religion"))?.split(":")[1]?.trim();
        const nationality = lines.find(line => line.includes("Warganegara"))?.split(":")[1]?.trim();
        const gender = lines.find(line => line.includes("Gender"))?.split(":")[1]?.trim();

        setExtractedData({
            icNumber: icNumber || '',
            address: address || '',
            religion: religion || '',
            nationality: nationality || '',
            gender: gender || ''
        });
    };

    const handleScanClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <form onSubmit={Register}>
            <div className="user-signup-body">
                <div className="user-signup-main-container">
                    <div className="user-signup-container">
                        <div className="user-signup-title">
                            Register
                        </div>
                        <div className="user-signup-left-form">
                            <div className="user-signup-left-form-bg"></div>
                            <div className="user-signup-username">
                                Username
                            </div>
                            <input className="user-signup-username-textfield" name='username' required></input>
                            <div className="user-signup-password">
                                Password
                            </div>
                            <input className="user-signup-password-textfield" name='password' type='password' required></input>
                            <div className="user-signup-repassword">
                                Re-enter Password
                            </div>
                            <input className="user-signup-repassword-textfield" name='repassword' type='password' required></input>
                            <div className="user-signup-birthday">
                                Birthday
                            </div>
                            <input className="user-signup-birthday-textfield-l" type='date' name='birthday' required></input>
                            <div className="user-signup-gender">
                                Gender
                            </div>
                            <select className="user-signup-gender-dropdown" name='gender' required>
                                <option value="" disabled>Select your Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <div className="user-signup-nationality">
                                Nationality
                            </div>
                            <select className="user-signup-nationality-dropdown" name='nationality' required>
                                <option value="" disabled>Select your Nationality</option>
                                <option value="malay">Malay</option>
                                <option value="chinese">Chinese</option>
                                <option value="indian">Indian</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="user-signup-descendants">
                                Descendants
                            </div>
                            <select className="user-signup-descendants-dropdown" name='descendants' required>
                                <option value="" disabled hidden>Select your Descendants</option>
                                <option value="malay">Malay</option>
                                <option value="chinese">Chinese</option>
                                <option value="indian">Indian</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="user-signup-religion">
                                Religion
                            </div>
                            <select className="user-signup-religion-dropdown" name='religion' required>
                                <option value="" disabled hidden>Select your Religion</option>
                                <option value="islam">Islam</option>
                                <option value="buddhism">Buddhism</option>
                                <option value="christianity">Christianity</option>
                                <option value="hinduism">Hinduism</option>
                                <option value="aetheist">atheist</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="user-signup-phone-no">
                                Phone Number
                            </div>
                            <input className="user-signup-phone-no-textfield" type='phone' name='phone' required></input>
                            <div className="user-signup-rephone-no">
                                Re-Enter Phone Number
                            </div>
                            <input className="user-signup-rephone-no-textfield" type='phone' name='housephone'></input> 
                            <div className="user-signup-housephone-no">
                                House Phone Number
                            </div>
                            <input className="user-signup-housephone-no-textfield"></input>

                            <div className="user-signup-officephone-no">
                                Office Phone Number
                            </div>
                            <input className="user-signup-officephone-no-textfield" type='phone' name='officephone'></input>
                        </div>
                        <div className="user-signup-right-form">
                            <div className="user-signup-left-form-bg"></div>
                            <div className="user-signup-address">
                                Address
                            </div>
                            <textarea className="user-signup-address-textfield-1" name='address' rows={5} required></textarea>
                            <div className="user-signup-passcode">
                                Postcode
                            </div>
                            <input className="user-signup-passcode-textfield" name='postcode' required></input>
                            <div className="user-signup-state-region">
                                State and Region
                            </div>
                            <select className="user-signup-state-region-dropdown-1" name='states' required>
                                <option value="" disabled hidden>Select your Region</option>
                                <option value="Johor">Johor</option>
                                <option value="Kedah">Kedah</option>
                                <option value="Kelantan">Kelantan</option>
                                <option value="Melaka">Melaka</option>
                                <option value="Negeri Sembilan">Negeri Sembilan</option>
                                <option value="Pahang">Pahang</option>
                                <option value="Penang">Penang</option>
                                <option value="Perak">Perak</option>
                                <option value="Perlis">Perlis</option>
                                <option value="Selangor">Selangor</option>
                                <option value="Terengganu">Terengganu</option>
                                <option value="Sabah">Sabah</option>
                                <option value="Sarawak">Sarawak</option>
                                <option value="Kuala Lumpur">Kuala Lumpur</option>
                                <option value="Putrajaya">Putrajaya</option>
                                <option value="Labuan">Labuan</option>
                            </select>
                            <select className="user-signup-state-region-dropdown-2" name='region' required>
                                <option value="" disabled hidden>Select your Region</option>
                                <option value="peninsular_malaysia">Peninsular Malaysia (West Malaysia)</option>
                                <option value="east_malaysia">East Malaysia (Malaysian Borneo)</option>
                            </select>
                            <div className="user-signup-email">
                                Email
                            </div>
                            <input className="user-signup-email-textfield" type='email' name='email' required></input>
                            <div className="user-signup-reemail">
                                Re-Enter Email
                            </div>
                            <input className="user-signup-reemail-textfield" type='email' name='reemail' required></input>
                            <div className="user-signup-red-text">
                                All of above needs to be filled
                            </div>
                            <button className="user-signup-signup-button" type='submit' disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                            </button>
                            <button className="user-signup-return-button" type='button'>
                                <Link href="/login">
                                    Return        
                                </Link>
                            </button>
                        </div>
                        <div className="user-signup-upper-form">
                            <div className="user-signup-upper-form-bg"></div>
                            <div className="user-signup-icid">
                                IC or ID Card Number
                            </div>
                            <input type="text" className="user-signup-icid-textfield" name='icnumber'/>

                            <div className="user-signup-icid-img">
                                IC or ID Card image
                            </div>
                            <div className="user-signup-or" style={{ width: '61px', left: '285px', top: '114px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '16px', fontWeight: 500, wordWrap: 'break-word' }}>
                                Or
                            </div>
                            {/* <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".png, .jpg, .jpeg"
                                    style={{ 
                                        position: 'absolute', 
                                        opacity: 1, 
                                        width: '100%', 
                                        height: '100%', 
                                        top: 0, 
                                        left: 0, 
                                        cursor: 'pointer' 
                                    }} 
                                    onChange={handleImageUpload}
                                /> */}
                            <button className="user-signup-icid-img-button" onClick={handleScanClick}>
                                <span className="material-symbols-outlined">
                                    flip
                                </span>
                                Scan IC/ID
                                
                            </button>


                            <div className="user-signup-mustaches-right"></div>
                            <div className="user-signup-mustaches-left"></div>
                            {/*  chechbox&button position */}
                            <div className="user-signup-icmissing-bg">
                                <input  className=" w-[15px] h-[15px] absolute left-[-2.3px] top-[8.5px] transform scale-[1.2] bg-white rounded-[6.68px] border-[#e0e4eb] border-[1.67px] outline-[3px] cursor-pointer" type="checkbox" id="icmissing" name="icmissing" value="icmissing" />
                                <label>
                                {/* onclick="document.getElementById('icmissing').checked = !document.getElementById('icmissing').checked;" */}
                                    <button  className="user-signup-checkbox-button" type="button" >
                                        IC only missing
                                    </button>
                                </label>

                            </div>
                        </div>
                    </div>
                    <div className="mt-[1vh]">
                        If there are any problems while using the Ai Police Reporting system, please email the IT department: zalhazmi@gmail.com
                    </div>
                </div>
            </div>
        </form>
    );
};

