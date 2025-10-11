'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const mimeType = "audio/webm";

// SpeechRecognition types fallback
type AnyRecognition = any

function Recorder({uploadAudio, inline, onTranscript}: {uploadAudio: (blob:Blob) => void, inline?: boolean, onTranscript?: (text: string) => void}){ 

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<AnyRecognition | null>(null);
    const { pending } = useFormStatus();
    const { toast } = useToast();
    const [permission, setPermission] = useState(false);
    const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    // Use a ref to hold audio chunks to avoid stale closures inside recorder callbacks
    const audioChunksRef = useRef<Blob[]>([]);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const getMicrophonePermission = useCallback(async () => {
        if (typeof window === 'undefined') return

        // Must be secure context for getUserMedia to work in most browsers
        if (!window.isSecureContext) {
            toast({ title: 'Insecure context', description: 'Microphone access requires HTTPS or localhost.', variant: 'destructive' })
            return
        }

        // Basic feature detection
        const hasGetUserMedia = !!(navigator && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function')
        const hasMediaRecorder = typeof (window as any).MediaRecorder !== 'undefined'

        if (!hasGetUserMedia) {
            toast({ title: 'Microphone not supported', description: 'Your browser does not support navigator.mediaDevices.getUserMedia.', variant: 'destructive' })
            return
        }

        if (!hasMediaRecorder) {
            toast({ title: 'Recording not supported', description: 'This browser does not support the MediaRecorder API.', variant: 'destructive' })
            return
        }

        // Simplify permission handling: probe using permissions.query if available (non-fatal),
        // then always attempt getUserMedia. getUserMedia must be triggered by a user gesture.
        try {
            if ((navigator as any).permissions && typeof (navigator as any).permissions.query === 'function') {
                try {
                    const perm = await (navigator as any).permissions.query({ name: 'microphone' as PermissionName });
                    const cur = (perm as any).state
                    setPermissionState(cur === 'granted' ? 'granted' : cur === 'denied' ? 'denied' : 'prompt')
                    try {
                        (perm as any).addEventListener('change', () => {
                            const s = (perm as any).state
                            setPermissionState(s === 'granted' ? 'granted' : s === 'denied' ? 'denied' : 'prompt')
                        })
                    } catch {
                        ;(perm as any).onchange = () => {
                            const s = (perm as any).state
                            setPermissionState(s === 'granted' ? 'granted' : s === 'denied' ? 'denied' : 'prompt')
                        }
                    }
                } catch (e) {
                    console.log('[Recorder] permissions.query threw', e)
                }
            }

            const streamData = await navigator.mediaDevices.getUserMedia({ audio: true })
            setPermission(true)
            setPermissionState('granted')
            setStream(streamData)
        } catch (error: any) {
            const msg = error?.message || error?.name || 'Unable to access microphone. Please check permissions.'
            if (error && (error.name === 'NotAllowedError' || error.name === 'SecurityError')) setPermissionState('denied')
            console.log('[Recorder] getUserMedia failed', error)
            toast({ title: 'Microphone access failed', description: msg, variant: 'destructive' })
        }
    }, [toast])

    // On mount, probe the permissions API to set an initial status for the UI
    useEffect(() => {
        if (typeof window === 'undefined') return
        if ((navigator as any).permissions && typeof (navigator as any).permissions.query === 'function') {
            (async () => {
                try {
                    const perm = await (navigator as any).permissions.query({ name: 'microphone' as PermissionName });
                    const cur2 = (perm as any).state
                    setPermissionState(cur2 === 'granted' ? 'granted' : cur2 === 'denied' ? 'denied' : 'prompt')
                    try {
                        (perm as any).addEventListener('change', () => {
                            const s = (perm as any).state
                            setPermissionState(s === 'granted' ? 'granted' : s === 'denied' ? 'denied' : 'prompt')
                        })
                    } catch {
                        ;(perm as any).onchange = () => {
                            const s = (perm as any).state
                            setPermissionState(s === 'granted' ? 'granted' : s === 'denied' ? 'denied' : 'prompt')
                        }
                    }
                } catch {
                    setPermissionState('unknown')
                }
            })()
        }
    }, [])

    // Cleanup media tracks on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                try { mediaRecorder.current.stop() } catch {}
            }
            if (stream) {
                stream.getTracks().forEach((t) => t.stop())
            }
        }
    }, [stream])

    const startRecording = async () => {
        if (!stream || pending || typeof (window as any).MediaRecorder === 'undefined') {
            toast({ title: 'Cannot start recording', description: 'Microphone is not ready or recording is not supported.', variant: 'destructive' })
            return
        }

        setRecordingStatus('recording')

        try {
            // Choose a safe mime type supported by the browser to avoid NotSupportedError
            let resolvedMime = mimeType
            try {
                const MR: any = (window as any).MediaRecorder
                if (MR && typeof MR.isTypeSupported === 'function') {
                    if (MR.isTypeSupported('audio/webm;codecs=opus')) resolvedMime = 'audio/webm;codecs=opus'
                    else if (MR.isTypeSupported('audio/webm')) resolvedMime = 'audio/webm'
                    else if (MR.isTypeSupported('audio/mp4')) resolvedMime = 'audio/mp4'
                    else if (MR.isTypeSupported('audio/mpeg')) resolvedMime = 'audio/mpeg'
                }
            } catch (e) {
                console.log('[Recorder] mime detection failed', e)
            }

            // Create a new media recorder instance using the stream
            const media = new (window as any).MediaRecorder(stream, { mimeType: resolvedMime })
            mediaRecorder.current = media
            const localAudioChunks: Blob[] = []
            audioChunksRef.current = localAudioChunks

            const recorder = mediaRecorder.current!
            recorder.ondataavailable = (event: BlobEvent) => {
                if (!event || !event.data) return
                if (event.data.size === 0) return
                audioChunksRef.current.push(event.data)
                // log chunk sizes/count so it's visible in console
                try { console.log('[Recorder] ondataavailable chunk size', event.data.size, 'chunks now', audioChunksRef.current.length) } catch {}
            }

            // Try to start SpeechRecognition alongside MediaRecorder (if available)
            try {
                const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                if (SR && typeof SR === 'function' && onTranscript) {
                    const recognition: AnyRecognition = new SR()
                    recognition.lang = 'en-US'
                    recognition.interimResults = false
                    recognition.continuous = true
                    recognition.onresult = (ev: any) => {
                        try {
                            let finalText = ''
                            for (let i = ev.resultIndex; i < ev.results.length; i++) {
                                const res = ev.results[i]
                                if (res.isFinal) finalText += (res[0]?.transcript || '')
                            }
                            if (finalText.trim()) {
                                try { console.log('[Recorder] SpeechRecognition final result', finalText) } catch {}
                                try { onTranscript(finalText) } catch (e) { console.log('[Recorder] onTranscript threw', e) }
                            }
                        } catch (e) { console.log('[Recorder] recognition.onresult error', e) }
                    }
                    recognition.onerror = (err: any) => { console.log('[Recorder] recognition error', err) }
                    recognition.onstart = () => { console.log('[Recorder] recognition started') }
                    recognition.onend = () => { console.log('[Recorder] recognition ended') }
                    try { recognition.start(); recognitionRef.current = recognition } catch (e) { console.log('[Recorder] recognition.start failed', e) }
                }
            } catch (e) {
                console.log('[Recorder] SpeechRecognition setup failed', e)
            }

            recorder.start()
            // keep a shallow state copy for UI/debugging
            setAudioChunks(audioChunksRef.current)
        } catch (err: any) {
            toast({ title: 'Recording failed', description: err?.message || 'Unable to start recording.', variant: 'destructive' })
            setRecordingStatus('inactive')
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder.current === null || pending) return;

        setRecordingStatus("inactive");
        // stop SpeechRecognition first to allow it to emit final results
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); console.log('[Recorder] recognition.stop called') } catch (e) { console.log('[Recorder] recognition.stop threw', e) }
            recognitionRef.current = null
        }

        // assign onstop BEFORE calling stop to ensure the handler is present
            mediaRecorder.current.onstop = () => {
            try {
                const chunks = audioChunksRef.current || []
                try { console.log('[Recorder] onstop - chunks count', chunks.length) } catch {}
                const audioBlob = new Blob(chunks, { type: mimeType })
                try { console.log('[Recorder] onstop - blob size', audioBlob.size) } catch {}
                const audioUrl = URL.createObjectURL(audioBlob)
                try { console.log('[Recorder] audioUrl', audioUrl) } catch {}
                try { console.log('[Recorder] calling uploadAudio with blob', audioBlob, 'size', audioBlob.size) } catch {}
                try { uploadAudio(audioBlob); console.log('[Recorder] uploadAudio called') } catch (err) { console.log('[Recorder] uploadAudio threw', err) }
                // call optional transcript handler
                if (onTranscript) {
                    try { console.log('[Recorder] calling onTranscript with empty placeholder') } catch {}
                    try { onTranscript("") } catch { }
                }
            } finally {
                // reset collected chunks
                audioChunksRef.current = []
                setAudioChunks([])
            }
        }
        try {
            mediaRecorder.current.stop()
        } catch (e) {
            // ignore stop errors
        }
    }

        // When used inline (e.g. inside textareas) render a small icon-only button
        if (inline) {
            return (
                <div>
                    {/* Permission status */}
                    <div className="mb-2 text-xs text-gray-600">Status: {permissionState}</div>
                    {/* Hidden file input for fallback */}
                    <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) uploadAudio(new Blob([f], { type: f.type }))
                    }} />
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
                                        {/* fallback upload button - only show when microphone permission isn't available */}
                                        {!permission && (
                                            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="ml-2">
                                                Upload audio
                                            </Button>
                                        )}
                </div>
            )
        }

        return (
            <div className='fixed bottom-[5%] left-1/2 transform -translate-x-1/2 md:bottom-[4%] border-solid'>
            <div className="flex items-center space-x-2">
            {/* permission status + help */}
            <div className="text-sm text-gray-600">Microphone: <span className={`font-medium ${permissionState === 'granted' ? 'text-green-600' : permissionState === 'denied' ? 'text-red-600' : 'text-yellow-600'}`}>{permissionState}</span></div>
            <a className="text-sm underline text-blue-600" href="#" onClick={(e) => { e.preventDefault(); toast({ title: 'Mic help', description: 'Open your browser site settings and allow Microphone permissions for this site. On mobile, use the site info menu in the URL bar.' })}}>How to allow</a>
            </div>

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

                        {/* file upload fallback - only show when microphone permission isn't available */}
                        <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) uploadAudio(new Blob([f], { type: f.type }))
                        }} />
                        { !permission && (
                            <div className="mt-2">
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Upload audio file</Button>
                            </div>
                        )}
                
            </div>
        )
}

export default Recorder


