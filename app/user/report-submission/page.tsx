'use client'

import React from 'react';
// import '../globals.css';
// import NavBar from '../../components/NavBar';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons'
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'
import NavBar from '@/components/NavBar';


export default function UserReportingSubmission() {
    
    return (
        <div className="  bg-gray-500 w-full h-full ">
        <form action="">
            {/* <NavBar/> */}
            <div className=" text-center pt-3vh pb-2vh "> 

                <div className=" flex justify-center items-center  font-bold text-6xl  text-center text-7 p-20  ">
                    <h1>Reporting Submission</h1>
                </div>

                <div className="text-center py-5 max-w-[1000px] mx-auto">
                    <div className="flex justify-center items-start gap-[50px] md:gap-[20px] md:items-center">
                        {/* SPEACH */}
                        <div className=" w-[550px]  px-[14px] py-[26px] bg-white shadow-[0px_20px_75px_rgba(0,68,204,0.25)] rounded-lg flex flex-col justify-center items-center gap-[56px]">
                            <div className=" text-black text-[20px] font-normal break-words text-justify">
                                <div className=" text-justify">
                                    <span className="text-justify">
                                        Before you continue to <b>Ai Speech to text conversation</b>, remember that you&apos;ll need to speak clearly for the AI system to understand and summarize your report correctly. Find a quiet place and make sure to pronounce your words clearly for the best outcome.
                                    </span>
                                    <br />
                                    <p className='text-red-500'>
                                        Required Microphone or Audio input
                                    </p>
                                </div>
                            </div>
                            <button className="w-[250px] h-[75px] relative bg-[#0044cc] shadow-custom-blue rounded-lg border-none cursor-pointer outline-none flex justify-center items-center ">
                                <span className="text-white text-[50px]">
                                    <FontAwesomeIcon icon={faMicrophoneLines} />
                                </span>
                            </button>
                        </div>  
                        {/* TYPING */}
                        <div className="w-[550px] h-[400px] px-[14px] py-[26px] bg-white shadow-[0px_20px_75px_rgba(0,68,204,0.25)] rounded-lg flex flex-col justify-center items-center gap-[56px]">
                            <div className=" text-black text-[20px] font-normal break-words text-justify">
                                <span className="text-justify">
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
                <div className="flex justify-center items-center w-[550px] h-[100px]  bg-white shadow-[0px_20px_75px_rgba(0,68,204,0.25)] rounded-lg gap-4">
                    <div className="flex">
                        type of case / report type
                    </div>
                    <div>
                        <select className="l bg-white rounded-lg border border-[#696969] " name='nationality' required>
                            <option value="placeholder">Type of reports</option>
                            <option value="malay">1</option>
                            <option value="chinese">2</option>
                            <option value="indian">3</option>
                            <option value="other">4</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    </div>
    );
};
