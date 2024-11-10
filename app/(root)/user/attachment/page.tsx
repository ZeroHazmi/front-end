'use client'

import React from "react";
import PHNavBar from '@/components/PHNavBar';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function UserMultimediaAttachment () {

    return (
        <div className="flex justify-center items-center  bg-[#f2f2f2]">
            <form action="">
                <div className="flex justify-center items-center min-h-screen w-[1120px]">
                        <div className="flex flex-col justify-center items-center w-[550px]  bg-white p-8 rounded-lg shadow-custom-blue mb-4 mx-auto">
                            <div className="text-[200%] text-xl font-bold mb-4">
                                Media Attachments
                            </div>
                            <div className="flex flex-col justify-center items-center rounded-lg border-solid border-black bg-[#f2f2f2] mb-[35px]">
                                <div className="text-[50px]">
                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                </div>
                                <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer">
                                    Browes files
                                </button>
                            </div>
                            <button className="w-[200px] h-[35px] flex items-center justify-center text-white bg-[#0044cc] border-none rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] font-bold text-[1rem] cursor-pointer">
                                Submits report
                            </button>
                        </div> 
                        <div className="flex justify-center items-center text-xl text-red-500 text-bold mb-4">
                            Reminder!
                        </div>
                        <div className="px-2 text-justify">
                            Please ensure your uploaded photo is appropriate, clear, in focus, and well-lit. The photo must be in one of the allowed file formats (JPEG, PNG, GIF) and within the size limit (18MB). Inappropriate content, such as nudity, violence, offensive symbols, or any illegal material, will not be tolerated. Do not upload copyrighted material without proper authorization, and avoid misleading or deceptive content. Ensure the photo does not contain personal information of others without their consent. By uploading, you agree to adhere to these guidelines, and any violation may result in rejection of your upload and possible action on your account.
                        </div>
                </div>
            </form>
        </div> 
    );
};