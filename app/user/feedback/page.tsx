'use client'

import React from "react";
import PHNavBar from '@/app/components/PHNavBar';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function UserFeedbackAndRating () {

    return (
        <div className="flex justify-center items-center  bg-[#f2f2f2]">
            <form action="">
                <PHNavBar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="bg-white w-[500px] p-8 rounded-lg  shadow-custom-blue">
                        <div className="text-center text-xl font-bold mb-3">
                            Feedback & Rating
                        </div>
                        <div className="flex justify-center items-center mb-4">
                            <div className="flex">
                                <span className="text-[#FFD700] text-[40px]">★</span>
                                <span className="text-[#FFD700] text-[40px]">★</span>
                                <span className="text-[#FFD700] text-[40px]">★</span>
                                <span className="text-[#FFD700] text-[40px]">★</span>
                                <span className="text-gray-400 text-[40px]">★</span>
                            </div>
                            <span className="ml-4 text-gray-500">
                                4/5 stars
                            </span>
                        </div>
                        <textarea
                            className="w-full p-2 border rounded-lg mb-4"
                            rows={3}
                            placeholder="Type your feedback here..."
                        ></textarea>
                        <div className="flex justify-center items-center gap-10">
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer">
                                Submits report
                            </button>
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer">
                                Return
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div> 
    );
};