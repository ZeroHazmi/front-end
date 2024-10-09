'use client'

import React from 'react';
import '../globals.css';
import NavBar from '../../components/NavBar';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons'
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'


export default function UserReportingSubmission() {
    
    return (
        <div className="flex flex-row justify-center items-center bg-[#f2f2f2] ">
        <form action="">
            <NavBar/>
            <div className="w-[100%] h-[100%] text-center p-20 pt-3vh pb-2vh">
                <div className="font-bold text-6xl max-w-[1200px] text-center text-[500%] p-20 ">
                    <h1>Reporting Submission</h1>
                </div>
                <div className="user-reporting-submisison-container">
                    <div className="user-reporting-submisison-options">
                    <div className="user-reporting-submisison-speech-card">
                            <div className="user-reporting-submisison-speech-card-main-format">
                                <div className="user-reporting-submisison-speech-card-format">
                                    <span className="speech-card-text">
                                        Before you continue to <b>Ai Speech to text conversation</b>, remember that you&apos;ll need to speak clearly for the AI system to understand and summarize your report correctly. Find a quiet place and make sure to pronounce your words clearly for the best outcome.
                                    </span>
                                    <br />
                                    <p className='text-red-500'>
                                        Required Microphone or Audio input
                                    </p>
                                </div>
                            </div>
                            <button className="w-[250px] h-[75px] relative bg-[#0044cc] shadow-custom-blue rounded-lg border-none cursor-pointer outline-none flex justify-center items-center ">
                                <div className="user-reporting-submisison-card-btn-logo">
                                    <span className="text-white text-[50px]">
                                        <FontAwesomeIcon icon={faMicrophoneLines} />
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div className="user-reporting-submisison-or">OR</div>
                        {/* <!-- Typing Report Card --> */}
                        <div className="user-reporting-submisison-typing-card">
                            <div className="user-reporting-submisison-typing-card-format">
                                <span className="user-reporting-submisison-typing-card-text">
                                    Before you continue to <b>Typing Report</b>, it&apos;s important to know that you&apos;ll have to type out your report yourself on this page. Just use your keyboard to input all the important information about the incident.
                                </span>
                            </div>
                            <button className="w-[250px] h-[75px] relative bg-[#0044cc] shadow-custom-blue rounded-lg border-none cursor-pointer outline-none flex justify-center items-center ">
                                <div className="user-reporting-submisison-card-btn-logo">
                                    <span className="text-white text-[57px] ">
                                        <FontAwesomeIcon icon={faKeyboard} />
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        </div>
    );
};
