import { useState, useRef } from "react";

interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);

    // Play audio from queue
    const playNextInQueue = () => {
        console.log("playNextInQueue called. Queue length:", audioQueueRef.current.length, "isPlaying:", isPlayingRef.current);
        
        if (isPlayingRef.current || audioQueueRef.current.length === 0) {
            if (audioQueueRef.current.length === 0) {
                setIsSpeaking(false);
            }
            return;
        }

        isPlayingRef.current = true;
        setIsSpeaking(true);
        const nextUrl = audioQueueRef.current.shift()!;

        console.log("Playing audio URL:", nextUrl);

        if (audioRef.current) {
            audioRef.current.src = nextUrl;
            console.log("Audio element src set, attempting to play...");
            
            audioRef.current.play()
                .then(() => {
                    console.log("✅ Audio playing successfully");
                })
                .catch((e) => {
                    console.error("❌ Error playing audio:", e);
                    isPlayingRef.current = false;
                    playNextInQueue();
                });

            audioRef.current.onended = () => {
                console.log("Audio ended, playing next in queue");
                URL.revokeObjectURL(nextUrl);
                isPlayingRef.current = false;
                playNextInQueue();
            };
        } else {
            console.error("❌ audioRef.current is null!");
        }
    };

    // Generate TTS for a text chunk
    const generateSpeech = async (text: string) => {
        try {
            console.log("Generating speech for:", text);
            const ttsRes = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!ttsRes.ok) {
                throw new Error("Failed to fetch TTS response");
            }

            const blob = await ttsRes.blob();
            const url = URL.createObjectURL(blob);
            console.log("Audio blob created, size:", blob.size, "URL:", url);
            audioQueueRef.current.push(url);
            playNextInQueue();
        } catch (error) {
            console.error("Error generating speech:", error);
        }
    };

    // Transcribe audio to text
    const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
        try {
            console.log("Transcribing audio blob, size:", audioBlob.size);
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");

            const response = await fetch("/api/stt", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to transcribe audio");
            }

            const data = await response.json();
            console.log("Transcription successful:", data.text);
            return data.text;
        } catch (error) {
            console.error("Error transcribing audio:", error);
            return null;
        }
    };

    const sendMessage = async (audioBlob?: Blob) => {
        if (loading) return;

        let messageContent = input.trim();

        // If audio is provided, transcribe it first
        if (audioBlob) {
            setLoading(true);
            const transcribedText = await transcribeAudio(audioBlob);
            if (!transcribedText) {
                setLoading(false);
                return;
            }
            messageContent = transcribedText;
            setInput(transcribedText); // Show transcribed text in input
        }

        if (!messageContent) {
            setLoading(false);
            return;
        }

        const userMessage: Message = { role: "user", content: messageContent };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        let fullResponse = "";
        let pendingText = "";
        let assistantMessageIndex = -1;

        try {
            // Start streaming chat response
            const chatRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!chatRes.ok) {
                throw new Error("Failed to fetch chat response");
            }

            const reader = chatRes.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No reader available");
            }

            // Add placeholder message for assistant
            setMessages((prev) => {
                assistantMessageIndex = prev.length;
                return [...prev, { role: "assistant", content: "" }];
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;
                pendingText += chunk;

                // Update UI with streaming text
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[assistantMessageIndex] = { role: "assistant", content: fullResponse };
                    return updated;
                });

                // Check if we have complete sentences to speak
                const sentenceEndings = /[.!?]/g;
                const matches = [...pendingText.matchAll(sentenceEndings)];
                
                if (matches.length > 0) {
                    const lastMatch = matches[matches.length - 1];
                    const lastIndex = lastMatch.index! + 1;
                    
                    const completeSentences = pendingText.substring(0, lastIndex).trim();
                    pendingText = pendingText.substring(lastIndex).trim();

                    console.log("Complete sentences to speak:", completeSentences);
                    console.log("Remaining text:", pendingText);

                    if (completeSentences) {
                        generateSpeech(completeSentences);
                    }
                }
            }

            // Speak any remaining text
            if (pendingText.trim()) {
                console.log("Speaking remaining text:", pendingText.trim());
                generateSpeech(pendingText.trim());
            }
            
            console.log("Finished streaming. Total response:", fullResponse);

        } catch (error) {
            console.error("Error in chat flow:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        input,
        setInput,
        loading,
        isSpeaking,
        sendMessage,
        audioRef,
        transcribeAudio,
    };
};
