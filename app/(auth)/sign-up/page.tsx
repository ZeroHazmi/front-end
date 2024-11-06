'use client'

import React, { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AppUser } from '@/types/index.d';
import { registerUser } from '@/lib/actions/user.actions';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import SignupAuthForm from '@/components/SignupAuthForm';

export default function SignUpPage(){
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { toast } = useToast();
    const [icImage, setIcImage] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<Partial<AppUser>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="user-signup-body">
        <div className="user-signup-main-container">
                <div className="user-signup-container">
                    <div className="user-signup-title">
                        Register
                    </div>
                    <div>
                        <SignupAuthForm />
                    </div>   
                </div>
                <div className="mt-[1vh]">
                    If there are any problems while using the Ai Police Reporting system, please email the IT department: zalhazmi@gmail.com
                </div>
            </div>
        </div>
    );
};

