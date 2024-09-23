'use client'

import React from 'react';
import '../globals.css';
import NavBar from '../NavBar';
import { useRouter } from 'next/router';

export default function UserReportingSubmission() {
    
    return (
        <form action="">
            <NavBar />
            <div className="user-reporting-submisison-layout">
                <div className="user-reporting-submisison-title">
                    <h1>Reporting Submission</h1>
                </div>
                <div className="user-reporting-submisison-container">
                    <div className="user-reporting-submisison-options">
                        {/* <!-- Typing Report Card --> */}
                        <div className="user-reporting-submisison-typing-card">
                            <div className="user-reporting-submisison-typing-card-format">
                                <span className="user-reporting-submisison-typing-card-text">
                                    Before you continue to <b>Typing Report</b>, it&apos;s important to know that you&apos;ll have to type out your report yourself on this page. Just use your keyboard to input all the important information about the incident.
                                </span>
                            </div>
                            <button className="user-reporting-submisison-card-btn">
                                <div className="user-reporting-submisison-card-btn-logo">
                                    <span className="user-reporting-submisison-material-symbols-outlined type-icon">
                                        keyboard
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div className="user-reporting-submisison-or">OR</div>
                        <div className="user-reporting-submisison-speech-card">
                            <div className="user-reporting-submisison-speech-card-main-format">
                                <div className="user-reporting-submisison-speech-card-red-text">
                                    Required Microphone or Audio input
                                </div>
                                <div className="user-reporting-submisison-speech-card-format">
                                    <span className="speech-card-text">
                                        Before you continue to <b>Ai Speech to text conversation</b>, remember that you&apos;ll need to speak clearly for the AI system to understand and summarize your report correctly. Find a quiet place and make sure to pronounce your words clearly for the best outcome.
                                    </span>
                                </div>
                            </div>
                            <button className="user-reporting-submisison-card-btn">
                                <div className="user-reporting-submisison-card-btn-logo">
                                    <span className="user-reporting-submisison-material-symbols-outlined talk-icon">
                                        record_voice_over
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
