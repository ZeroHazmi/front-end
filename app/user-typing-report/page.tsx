'use client'

import React from "react";
import NavBar from '../../components/NavBar';
import { useRouter } from 'next/router';
// import {GoogleApiWrapper} from 'google-maps-react'; // mahal nak mampus
import MapComponent from '../../components/map';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function UserTypingReport() {

    return (
        <div className="flex flex-row justify-center items-center bg-[#f2f2f2]">
            <form action="">
                <NavBar />
                <div className="w-[100%] h-[100%] text-center p-20 pt-3vh pb-2vh "> {/* min-h-screen */}
                    <div className="font-bold text-6xl max-w-[1200px] text-center text-[500%] p-20 ">
                        Typing Report
                    </div>
                    {/* MAP CONTAINER*/}
                    <div className="w-[1120px] h-[600px]  rounded-lg shadow-top-custom-blue border-double border-2 border-sky-500 ">
                        <MapComponent /> {/* need to fix map border etc */}
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-5 justify-between m-[20px] mx-auto gap-5 items-center text-left">
                        {/* LEFT FORM */}
                        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-left-custom-blue">
                            <div className="flex flex-wrap w-[534px] h-[350px] items-center justify-center mt-1">
                                <div className="w-[190px] h-5  leading-[normal]">
                                    location:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Lot No. / room / Office / House / Building:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Street name:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Place name:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Postcode:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    City:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    States:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                            </div>
                        </div>
                        {/* RIGHT FORM */}
                        <div className="w-[550px] h-[375px] p-2 bg-white border-solid rounded-lg shadow-right-custom-blue">
                            <div className="flex flex-wrap w-[534px] h-[350px] items-center justify-center mt-1">
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Date:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Lot No. / room / Office / House / Building:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Street name:
                                </div>
                                <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}

                                {/* system output */}
                                <div className="w-[300px] h-5  leading-[normal] text-left">
                                    Sending to nearest Police Stations:
                                </div>
                                <div className=" w-[190px] h-[35px] bg-white " /> {/* design PlaceHolder */}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    State:
                                </div> 
                                <div className=" w-[300px] h-[35px] bg-white rounded-lg border border-solid border-[#696969]" /> {/* PlaceHolder */}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Date:
                                </div> 
                                <div className=" w-[300px] h-[35px] bg-white rounded-lg border border-solid border-[#696969]" /> {/* PlaceHolder */}
                                <div className="w-[190px] h-5  leading-[normal]">
                                    Time: 
                                </div> 
                                <div className=" w-[300px] h-[35px] bg-white rounded-lg border border-solid border-[#696969]" /> {/* PlaceHolder */}
                            </div>
                        </div>
                    </div>
                    {/* CHAT CONTAINER */}
                    <div className="w-[1120px] text-justify rounded-lg  bg-white shadow-bottom-custom-blue p-8">
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
                        <div className="flex justify-around items-center border border-sky-500"> {/* need re-adjust position */}
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer ">
                                Proceed
                            </button>
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer ">
                                Return
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div> 
    );
};