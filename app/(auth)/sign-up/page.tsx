'use client'

import React, { useState, FormEvent, useRef } from 'react';
import SignupAuthForm from '@/components/SignupAuthForm';

export default function SignUpPage(){
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

