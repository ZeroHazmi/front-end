'use client'

import React from "react"
import PHNavBar from "@/components/PHNavBar"
import Image from 'next/image';

export default function UserProfile () {
    return (
        <div className="flex justify-center items-center"> {/* PAGE BODY */}
            {/* <PHNavBar/> */}
            {/* CONTAINER */}
            <div className="max-w-[1200px] flex flex-col xl:flex-row items-center xl:items-start xl:justify-center p-6 space-y-4 xl:space-y-0 xl:space-x-6    mx-auto mt-[15vh]">
                {/* <div className=" flex justify-center items-center font-bold text-6xl  text-center text-7 mb-[10vh]">
                    <h1>
                        Profile
                    </h1>
                </div> */}

                {/* USER PROFILE & NAME */}
                <div className="flex flex-row justify-start items-center w-[550px] h-[165px] bg-white  rounded-lg">
                    <div>
                        <Image className="w-[165px] h-[165px] rounded-lg" src="https://via.placeholder.com/165x165" alt="User" height={165} width={165} />
                    </div>
                    <div className="flex justify-center items-center">
                        <form action="">
                            username
                        </form>
                    </div>
                </div>
                {/* IC USERNAME */}
                <div className="flex justify-center items-center w-[550px]  h-[165px]  bg-white  rounded-lg">
                    <div className="flex flex-wrap w-[550px] h-[165px] m-1 px-2 py-2">
                        <div className="w-[190px] h-5  leading-[normal]">
                            Username:
                        </div>
                        <input type="text" className="w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                        <div className="w-[190px] h-5  leading-[normal]">
                            IC Card Number:
                        </div>
                        <input type="text" className="w-[300px] h-[35px] bg-white rounded-lg border border-solid  p-2 border-[#696969]" /> {/*nice*/}
                        <div className="flex justify-start">
                            <div className="w-[190px] h-5  leading-[normal]">
                                IC Card Image:
                            </div>
                            <button  className=" w-[200px] h-[35px] bg-[#0044cc] text-white rounded-lg font-bold hover:bg-[#0022aa]">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                 {/* LEFT FORM */}
                <div className="flex justify-center items-center w-[550px] bg-white m-5 px-4 py-6 rounded-lg">
                    <form action="">
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
                    </form>
                </div>
                {/* RIGHT FORM */}
                <div className="flex justify-center items-center w-[550px] bg-white m-5 px-4 py-6 rounded-lg">
                    <form action="">
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
                    </form>
                </div>
            </div>
        </div>
    );
};

// m-5 will make gap between container, other alternative is gap-[20px]
// <input type="text"className="w-[300px] h-[35px] bg-white rounded-lg border border-solid p-2 border-[#696969]" />
