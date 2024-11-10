'use client'

import React from "react";
import PHNavBar from '@/components/PHNavBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';


export default function PoliceUserManagement(){

    return (
        <form action="">
            <PHNavBar/>
            {/* PAGE BODY */}
            <div className="flex justify-center items-center mt-[175px]"> {/* min-h-screen: center */}
                {/* TABLE CONTAINER */}
                <div className="max-w-[1120px] justify-center items-center ">
                    {/* SEPARATE/OUSIDE TABLE HEAD */}
                    <table className="w-[1120px] mb-2 rounded-t-lg shadow-custom-blue overflow-hidden table-fixed">
                        <thead className="shadow-custom-blue">
                            <tr className="bg-[#0044cc] text-white">
                                <th className="w-[75px] px-4 py-2 text-left font-semibold ">No.</th>
                                <th className="w-[407px] px-4 py-2 text-left font-semibold">Name</th>
                                <th className="w-[285px] px-4 py-2 text-left font-semibold">Emails</th>
                                <th className="w-[90px] px-4 py-2 text-left font-semibold">Roles</th>
                                <th className="w-[263px] flex justify-start items-center px-4 py-2 text-left font-semibold ">Actions</th>
                            </tr>
                        </thead>
                    </table>
                    <table className="min-w-full table-fixed shadow-custom-blue rounded-b-lg overflow-hidden">
                        {/* INSIDE TABLE HEAD */}
                        {/* <thead className="">
                            <tr className="bg-[#0044cc] text-white shadow-bottom-custom-blue overflow-hidden">
                                <th className="w-[50px] px-4 py-2 text-left font-semibold ">No.</th>
                                <th className="px-4 py-2 text-left font-semibold">Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Emails</th>
                                <th className="px-4 py-2 text-left font-semibold">Roles</th>
                                <th className="flex justify-center items-center px-4 py-2 text-left font-semibold rounded-lg">Actions</th>
                            </tr>
                            <tr><td className="p-1"></td></tr>
                        </thead> */}
                        <tbody className="bg-white">
                            <tr className="">
                                <td className="w-[75px] pl-2 py-1 border-b">1</td>
                                <td className="w-[500px] px-4 py-2 border-b"></td>
                                <td className="w-[100px] px-4 py-2 border-b">MrAnig@gmail.com</td>
                                <td className="w-[100px] px-4 py-2 border-b">Citizen</td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex  justify-end items-center space-x-2 h-auto">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                        <button className="flex justify-center items-center bg-red-500 w-[35px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="w-[75px] pl-2 py-2 border-b">2</td>
                                <td className="w-[200px] px-4 py-2 border-b">Ah Ning</td>
                                <td className="w-[300px] px-4 py-2 border-b">MrNing@gmail.com</td>
                                <td className="px-4 py-2 border-b">Police</td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex space-x-2">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                        <button className="flex justify-center items-center bg-red-500 w-[35px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="w-[50px] pl-2 py-2 border-b">1000000</td>
                                <td className="w-[200px] px-4 py-2 border-b">Chatzal</td>
                                <td className="w-[300px] px-4 py-2 border-b">Zero000@gmail.com</td>
                                <td className="px-4 py-2 border-b">Admin</td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex space-x-2">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                        <button className="flex justify-center items-center bg-red-500 w-[35px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="w-[50px] pl-2 py-2 border-b">9999999</td>
                                <td className="w-[200px] px-4 py-2 border-b">Razig Kacak Pacak</td>
                                <td className="w-[300px] px-4 py-2 border-b">RazigKacakPack@gmail.com</td>
                                <td className="px-4 py-2 border-b">Citizen</td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex space-x-2">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                        <button className="flex justify-center items-center bg-red-500 w-[35px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        {/* TABLE ADD FUCNTION CONTAINER */}
                        <tfoot>
                            <tr className="bg-white">
                                <td colSpan={5} className="text-center px-[45px] py-4">
                                    <button  className=" w-[200px] h-[35px] bg-[#0044cc] text-white rounded-lg font-bold hover:bg-[#0022aa]">
                                        Add
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </form>
    );
};
