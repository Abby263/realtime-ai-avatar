"use client";

import { useChat } from "@/hooks/useChat";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { Mic, MicOff, Send } from "lucide-react";
import { useEffect, useRef } from "react";

export const UI = ({
    input,
    setInput,
    sendMessage,
    loading,
    isSpeaking,
    messages,
}: {
    input: string;
    setInput: (val: string) => void;
    sendMessage: (audioBlob?: Blob) => void;
    loading: boolean;
    isSpeaking: boolean;
    messages: any[];
}) => {
    const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useAudioRecording();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send audio when recording is complete
    useEffect(() => {
        if (audioBlob && !isRecording) {
            console.log("Audio blob ready, sending message...");
            sendMessage(audioBlob);
            clearRecording();
        }
    }, [audioBlob, isRecording]);

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSendClick = () => {
        if (!isRecording) {
            sendMessage();
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-8 z-10 gap-4">
            {/* Speaking Indicator */}
            {isSpeaking && (
                <div className="pointer-events-auto max-w-screen-md mx-auto w-full">
                    <div className="bg-blue-500/90 backdrop-blur-md rounded-lg px-4 py-2 border border-blue-400/30 shadow-lg flex items-center gap-3">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                        <span className="text-white text-sm font-medium">Avatar is speaking...</span>
                    </div>
                </div>
            )}
            
            {/* Messages Display */}
            {messages.length > 0 && (
                <div className="pointer-events-auto max-w-screen-md mx-auto w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        message.role === "user"
                                            ? "bg-pink-500 text-white"
                                            : "bg-white/20 text-white"
                                    }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {/* Input Box */}
            <div className="pointer-events-auto max-w-screen-md mx-auto w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleMicClick}
                        disabled={loading}
                        className={`p-3 rounded-full transition-all ${
                            isRecording 
                                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                                : loading 
                                ? "bg-gray-500" 
                                : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                        title={isRecording ? "Stop recording" : "Start recording"}
                    >
                        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <input
                        className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg"
                        placeholder={isRecording ? "Listening..." : "Type or speak..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isRecording && handleSendClick()}
                        disabled={loading || isRecording}
                    />
                    <button
                        onClick={handleSendClick}
                        disabled={loading || isRecording}
                        className={`p-3 rounded-full transition-all ${
                            loading || isRecording
                                ? "bg-gray-500" 
                                : "bg-pink-500 hover:bg-pink-600"
                        } text-white`}
                        title="Send message"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={24} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
