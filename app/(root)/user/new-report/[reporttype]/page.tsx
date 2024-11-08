'use client'

import React, {useState, useEffect, useRef} from "react";
import PHNavBar from "@/components/PHNavBar";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import {GoogleApiWrapper} from 'google-maps-react'; // mahal nak mampus
//import MapComponent from '../../../components/map';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowUp, faMicrophone, faPlus } from '@fortawesome/free-solid-svg-icons'
import { ReportType } from "@/types/index.d";
import { report } from "process";
import Recorder, { mimeType } from "@/components/Recorder";
import { useFormState } from "react-dom";
import transcribe from "@/actions/transcribe";
import GoogleMaps from "@/components/GoogleMap";

const initialState = {
    sender: "",
    message: "",
}

export type Message = {
    sender: string;
    message: string;
    id: string;
}

export default function UserTypingReport() {
    const [reportType, setReportType] = useState<ReportType | null>(null);
    const [templateFields, setTemplateFields] = useState<[string, string][]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const router = useRouter();
    const { reporttype } = useParams();
    const reportTypeID = reporttype as string;

    const fileRef = useRef<HTMLInputElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const[state, formAction] = useFormState(transcribe, initialState);
    const [messages, setMessages] = useState<Message[]>([]);

    async function fetchReportType() {
        const response = await fetch(`http://localhost:5035/api/reporttype/${reportTypeID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data;
    }

    async function renderReport() {
        try {
            const reportTypeData = await fetchReportType();
            console.log("Report Type Data:", reportTypeData);
            setReportType(reportTypeData);
            
            // Ensure templateStructure is parsed only if it's a string
            let parsedTemplate = {};
            if (typeof reportTypeData.templateStructure === 'string') {
                parsedTemplate = JSON.parse(reportTypeData.templateStructure);
            } else {
                parsedTemplate = reportTypeData.templateStructure; // In case it's already an object
            }
            console.log("Parsed Template:", parsedTemplate);

            const fields = Object.entries(parsedTemplate).map(([key, value]) => {
                return [key, typeof value === 'string' ? value : String(value)] as [string, string];
            });
            console.log("Fields:", fields);
            setTemplateFields(fields);
            setLoading(false);
        } catch (parseError) {
            setLoading(false);
        }
    }

    const uploadAudio = ( blob: Blob ) => {        
        const file = new File([blob], "audio.webm", { type: mimeType });

        // Set the file as the value of the file input field
        if (fileRef.current){
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileRef.current.files = dataTransfer.files;

            //simulate a click
            if (submitButtonRef.current){
                submitButtonRef.current.click();
            }
        }
    }

    useEffect(() => {
        console.log("Report Type ID:", reportTypeID);
        renderReport();
        
    }, [reportTypeID]);

    useEffect(() => {
        if (state.message && state.sender){
            setMessages((messages) => [
                ...messages,
                {
                    sender: state.sender,
                    message: state.message,
                    id: `${Date.now()}-${Math.random()}`
                },
                ...messages
            ]);
        }
    }, [state.message, state.sender]);

    // Split template fields into two columns
    const halfLength = Math.ceil(templateFields.length / 2);
    const firstColumn = templateFields.slice(0, halfLength);
    const secondColumn = templateFields.slice(halfLength);

    return (
        <div className="flex flex-row justify-center items-center bg-[#f2f2f2]">
            <form action="">
                <PHNavBar />
                <div className="w-[100%] h-[100%] text-center p-20 pt-3vh pb-2vh "> {/* min-h-screen */}
                    <div className="font-bold text-6xl max-w-[1200px] text-center text-[500%] p-20 ">
                        Typing Report
                    </div>
                    {/* MAP CONTAINER*/}
                    <div className="w-[1120px] h-[600px]  rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 ">
                        <GoogleMaps />
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-5 justify-between m-[20px] mx-auto gap-5 items-center text-left">
                        {/* LEFT FORM */}
                        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-left-custom-blue">
                            <div className="flex flex-wrap w-[534px] h-[350px] items-center justify-center mt-1">
                                    {firstColumn.map(([key, value], index) => (
                                        <div key={index} className="flex flex-col w-full mb-4">
                                            <label className="w-[190px] leading-[normal]">{key}:</label>
                                            <input 
                                                type="text" 
                                                name={key} 
                                                placeholder={value} 
                                                className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" 
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {/* RIGHT FORM */}
                        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-right-custom-blue">
                            <div className="flex flex-wrap w-[534px] h-[350px] items-center justify-center mt-1">
                                {secondColumn.map(([key, value], index) => (
                                    <div key={index} className="flex flex-col w-full mb-4">
                                        <label className="w-[190px] leading-[normal]">{key}:</label>
                                        <input 
                                            type="text" 
                                            name={key} 
                                            placeholder={value} 
                                            className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* CHAT CONTAINER */}
                    <div className="w-[1120px] text-justify rounded-lg  bg-white shadow-bottom-custom-blue p-8">
                        <div className="flex overflow-y-auto max-h-[200px] rounded-lg border border-solid border-[#696969]">
                            <div className="w-[50px]  border-solid border-2 border-[#696969] n">
                                {/* <Image src="https://via.placeholder.com/50x50" className="user-navbar-icon" alt="User" height={50} width={50}/> */}
                            </div>


                            {/* CHANGE TO TEXT AREA!!! */}
                            <textarea className="w-[950px] px-[15px] justify-center">

                            </textarea>
                            <div className="w-[50px] border-solid border-2 border-[#696969] "> {/*border placeholder*/}
                                <Image src="https://via.placeholder.com/50x50" className="user-navbar-icon" alt="User" height={50} width={50}/>
                            </div>
                        </div>
                        <div className="my-5 flex justify-center items-center">
                            <div className="flex w-[100%] ">
                                <div className="bg-[#0044cc] w-[88.5%] flex items-center justify-center rounded-l-lg  ">
                                    <input type="text" placeholder="Type here..." className="w-full ml-[4px] rounded-md border-none h-[35px] box-border outline-none px-2"/>
                                </div>
                                <button className="w-[175px] bg-[#0044cc] flex items-center justify-center flex-shrink-0 py-[6px] cursor-pointer rounded-r-lg border-none">
                                    <span className="text-white text-[20px]">
                                        <FontAwesomeIcon icon={faCircleArrowUp} />
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-around items-center border border-sky-500"> {/* need re-adjust position */}
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer ">
                                Proceed
                            </button>
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer " 
                            onClick={() => router.push('..')}>
                                Return
                            </button>
                        </div>
                    </div>
                </div>
                <div className='fixed md:bottom-[4%] bottom-[5%] md:right-[13%] right-[10%] border-solid'>
                <button type="button" className='flex justify-center items-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-[20px] text-center sm:text-[35px] text-white bg-police-blue hover:bg-[#0022AA] rounded-full shadow-[0px_20px_75px_rgba(0,68,204,1)]  '>
                    <FontAwesomeIcon icon={faMicrophone}/> 
                </button> 
            </div>
            </form>
            <form action={formAction}>
                <input type="file" hidden ref={ fileRef } name="audio"/>
                <button type="submit" hidden ref={ submitButtonRef } name="submit"/>
                <Recorder uploadAudio={uploadAudio}/>
            </form>
        </div> 
    );
};