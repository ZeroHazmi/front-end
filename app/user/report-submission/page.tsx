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
        <div className=" min-h-screen flex items-center justify-center "> {/* PAGE BODY */}
            <form action="">
                <NavBar/>
                {/* MAIN CONTAINER */}
                <div className="flex flex-col justify-center items-center"> 
                    {/* TITLE */}
                    <div className=" flex justify-center items-center  font-bold text-6xl  text-center text-7 p-2  ">
                        <h1>Reporting Submission</h1>
                    </div>

                    
                    <div className="text-center py-5 max-w-[1000px] mx-auto">
                        <div className="flex justify-center items-start gap-[20px] ">
                        
                        
                            {/* SPEACH */}

                            <div className='w-[550px] h-full bg-white p-4 rounded-lg'>
                                <div className=''>
                                    <h2 className="font-bold text-2xl mb-4">
                                        Ai Speech to Text
                                    </h2>
                                    <p className='text-justify text-base mb-4'>
                                    Before continue, remember to speak clearly for the AI system to understand and summarize the report correctly. Find a quiet place and make sure to pronounce your words clearly for the best outcome.
                                    </p>
                                    <br />
                                    <p className="text-red-500 text-base mb-4">
                                        Required Microphone or Audio input
                                    </p>
                                </div>
                                <button className="w-[250px] h-[75px] relative bg-[#0044cc] shadow-custom-blue rounded-lg border-none cursor-pointer outline-none  ">
                                    <span className="text-white text-[50px]">
                                        <FontAwesomeIcon icon={faMicrophoneLines} />
                                    </span>
                                </button>
                            </div>



                            
                            {/* TYPING */}
                            <div className="w-[550px] h-full bg-white shadow-[0px_20px_75px_rgba(0,68,204,0.25)] rounded-lg flex flex-col justify-center items-center gap-[56px] -z-0">
                                <div className=" text-black text-[20px] font-normal break-words text-justify">
                                    <span className="text-justify text-base">
                                        <p className="font-bold text-2xl mb-4">Typing Report</p>
                                        Before you continue to, it&apos;s important to know that you&apos;ll have to type out your report yourself on this page. Just use your keyboard to input all the important information about the incident.
                                    </span>

                                </div>
                                <button className="w-[250px] h-[75px] relative bg-[#0044cc] shadow-custom-blue rounded-lg border-none cursor-pointer outline-none flex justify-center items-center ">
                                    <div className="">
                                        <span className="text-white text-[57px] ">
                                            <FontAwesomeIcon icon={faKeyboard} />
                                        </span>
                                        
                                    </div>
                                </button>
                            </div> 
                        </div>
                    </div>
                    <div className="flex justify-center items-center ">
                        <div className="flex justify-center items-center w-[1120px] h-[50px]  bg-white shadow-bottom-custom-blue rounded-lg gap-4">
                            <div className="flex">
                                type of case / report type
                            </div>
                            <div>
                                <select className="p-2 bg-white rounded-lg border border-[#696969] " name='reportype' required>
                                    <option value="placeholder">Type of reports</option>
                                    <option value="wan">1</option>
                                    <option value="to">2</option>
                                    <option value="tree">3</option>
                                    <option value="for">4</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </form>
        </div>
    );
};
