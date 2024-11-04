'use client'

import React, {useState, useEffect} from "react";
import PHNavBar from "@/components/PHNavBar";
import { useRouter, useSearchParams } from 'next/navigation';
// import {GoogleApiWrapper} from 'google-maps-react'; // mahal nak mampus
//import MapComponent from '../../../components/map';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons'
import { ReportType } from "@/types/index.d";
import { report } from "process";

export default function UserTypingReport() {
    const [reportType, setReportType] = useState<ReportType | null>(null);
    const [templateFields, setTemplateFields] = useState<[string, string][]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const router = useRouter();
    const searchParams = useSearchParams();
    const reporttype = searchParams.get('reporttype');

    useEffect(() => {
        async function fetchAndRenderReport() {
            try {
                if (!reporttype) {
                    throw new Error('Report type is not chosen.');
                }

                const res = await fetch(`http://localhost:5035/api/reporttype/${reporttype}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }

                const reportTypeData = await res.json();

                console.log(reportTypeData);

                if (!reportTypeData || !reportTypeData.templatestructure) {
                    throw new Error('TemplateStructure is missing in the report type.');
                }

                setReportType(reportTypeData);

                // Parse the template structure
                try {
                    const parsedTemplate = JSON.parse(reportTypeData.TemplateStructure);
                    const fields = Object.entries(parsedTemplate).map(([key, value]) => {
                        return [key, typeof value === 'string' ? value : String(value)] as [string, string];
                    });
                    setTemplateFields(fields);
                } catch (parseError) {
                    throw new Error('Error parsing template structure.');
                }

                //setLoading(false); // Stop loading
            } catch (error) {
                //setLoading(false);
                setError((error as Error).message || 'An error occurred');
            }
        }

        if (reporttype) {
            fetchAndRenderReport();
        }
    }, [reporttype]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted');
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                        {/* <MapComponent /> need to fix map border etc */}
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
                            <div className="w-[950px] px-[15px] justify-center">
                                I have been watching a situation develop at Taman Permainan Bandar Baru Bangi Seksyen 3 for the past hour. There is a man who has been hanging around near the playground, and his behavior is very suspicious. He has been walking back and forth, sometimes looking around as if he is searching for something or someone. I have seen him getting closer to the children playing, which is making me more and more worried. I have not seen any weapons, but his presence alone is alarming. I think it is very important that we deal with this right away to make sure everyone at the park is safe. Can you please send someone to check it out?
                                <br />
                                <br />
                                repeat
                                <br />
                                <br />
                                I have been watching a situation develop at Taman Permainan Bandar Baru Bangi Seksyen 3 for the past hour. There is a man who has been hanging around near the playground, and his behavior is very suspicious. He has been walking back and forth, sometimes looking around as if he is searching for something or someone. I have seen him getting closer to the children playing, which is making me more and more worried. I have not seen any weapons, but his presence alone is alarming. I think it is very important that we deal with this right away to make sure everyone at the park is safe. Can you please send someone to check it out?
                                <br />
                                <br />
                                I have been watching a situation develop at Taman Permainan Bandar Baru Bangi Seksyen 3 for the past hour. There is a man who has been hanging around near the playground, and his behavior is very suspicious. He has been walking back and forth, sometimes looking around as if he is searching for something or someone. I have seen him getting closer to the children playing, which is making me more and more worried. I have not seen any weapons, but his presence alone is alarming. I think it is very important that we deal with this right away to make sure everyone at the park is safe. Can you please send someone to check it out?
                                <br />
                                <br />
                                repeat
                                <br />
                                <br />
                                I have been watching a situation develop at Taman Permainan Bandar Baru Bangi Seksyen 3 for the past hour. There is a man who has been hanging around near the playground, and his behavior is very suspicious. He has been walking back and forth, sometimes looking around as if he is searching for something or someone. I have seen him getting closer to the children playing, which is making me more and more worried. I have not seen any weapons, but his presence alone is alarming. I think it is very important that we deal with this right away to make sure everyone at the park is safe. Can you please send someone to check it out?
                                <br />
                                <br />
                            </div>
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
            </form>
        </div> 
    );
};