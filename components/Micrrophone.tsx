import { useRecordVoice } from '@/hooks/useRecordVoice';
import React from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const Micrrophone = () => {
    const { startRecording, stopRecording } = useRecordVoice();
    return (
        <div>
            <Button
                onMouseDown={startRecording}    // Start recording when mouse is pressed
                onMouseUp={stopRecording}        // Stop recording when mouse is released
                onTouchStart={startRecording}    // Start recording when touch begins on a touch device
                onTouchEnd={stopRecording}        // Stop recording when touch ends on a touch device
            >
                <Image src="@/public/Images/microphone-svgrepo-com.svg" alt="Microphone" />
            </Button>
        </div>
    )
}

export default Micrrophone
