'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useFormStatus } from 'react-dom';
import { profile } from 'console';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

export const mimeType = "audio/webm";

function Recorder({uploadAudio}: {uploadAudio: (blob:Blob) => void}){ 

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const { pending } = useFormStatus();
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    useEffect(() => {
        getMicrophonePermission();
    }, [])


    const getMicrophonePermission = async () => {
        if("MediaRecorder" in window){
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({audio: true});
                setPermission(true);
                setStream(streamData);
            }catch(error: any){
                alert(error.message);
            } 
        }else {
            alert("The MediaRecord API is not supported in your browser")
        }
    };

    const startRecording = async () => {
        if(stream === null || pending || MediaRecorder === null) return;

        setRecordingStatus("recording");

        //Create a new media recorder instance using the stream
        const media = new MediaRecorder(stream, {mimeType});
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localAudioChucks: Blob[] = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;

            localAudioChucks.push(event.data);
        }
        
        setAudioChunks(localAudioChucks);
    };

    const stopRecording = async () => {
        if (mediaRecorder.current === null || pending) return;

        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, {type: mimeType});
            const audioUrl = URL.createObjectURL(audioBlob);
            uploadAudio(audioBlob);
            setAudioChunks([]);
        }
    }

  return (
    <div className='fixed bottom-[5%] right-[10%] md:right-[13%] md:bottom-[4%] border-solid'>
        {!permission && (
            <button onClick={getMicrophonePermission}> Get Microphone</button>
        )} 

        {pending && (
            <button className="flex justify-center items-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-[20px] text-center sm:text-[35px] text-white bg-police-blue hover:bg-[#0022AA] rounded-full shadow-[0px_20px_75px_rgba(0,68,204,1)] greyscale">
                <FontAwesomeIcon icon={faMicrophone} />
            </button>
        )}
            
        {
            permission && recordingStatus === "inactive" && !pending && (
                <button className="flex justify-center items-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-[20px] text-center sm:text-[35px] text-white bg-police-blue hover:bg-[#0022AA] rounded-full shadow-[0px_20px_75px_rgba(0,68,204,1)]" onClick={startRecording} >
                    <FontAwesomeIcon icon={faMicrophone} />
                </button>
            )
        }        
        {
            recordingStatus === "recording" && (
                <button className="flex justify-center items-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-[20px] text-center sm:text-[35px] text-white bg-red-600 rounded-full shadow-[0px_20px_75px_rgba(0,68,204,1)]" onClick={stopRecording}  >
                    <FontAwesomeIcon icon={faMicrophone} />
                </button>
            )
        }
                
    </div>
    
  )
}

export default Recorder
