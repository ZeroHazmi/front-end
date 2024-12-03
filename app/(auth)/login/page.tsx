'use client';

import Image from 'next/image';
import LoginAuthForm from '@/components/Form/LoginAuthForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
    const { t, language, setLanguage } = useLanguage();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen lg:min-w-[1190px] max-w-[1200px] mx-auto">
            <div className="flex justify-end w-full mb-4">
                <button
                    onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {language === 'en' ? 'BM' : 'EN'}
                </button>
            </div>
            <div className="flex lg:flex-row flex-col justify-center items-center z-30">
                {/* LTS */}
                <div className="flex flex-row justify-center items-center lg:pr-10 lg:pl-8 lg:mr-10 m-2 lg:mb-5 mb-0 z-30">
                    <div className="lg:w-[240px] lg:h-[240px] w-[60px] h-[60px]  m-auto my-4 transition-all duration-700 ease-in-out">
                        <Image src="/Images/loginlogo.png" alt="Logo" width={245} height={245}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="lg:text-8xl text-5xl font-extrabold font-animation transition-all duration-300 ease-in-out bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-black">
                            {t.pras}
                        </div>
                        <p className="font-bold break-words lg:text-[15px] text-[7.5px] lg:mr-2 transition-all duration-300 ease-in-out">
                            {t.prasFullName}
                        </p>
                    </div>
                </div>
                <div className="login-bg-animation bg-white lg:py-10 lg:px-10 px-6 py-6 lg:ml-8 rounded-lg lg:w-fit max-w-[475px] m-2">
                    <div>
                        <div className="text-4xl font-bold">
                            {t.welcomeTo}
                        </div>
                        <div className="text-2xl font-medium">
                            {t.policeReportingAiSystem}
                        </div>
                        <div className="text-justify text-black py-4 mb-1">
                            {t.systemDescription}
                        </div>
                        <div className="flex flex-col justify-center items-center">     
                            <LoginAuthForm type="sign-in" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-justify font-medium mt-10 m-4 z-30">
                {t.supportMessage} {t.supportEmail}
            </div>
        </div>
    );
};

