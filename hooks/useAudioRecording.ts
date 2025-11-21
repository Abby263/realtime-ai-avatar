import { useState, useRef, useCallback, useEffect } from "react";

interface AudioRecordingOptions {
    autoStopOnSilence?: boolean;
    silenceThreshold?: number; // in decibels
    silenceDuration?: number; // in milliseconds
}

export const useAudioRecording = (options: AudioRecordingOptions = {}) => {
    const {
        autoStopOnSilence = false,
        silenceThreshold = -50, // dB
        silenceDuration = 1500, // 1.5 seconds of silence
    } = options;

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isListening, setIsListening] = useState(false); // Voice detected
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const voiceDetectedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    const shouldStopRef = useRef(false);

    // Stop recording helper
    const stopRecording = useCallback(() => {
        console.log("🛑 stopRecording called, state:", mediaRecorderRef.current?.state);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("Stopping recording...");
        }
    }, []);

    // Monitor audio levels for voice activity detection
    const startMonitoring = useCallback(() => {
        if (!analyserRef.current || !autoStopOnSilence) {
            console.log("⚠️ Cannot start monitoring - analyser not ready or VAD disabled");
            return;
        }

        console.log("👂 Starting audio level monitoring with threshold:", silenceThreshold, "dB");

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let frameCount = 0;

        const checkAudioLevel = () => {
            // Check if we should stop monitoring
            if (!analyserRef.current || !mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
                console.log("⚠️ Stopping monitoring - recorder inactive or analyser lost");
                return;
            }

            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume
            const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
            
            // Convert to decibels (approximate)
            const db = average > 0 ? 20 * Math.log10(average / 255) : -100;
            
            // Log every 30 frames (~500ms) for debugging
            if (frameCount % 30 === 0) {
                console.log(`📊 Audio level: ${db.toFixed(2)} dB (threshold: ${silenceThreshold} dB) | Average: ${average.toFixed(2)}`);
            }
            frameCount++;
            
            // More sensitive detection: consider speech if above threshold
            const isSpeaking = db > silenceThreshold;

            if (isSpeaking) {
                // Voice detected
                if (!voiceDetectedRef.current) {
                    console.log("🎤 Voice detected! Level:", db.toFixed(2), "dB");
                    voiceDetectedRef.current = true;
                    setIsListening(true);
                }

                // Clear any existing silence timeout
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current);
                    silenceTimeoutRef.current = null;
                }
            } else if (voiceDetectedRef.current) {
                // Silence detected after voice was detected
                if (!silenceTimeoutRef.current) {
                    console.log("🤫 Silence detected (", db.toFixed(2), "dB), starting countdown...");
                    setIsListening(false);
                    
                    silenceTimeoutRef.current = setTimeout(() => {
                        console.log("⏹️ Silence timeout fired! Stopping recording...");
                        shouldStopRef.current = true;
                        // Stop recording
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                            console.log("✅ Calling stop on mediaRecorder");
                            mediaRecorderRef.current.stop();
                            setIsRecording(false);
                        } else {
                            console.log("❌ MediaRecorder not available or already stopped");
                        }
                    }, silenceDuration);
                }
            }

            // Continue monitoring
            animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();
    }, [autoStopOnSilence, silenceThreshold, silenceDuration]);

    const startRecording = useCallback(async () => {
        try {
            console.log("Requesting microphone access...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            // Use webm format for better browser compatibility
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
                ? 'audio/webm' 
                : 'audio/mp4';
            
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
            });
            
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            voiceDetectedRef.current = false;

            // Set up audio analysis for VAD
            if (autoStopOnSilence) {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                analyser.smoothingTimeConstant = 0.8;
                source.connect(analyser);

                audioContextRef.current = audioContext;
                analyserRef.current = analyser;
            }

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                console.log("📹 MediaRecorder onstop event fired");
                console.log("   - Chunks collected:", chunksRef.current.length);
                console.log("   - Voice detected:", voiceDetectedRef.current);
                console.log("   - Auto-stop on silence:", autoStopOnSilence);
                
                const blob = new Blob(chunksRef.current, { type: mimeType });
                console.log("   - Blob size:", blob.size, "bytes");
                
                // Only set audio blob if we detected voice (prevents empty recordings)
                if (voiceDetectedRef.current || !autoStopOnSilence) {
                    setAudioBlob(blob);
                    console.log("✅ Recording stopped successfully. Blob will be sent.");
                } else {
                    console.log("⚠️ No voice detected, discarding recording");
                }
                
                // Cleanup
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                    console.log("🎤 Microphone tracks stopped");
                }
                
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                    console.log("🔊 Audio context closed");
                }
                
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                    console.log("🎬 Animation frame cancelled");
                }
                
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current);
                    silenceTimeoutRef.current = null;
                    console.log("⏲️ Silence timeout cleared");
                }
                
                setIsListening(false);
                voiceDetectedRef.current = false;
                console.log("🏁 Cleanup complete");
            };

            // Reset stop flag
            shouldStopRef.current = false;

            mediaRecorder.start();
            setIsRecording(true);
            console.log("✅ Recording started", autoStopOnSilence ? "with VAD" : "");

            // Start monitoring if VAD is enabled
            if (autoStopOnSilence) {
                // Small delay to ensure everything is set up
                setTimeout(() => {
                    console.log("🚀 Initiating voice activity detection...");
                    startMonitoring();
                }, 100);
            }
        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Could not access microphone. Please grant permission.");
        }
    }, [autoStopOnSilence, startMonitoring]);

    const clearRecording = useCallback(() => {
        setAudioBlob(null);
        chunksRef.current = [];
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
        };
    }, []);

    return {
        isRecording,
        audioBlob,
        isListening,
        startRecording,
        stopRecording,
        clearRecording,
    };
};

