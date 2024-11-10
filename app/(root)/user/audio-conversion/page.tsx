'use client'

import React from "react";
import PHNavBar from '@/components/PHNavBar';
import { useRouter } from 'next/router';
// import {GoogleApiWrapper} from 'google-maps-react'; // mahal nak mampus
//import MapComponent from '@/components/map';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons'
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'

export default function UserSpeechToTextConversation () {

    return (
        <div className="flex flex-row justify-center items-center bg-[#f2f2f2] ">
            <form action="">
                <div className="w-[100%] h-[100%] text-center p-20 pt-3vh pb-2vh "> {/* min-h-screen */}
                    <div className="font-bold text-6xl max-w-[1200px] text-center text-[500%] p-20 ">
                        Ai Speech Report
                    </div>
                    {/* MAP CONTAINER*/}
                    <div className="w-[1120px] h-[600px]  rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 mb-[20px]">
                        {/* <MapComponent /> need to fix map border etc */}
                    </div>
                    {/* CHAT CONTAINER */}
                    <div className="w-[1120px] text-justify rounded-lg shadow-custom-blue p-8 bg-white mb-[20px]">
                        <div className="flex overflow-y-auto max-h-[200px] rounded-lg border border-solid border-[#696969]">
                            <div className="w-[50px]  border-solid border-2 border-[#696969] n">
                                {/* <Image src="https://via.placeholder.com/50x50" className="user-navbar-icon" alt="User" height={50} width={50}/> */}
                            </div>
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
                        <div className="flex justify-end border border-sky-500"> {/* need re-adjust position */}
                            {/* <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer ">
                                Proceed
                            </button> */}
                            <button className="w-[200px] h-[35px] flex  items-center justify-center  text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer ">
                                Return
                            </button>
                        </div>
                    </div>
                    {/* VOICE RECORDING */}
                    <div className="bg-white p-6 rounded-lg shadow-bottom-custom-blue ">
                            <p className="text-center text-gray-700 mb-4">Click the microphone to stop recording</p>
                        <div className="relative flex justify-center items-center">
                            <div className="absolute w-full h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="bg-red-500  rounded-full w-[150px] h-[50px] z-10 flex justify-center items-center ">
                                <button className="text-white text-4xl ">
                                    <FontAwesomeIcon icon={faMicrophoneLines} />
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-gray-600 my-4 ">00:30</p> {/* recording timer */}
                        <div className="flex justify-center items-center space-x-2">
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer">
                                Send
                            </button>
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer">
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div> 
    );
};