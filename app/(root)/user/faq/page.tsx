'use client'

import React from 'react'
import PHNavBar from '@/components/PHNavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import UserNavBar from '@/components/userNavBar';


export default function FrequentlyAskedQuestions () {
    return (
        <div className='flex justify-center items-center min-w-[375px] max-w-[1200px] mx-auto mt-[15vh]'> {/* PAGE BODY */}
        <UserNavBar />
            {/* CONTAINER */}
            <div className='mx-2'>
                {/* TITLE */}
                <div className="flex justify-center items-center font-bold text-4xl text-center mb-[6vh] ">
                    <h1>
                        Frequently Asked Questions
                    </h1>
                </div>
                {/* SEARCHBAR */}
                {/* need to be responsive!!! */}
                <div className="mb-7 flex justify-center items-center shadow-middle-custom-blue">
                    <div className="flex w-[100%]">
                        <div className="bg-police-blue w-[88.5%] flex items-center justify-center rounded-l-lg  ">
                            <input type="text" placeholder="Type here..." className="w-full ml-[4px] rounded-md border-none h-[35px] box-border outline-none px-2"/>
                        </div>
                        <button className="w-[175px] bg-police-blue hover:bg-[#0022AA] flex items-center justify-center flex-shrink-0 py-[6px] cursor-pointer rounded-r-lg border-none">
                            <span className="text-white text-[20px]">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </span>
                        </button>
                    </div>
                </div>
                {/* QUESTION FORM(S) */}
                <div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
                    <div>
                        <div className='flex'>
                            <h1 className='text-3xl font-bold mb-3 pr-2'>{/* the number inside "Q_:" will increase if there an additional FAQ*/}
                                Q1: 
                            </h1>
                            <h1 className='text-3xl font-bold mb-3'> {/* admin can output the question without add Q1:, Q2: etc*/}
                                How do I file a report using the AI system?
                            </h1>
                        </div>
                        <p className='text-justify'>
                        To file a report, log in to your account or register and proceed to reporting submition page. Choose the Speech to Text recognition  provided by our AI system to input all necessary information. Once complete, submit the report for processing.
                        </p>
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
                    <div>
                        <div className='flex'>
                            <h1 className='text-3xl font-bold mb-3 pr-2'>
                                Q2: 
                            </h1>
                            <h1 className='text-3xl font-bold mb-3'> 
                                How do i contact IT support?
                            </h1>
                        </div>
                        <p className='text-justify'>
                            You can contact our customer support team via email at zalhazmi@gmail.com or call us at (123) 456-7890. Our support hours are Monday to Friday, 9 AM to 6 PM.
                        </p>
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
                    <div>
                        <div className='flex'>
                            <h1 className='text-3xl font-bold mb-3 pr-2'>
                                Q3:
                            </h1>
                            <h1 className='text-3xl font-bold mb-3'> 
                                What types of incidents can I report?
                            </h1>
                        </div>
                        <p className='text-justify'>
                            You can report various incidents, including theft, vandalism, assault, traffic accidents, and more.
                        </p>
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
                    <div>
                        <div className='flex'>
                            <h1 className='text-3xl font-bold mb-3 pr-2'>
                                Q4:
                            </h1>
                            <h1 className='text-3xl font-bold mb-3'> 
                                Is my information secure?
                            </h1>
                        </div>
                        <p className='text-justify'>
                            Yes, your information is secure. Our AI police reporting system uses advanced encryption and security protocols to ensure that your data is protected at all times.
                        </p>
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
                    <div>
                        <div className='flex'>
                            <h1 className='text-3xl font-bold mb-3 pr-2'>
                                Q5:
                            </h1>
                            <h1 className='text-3xl font-bold mb-3'> 
                                Can I edit a report after submission?
                            </h1>
                        </div>
                        <p className='text-justify'>
                            If you need to make changes to a report after submission, please contact our support team as soon as possible. They can assist you in updating the report if it is still in the review stage
                        </p>
                    </div>
                </div>
                <div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
                    <div>
                        <div className='flex'>
                            <h1 className='text-3xl font-bold mb-3 pr-2'>
                                Q6:
                            </h1>
                            <h1 className='text-3xl font-bold mb-3'> 
                                Example of how long the text gonna look like in this container
                            </h1>
                        </div>
                        <p className='text-justify'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget dignissim mi. Ut non leo auctor, imperdiet tellus sed, tempus metus. Morbi tempor vel lectus a cursus. Ut quis pharetra justo. Praesent feugiat turpis laoreet pretium eleifend. Cras a justo odio. Nullam euismod metus sed justo hendrerit mattis. Aenean nisi velit, malesuada sed faucibus eget, ullamcorper non leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam sed orci hendrerit quam cursus pharetra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
                            Sed non tincidunt purus. Nullam vestibulum porttitor nulla, vitae tempor dui sollicitudin at. Quisque in ante mattis, pretium magna quis, tristique lectus. Nulla eu lobortis nisi, eget vestibulum leo. Praesent libero urna, imperdiet a quam sit amet, tristique condimentum libero. Aliquam erat volutpat. Mauris semper congue mi eget maximus.
                            Morbi vestibulum mauris id dui pharetra pulvinar. Sed eu pulvinar libero, sed facilisis mi. Fusce at gravida lectus, sit amet ultrices massa. Aenean nec risus vitae est placerat consectetur. Vestibulum ornare elementum neque sed finibus. In consectetur quam neque, vitae volutpat nulla consequat ut. Mauris non elementum felis. Nullam ut accumsan arcu. Vestibulum non metus eget ipsum eleifend scelerisque tincidunt faucibus nunc. Nam pellentesque nec arcu vitae sagittis. Sed ligula nisi, cursus vitae justo sit amet, efficitur malesuada urna.
                            Cras nec nulla lectus. In eleifend libero vitae purus ultrices, eu aliquet orci tincidunt. Proin ultrices maximus purus, et ullamcorper sem vestibulum in. Suspendisse tristique bibendum ligula eu tincidunt. Phasellus quis feugiat risus. Praesent sed eros magna. Quisque tortor diam, vehicula in massa quis, egestas accumsan enim. Vivamus at maximus neque. Praesent rutrum vitae velit in aliquet. Cras non mi lectus. Nulla facilisi. Sed sodales mauris vitae consectetur vehicula. Nulla rhoncus dolor eget interdum lobortis. Fusce mollis sem eu vehicula tempor.
                            Nulla quis vestibulum turpis, at cursus eros. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec vulputate malesuada ex id consectetur. Curabitur congue tortor nec neque ultrices aliquam. Fusce lacinia, eros a tincidunt faucibus, erat arcu maximus nibh, ut ullamcorper ante nunc eget arcu. Integer vestibulum, dui vitae tristique facilisis, quam diam fermentum purus, vel ultricies magna ipsum nec justo. Maecenas nec feugiat tortor. Mauris pharetra tempus nibh a hendrerit. Sed ex eros, placerat at sollicitudin ac, congue ac lorem. Phasellus ut maximus turpis. Cras posuere blandit orci et vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec pretium, ante a euismod lobortis, diam dolor porta nunc, vel dignissim elit           
                        </p>
                    </div>
                </div>
                {/* SPACER */}
                <div className='mb-48'></div>
            </div>
            {/* ADD BUTTON */}
            <div className='fixed md:bottom-[4%] bottom-[5%] md:right-[13%] right-[10%] border-solid'>
                <button className='flex justify-center items-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-[20px] text-center sm:text-[35px] text-white bg-police-blue hover:bg-[#0022AA] rounded-full shadow-[0px_20px_75px_rgba(0,68,204,1)]  '>
                    <FontAwesomeIcon icon={faPlus} />  {/* link to add faq page */}
                </button> 
            </div>
        </div>
    );
};

// border-solid border-2 border-sky-500

{/* 
TEMPLATE
<div className='bg-white rounded-lg shadow-middle-custom-blue p-5 mb-7'>
    <div>
        <h1 className='text-3xl font-bold mb-3'>

        </h1>
        <p className='text-justify'>

        </p>
    </div>
</div> 
*/}