'use client'

import { RegistrationForm } from '@/components/user/registration-form';

export default function SignUpPage(){
    return (
        <div className="user-signup-body">
        <div className="user-signup-main-container">
                <div className="user-signup-container">
                    <div>
                        <RegistrationForm />
                    </div>   
                </div>
            </div>
        </div>
    );
};

