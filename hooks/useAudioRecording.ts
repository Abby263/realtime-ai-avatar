import { useState, useRef, useCallback } from "react";

export const useAudioRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            console.log("Requesting microphone access...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Use webm format for better browser compatibility
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
                ? 'audio/webm' 
                : 'audio/mp4';
            
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
            });
            
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                console.log("Recording stopped. Blob size:", blob.size);
                
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            console.log("Recording started");
        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Could not access microphone. Please grant permission.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("Stopping recording...");
        }
    }, []);

    const clearRecording = useCallback(() => {
        setAudioBlob(null);
        chunksRef.current = [];
    }, []);

    return {
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        clearRecording,
    };
};

