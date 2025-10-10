'use client'

// Leaflet CSS import removed. Add the CSS back if you re-install leaflet.
import SubmitReportPage from "@/components/ReportSubmissionPage";



export default function UserTypingReport() {

    return (
        <div>
            <SubmitReportPage userAccess='user'/>
        </div>
    );
}