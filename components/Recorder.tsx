'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const mimeType = "audio/webm";

function Recorder({uploadAudio, inline, onTranscript}: {uploadAudio: (blob:Blob) => void, inline?: boolean, onTranscript?: (text: string) => void}){ 

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const { pending } = useFormStatus();
    const { toast } = useToast();
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    const getMicrophonePermission = useCallback(async () => {
        if (typeof window === 'undefined') return

        // Basic feature detection: need MediaRecorder and navigator.mediaDevices.getUserMedia
        if (!('MediaRecorder' in window) || !navigator?.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast({ title: 'Microphone not supported', description: 'Audio recording is not supported by this browser or environment.', variant: 'destructive' })
            return
        }

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({ audio: true })
            setPermission(true)
            setStream(streamData)
        } catch (error: any) {
            // show friendly error to user
            toast({ title: 'Microphone access failed', description: error?.message || 'Unable to access microphone. Please check permissions.', variant: 'destructive' })
        }
    }, [toast])

    // run once on mount
    useEffect(() => {
        // only attempt permission checks in the browser
        if (typeof window === 'undefined') return
        getMicrophonePermission()
    }, [getMicrophonePermission])

    const startRecording = async () => {
        if (!stream || pending || typeof MediaRecorder === 'undefined') {
            toast({ title: 'Cannot start recording', description: 'Microphone is not ready or recording is not supported.', variant: 'destructive' })
            return
        }

        setRecordingStatus('recording')

        try {
            //Create a new media recorder instance using the stream
            const media = new MediaRecorder(stream, { mimeType })
            mediaRecorder.current = media
            mediaRecorder.current.start()

            const localAudioChucks: Blob[] = []
            mediaRecorder.current.ondataavailable = (event) => {
                if (typeof event.data === 'undefined') return
                if (event.data.size === 0) return

                localAudioChucks.push(event.data)
            }

            setAudioChunks(localAudioChucks)
        } catch (err: any) {
            toast({ title: 'Recording failed', description: err?.message || 'Unable to start recording.', variant: 'destructive' })
            setRecordingStatus('inactive')
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder.current === null || pending) return;

        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, {type: mimeType});
            const audioUrl = URL.createObjectURL(audioBlob);
            uploadAudio(audioBlob);
                            // If an inline onTranscript handler is provided, call it with an empty placeholder.
                            // (Speech-to-text can be integrated later.)
                            if (onTranscript) {
                                    try {
                                            onTranscript("")
                                    } catch (e) {
                                            // ignore
                                    }
                            }
                            setAudioChunks([]);
        }
    }

        // When used inline (e.g. inside textareas) render a small icon-only button
        if (inline) {
            return (
                <div>
                    {!permission && (
                        <Button onClick={getMicrophonePermission} size="sm">
                            <Mic className="h-4 w-4" />
                        </Button>
                    )}

                    {permission && recordingStatus === "inactive" && (
                        <Button onClick={startRecording} size="sm">
                            <Mic className="h-4 w-4" />
                        </Button>
                    )}

                    {recordingStatus === "recording" && (
                        <Button onClick={stopRecording} size="sm" className="bg-red-600">
                            <Mic className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
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
                                    <Button onClick={stopRecording} className='greyscale text-white bg-red-600 rounded-full' >
                                            <Mic className="mr-2 h-4 w-4" /> Recording
                                    </Button>
                            )
                    }
                
            </div>
        )
}

export default Recorder


