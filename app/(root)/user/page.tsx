'use client'

import React, { useEffect, useState } from 'react';
// import '../globals.css';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons'
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'
import PHNavBar from '@/components/PHNavBar';
import { ReportType } from '@/types/index.d';
// import NavBar from '../../components/userNavBar';


export default function UserReportingSubmission() {
    
    const router = useRouter();
    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [selectedReportType, setSelectedReportType] = useState<string>('');

    useEffect(() => {
        async function fetchReportType() {
            const response = await fetch('http://localhost:5035/api/reporttype', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            setReportTypes(data);
        }

        fetchReportType();
    }, []);

    

    function newReportButton(e: React.MouseEvent){
        e.preventDefault();
        if(selectedReportType === '0'){
            alert('Please select a report type');
            return;
        }
        router.push(`/new-report/${selectedReportType}`);
    }

    return (
        <div className=" flex items-center justify-center mt-[16vh]"> {/* PAGE BODY */}
                <PHNavBar/>
                
        </div>
    );
};

