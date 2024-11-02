'use client'

import React from "react";
import PHNavBar from '@/components/PHNavBar';

import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";


export default function IssueTrackingManagement(){

    return (
        <form action="">
            <PHNavBar/>
            {/* PAGE BODY */}
            <div className="flex justify-center items-center mt-[175px]"> {/* min-h-screen: center */}
                {/* TABLE CONTAINER */}
                <div className="w-[1120px] justify-center items-center ">
                    {/* SEPARATE/OUSIDE TABLE HEAD */}
                    <table className="w-[1120px] mb-2 rounded-t-lg shadow-custom-blue overflow-hidden table-fixed">
                        <thead className="shadow-custom-blue">
                            <tr className="bg-[#0044cc] text-white">
                                <th className="w-[75px] px-4 py-2 text-left font-semibold "></th>
                                <th className="w-[347px] px-4 py-2 text-left font-semibold">Issues</th>
                                <th className="w-[250px] px-4 py-2 text-left font-semibold">Reported Users</th>
                                <th className="w-[225px] px-4 py-2 text-left font-semibold">Priorities</th>
                                <th className="w-[222px] flex justify-start items-center px-4 py-2 text-left font-semibold ">Actions</th>
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
                                <td className="w-[75px] pl-2 py-1 border-b text-center">
                                    <input type="checkbox" className="text-center w-[15px] h-[15px]  bg-white rounded-lg  border-[#e0e4eb] border-[1.67px] outline-[3px] cursor-pointer" />
                                </td>
                                <td className="w-[500px] px-4 py-2 border-b">Raziq Kacak Pacak&#39;s EX5 Reverse Wheely</td>
                                <td className="w-[100px] px-4 py-2 border-b">The S.M.Z</td>
                                <td className="w-[100px] px-4 py-2 border-b">
                                    <select className="w-[200px] h-[35px] px-2 bg-white rounded-lg border border-[#696969] " name='reportype' required>
                                        <option value="veryhigh">Very High</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="verylow">Very Low</option>
                                    </select>
                                </td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex  justify-end items-center space-x-2 h-auto">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>{/* action of edit button will SAVE user latest list */}
                                    </div>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="w-[75px] pl-2 py-2 border-b text-center">
                                    <input type="checkbox" className="text-center w-[15px] h-[15px]  bg-white rounded-lg  border-[#e0e4eb] border-[1.67px] outline-[3px] cursor-pointer" />
                                </td>
                                <td className="w-[200px] px-4 py-2 border-b">ipin&#39;s Unfinished Transcribe</td>
                                <td className="w-[300px] px-4 py-2 border-b">MrNing@gmail.com</td>
                                <td className="px-4 py-2 border-b">
                                    <select className="w-[200px] h-[35px] px-2 bg-white rounded-lg border border-[#696969] " name='reportype' required>
                                        <option value="veryhigh">Very High</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="verylow">Very Low</option>
                                    </select>
                                </td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex space-x-2">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="w-[75px] pl-2 py-2 border-b text-center">
                                    <input type="checkbox" className="text-center w-[15px] h-[15px]  bg-white rounded-lg  border-[#e0e4eb] border-[1.67px] outline-[3px] cursor-pointer" />
                                </td>
                                <td className="w-[200px] px-4 py-2 border-b">Toyota Vios Driver drive recklessly</td>
                                <td className="w-[300px] px-4 py-2 border-b">Mr Aniq</td>
                                <td className="px-4 py-2 border-b">
                                    <select className="w-[200px] h-[35px] px-2 bg-white rounded-lg border border-[#696969] " name='reportype' required>
                                        <option value="veryhigh">Very High</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="verylow">Very Low</option>
                                    </select>
                                </td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex space-x-2">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="w-[75px] pl-2 py-2 border-b text-center">
                                    <input type="checkbox" className="text-center w-[15px] h-[15px]  bg-white rounded-lg  border-[#e0e4eb] border-[1.67px] outline-[3px] cursor-pointer" />
                                </td>
                                <td className="w-[200px] px-4 py-2 border-b">Fake Air Jordan 1 Travis Scott spotted</td>
                                <td className="w-[300px] px-4 py-2 border-b">Ah Ning</td>
                                <td className="px-4 py-2 border-b">
                                    <select className="w-[200px] h-[35px] px-2 bg-white rounded-lg border border-[#696969] " name='reportype' required>
                                        <option value="veryhigh">Very High</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="verylow">Very Low</option>
                                    </select>
                                </td>
                                <td className=" items-center p-2 border-b h-auto">
                                    <div className="flex space-x-2">
                                        <button className=" flex justify-center items-center bg-[#0044cc] w-[200px] h-[35px] text-white px-4 py-2 rounded-lg hover:bg-[#0022aa]">Edit</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody><tfoot>
                        </tfoot>
                    </table>
                </div>
            </div>
        </form>
    );
};
