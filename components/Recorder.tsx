'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

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

        const localAudioChucks: Blob[] = [];
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
    <div className='fixed bottom-[5%] left-1/2 transform -translate-x-1/2 md:bottom-[4%] border-solid'>
        {!permission && (
            <Button onClick={getMicrophonePermission}>
                        <Mic className="mr-2 h-4 w-4" /> Get Microphone
            </Button>
        )} 

        {pending && (
            <Button onClick={getMicrophonePermission} className='greyscale text-white bg-police-blue hover:bg-[#0022AA]'>
                        <Mic className="mr-2 h-4 w-4" /> Pending
            </Button>
        )}
            
        {
            permission && recordingStatus === "inactive" && !pending && (
                <Button onClick={startRecording} className='greyscale text-white bg-police-blue hover:bg-[#0022AA]' >
                    <Mic className="mr-2 h-4 w-4" /> Microphone
                </Button>
            )
        }        
        {
            recordingStatus === "recording" && (
                <Button onClick={stopRecording} className='greyscale text-white text-white bg-red-600 rounded-full' >
                    <Mic className="mr-2 h-4 w-4" /> Recording
                </Button>
            )
        }
                
    </div>
    
  )
}

export default Recorder


