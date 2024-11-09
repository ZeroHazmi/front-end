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
import MapForm from "@/components/MapForm";

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
    const [textareaContent, setTextareaContent] = useState<string>("");
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

    useEffect(() => {
        if (state.message) {
            const newMessage = `${state.message}\n`; // Only the message without sender
            setMessages((messages) => [
                {
                    sender: state.sender, // Keep the sender in the messages state
                    message: state.message,
                    id: `${Date.now()}-${Math.random()}`,
                },
                ...messages,
            ]);
            setTextareaContent((prevContent) => prevContent + newMessage); // Append to the textarea content
            setMessages([])
        }
    }, [state.message, state.sender]);

    useEffect(() => {
        // Retrieve the text from sessionStorage when the component is mounted
        const savedText = sessionStorage.getItem("textareaContent");
        if (savedText) {
            setTextareaContent(savedText);
        }
    }, []);
    
    useEffect(() => {
        // Save the text to sessionStorage whenever it changes
        sessionStorage.setItem("textareaContent", textareaContent);
    }, [textareaContent]);

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
                    {/* LOCATION OF REPORT */}
                    <MapForm />
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
                        <div className="flex overflow-y-auto max-h-[350px] rounded-lg border border-solid border-[#696969]">
                            {/* CHANGE TO TEXT AREA!!! */}
                            <textarea
                                className="w-full px-[15px] justify-center"
                                name="converted-speech-textarea"
                                value={textareaContent} // Bind the textarea value to the state
                                onChange={() => {}} // Optional: If you want to prevent editing, leave this empty
                            ></textarea>

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
            </form>
            <form action={formAction}>
                <input type="file" hidden ref={ fileRef } name="audio"/>
                <button type="submit" hidden ref={ submitButtonRef } name="submit"/>
                <Recorder uploadAudio={uploadAudio}/>
            </form>
        </div> 
    );
};