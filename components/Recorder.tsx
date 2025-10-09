'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

export const mimeType = "audio/webm";

type RecorderProps = {
    uploadAudio: (blob:Blob) => void,
    inline?: boolean,
    onTranscript?: (text: string) => void,
}

function Recorder({uploadAudio, inline = false, onTranscript}: RecorderProps){ 

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

        // keep reference to the chunks array so onstop can read it
        setAudioChunks(localAudioChucks);
    };

    // Stop recording and return a Promise that resolves with the Blob
    const stopRecording = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (mediaRecorder.current === null || pending) return resolve(null);

            setRecordingStatus("inactive");
            const media = mediaRecorder.current;
            media.stop();

            media.onstop = () => {
                try {
                    const audioBlob = new Blob(audioChunks, { type: mimeType });
                    // call uploadAudio if provided
                    try { uploadAudio(audioBlob); } catch (e) { /* swallow */ }
                    // clear chunks
                    setAudioChunks([]);
                    resolve(audioBlob);
                } catch (err) {
                    console.error('Error creating audio blob', err);
                    resolve(null);
                }
            };
        });
    }

    return (
        <div className={inline ? 'inline-block' : 'fixed bottom-[5%] left-1/2 transform -translate-x-1/2 md:bottom-[4%] border-solid'}>
        {!permission && (
            <Button onClick={getMicrophonePermission} aria-label="Enable microphone" title="Enable microphone" className={inline ? 'p-2 rounded-full' : ''}>
                <Mic className={`h-4 w-4 ${inline ? '' : 'mr-2'}`} />
                {!inline && <span>Get Microphone</span>}
            </Button>
        )}

        {pending && (
            <Button onClick={getMicrophonePermission} className={`greyscale text-white bg-police-blue hover:bg-[#0022AA] ${inline ? 'p-2 rounded-full' : ''}`} aria-label="Microphone pending" title="Microphone pending">
                <Mic className={`h-4 w-4 ${inline ? '' : 'mr-2'}`} />
                {!inline && <span>Pending</span>}
            </Button>
        )}

        {permission && recordingStatus === "inactive" && !pending && (
            <Button onClick={startRecording} className={`greyscale text-white bg-police-blue hover:bg-[#0022AA] ${inline ? 'p-2 rounded-full' : ''}`} aria-label="Start recording" title="Start recording">
                <Mic className={`h-4 w-4 ${inline ? '' : 'mr-2'}`} />
                {!inline && <span>Microphone</span>}
            </Button>
        )}
        {
            recordingStatus === "recording" && (
                <Button onClick={async () => {
                    // stop and get recorded blob
                    const blob = await stopRecording();
                    if (!blob) return;

                    // If an onTranscript callback is provided, call server transcription endpoint
                    if (onTranscript) {
                        try {
                            const arrayBuffer = await blob.arrayBuffer();
                            const bytes = new Uint8Array(arrayBuffer);
                            // Convert to base64
                            let binary = '';
                            const chunkSize = 0x8000;
                            for (let i = 0; i < bytes.length; i += chunkSize) {
                                const slice = bytes.subarray(i, i + chunkSize);
                                binary += String.fromCharCode.apply(null, Array.from(slice));
                            }
                            const base64 = btoa(binary);

                            const resp = await fetch('/api/speechToText', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ audio: base64 }),
                            });
                            if (resp.ok) {
                                const data = await resp.json();
                                const text = data?.text || data?.transcription || data?.message || '';
                                if (text) onTranscript(text);
                            }
                        } catch (err) {
                            console.error('Transcription failed', err);
                        }
                    }
                }} className='greyscale text-white bg-red-600 rounded-full' >
                    <Mic className="h-4 w-4" />
                </Button>
            )
        }
                
    </div>
    
  )
}

export default Recorder


