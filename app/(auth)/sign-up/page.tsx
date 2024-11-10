'use client'

import React, { useState, FormEvent, useRef } from 'react';
import SignupAuthForm from '@/components/SignupAuthForm';

export default function SignUpPage(){
    return (
        <div className="user-signup-body">
        <div className="user-signup-main-container">
                <div className="user-signup-container">
                    <div>
                        <SignupAuthForm />
                    </div>   
                </div>
            </div>
        </div>
    );
};

