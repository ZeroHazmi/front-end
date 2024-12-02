'use client'

import 'leaflet/dist/leaflet.css';
import SubmitReportPage from "@/components/ReportSubmissionPage";



export default function UserTypingReport() {

    return (
        <div>
            <SubmitReportPage userAccess='user'/>
        </div>
    );
}