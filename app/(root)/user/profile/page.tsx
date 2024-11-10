'use client'

import React from "react"
import PHNavBar from "@/components/PHNavBar"
import Image from 'next/image';

export default function UserProfile () {
    return (
        <div className="flex justify-center items-center "> {/* PAGE BODY */}
            {/* MAIN CONTAINER */}
            <div className="w-[1200px] flex flex-wrap justify-center items-center mt-[15vh]">
                {/* PAGE TITLE */}
                <div className=" flex justify-center items-center font-bold text-6xl  text-center text-7 mb-[10vh]">
                    <h1>
                        Profile
                    </h1>
                </div>
                {/* CONTAINER 1 & 2 */}
                <div className="max-w-[1200px] min-w-[550px] flex justify-center items-center flex-wrap gap-5 mb-5">
                    {/* 1. USERNAME IMG */}
                    <div className="w-[550px] h-[175px] flex flex-row justify-start items-center  bg-white  rounded-lg shadow-left-custom-blue">
                        <div className="w-[175px] h-[175px]">
                            <Image className="w-[175px] h-[175px] rounded-lg shadow-2xl " src="https://via.placeholder.com/175x175" alt="User" height={175} width={175} />
                        </div>
                        <div className="w-[385px] h-[175px] flex justify-center items-center text-center text-2xl">
                            <form action="">
                                WAN ANIQ NAIM BIN ROSSIDI
                            </form>
                        </div>
                    </div>
                    {/* 2. IC USERNAME */}
                    <div className="flex justify-center items-center w-[550px] h-[175px]  bg-white   rounded-lg shadow-right-custom-blue">
                        <div className="flex flex-wrap justify-center items-center w-[550px] h-[165px] ">
                            <div className="w-[190px] leading-[normal]">
                                <h2>
                                Username:
                                </h2>
                            </div>
                            <input type="text" className="w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                            <div className="w-[190px]  leading-[normal]">
                                IC Card Number:
                            </div>
                            <input type="text" className="w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                            <div className="flex justify-between w-[490px]">
                                <div className="w-[190px] ">
                                    IC Card Image:
                                </div>
                                <button  className="w-[200px] h-[35px] bg-[#0044cc] text-white rounded-lg font-bold hover:bg-[#0022aa]">
                                    Add/Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* CONTAINER 3 & 4 */}
                <div className=" max-w-[1200px] min-w-[550px] flex  justify-center items-center   border-solid flex-wrap gap-5">
                    {/* 3 / LEFT FORM */}
                    <div className="flex justify-center items-center w-[550px] bg-white  rounded-lg shadow-bottom-custom-blue">
                        <form action="">
                                <div className="flex flex-wrap w-[534px] h-[350px] items-center justify-center m-2">
                                    <div className="w-[190px]  leading-[normal]">
                                        location:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Lot No. / room / Office / House / Building:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Street name:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Place name:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Postcode:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        City:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        States:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                </div>
                        </form>
                    </div>
                    {/* 4 / RIGHT FORM */}
                    <div className="flex justify-center items-center w-[550px] bg-white rounded-lg shadow-bottom-custom-blue">
                        <form action="">
                                <div className="flex flex-wrap w-[534px] h-[350px] items-center justify-center m-2">
                                    <div className="w-[190px]  leading-[normal]">
                                        location:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Lot No. / room / Office / House / Building:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Street name:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Place name:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        Postcode:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        City:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                    <div className="w-[190px]  leading-[normal]">
                                        States:
                                    </div>
                                    <input type="text" className="relative w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> 
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// m-5 will make gap between container, other alternative is gap-[20px]
// <input type="text"className="w-[300px] h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
