import React from 'react';

const ErrorMessage = () => {
    return (
        <form action="">
        <!-- container -->
        <div class="flex items-center justify-center h-screen bg-gray-100">
            <!-- form -->
            <div class="w-[490px] h-[186px] flex items-center justify-center bg-white flex-col p-8px rounded-lg p-8 shadow-[0px_0px_75px_rgba(0,68,204,0.3)] ">
                <!-- title -->
                <h1 class="flex text-2xl font-bold text-black mb-4">
                    title
                </h1>
                <!-- subtitle -->
                <p class="text-gray-600 mb-6">
                    subtitle
                </p>
                <!-- button -->
                <button class="bg-[#0044cc] py-2 p-8 text-[16px] text-white font-medium cursor-pointor transition duration-400  hover:bg-blue-900 rounded-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] ">
                    button text
                </button>
            </div>
        </div>
    </form>
    );
};