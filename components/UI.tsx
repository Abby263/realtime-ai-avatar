"use client";

import { useChat } from "@/hooks/useChat";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { Mic, MicOff, Send, MessageCircle, MessageCircleOff } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

export const UI = ({
    input,
    setInput,
    sendMessage,
    loading,
    isSpeaking,
    messages,
    onSpeechEnd,
}: {
    input: string;
    setInput: (val: string) => void;
    sendMessage: (audioBlob?: Blob) => void;
    loading: boolean;
    isSpeaking: boolean;
    messages: any[];
    onSpeechEnd?: () => void;
}) => {
    const [conversationMode, setConversationMode] = useState(false);
    const conversationModeRef = useRef(false);
    const [showWelcomeHint, setShowWelcomeHint] = useState(true);
    
    const { 
        isRecording, 
        audioBlob, 
        isListening,
        startRecording, 
        stopRecording, 
        clearRecording 
    } = useAudioRecording({
        autoStopOnSilence: conversationMode,
        silenceThreshold: -45, // Adjusted for your environment (background noise ~-50dB)
        silenceDuration: 1500, // 1.5 seconds of silence
    });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Update ref when conversation mode changes
    useEffect(() => {
        conversationModeRef.current = conversationMode;
    }, [conversationMode]);

    // Auto-start recording when conversation mode is enabled on mount
    const mountedRef = useRef(false);
    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            if (conversationMode) {
                console.log("🎙️ Auto-starting conversation mode on mount...");
                setTimeout(() => {
                    startRecording();
                }, 300); // Small delay to ensure everything is initialized
            }
        }
    }, [conversationMode, startRecording]);

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
            // Hide welcome hint after first message
            setShowWelcomeHint(false);
        }
    }, [audioBlob, isRecording, sendMessage, clearRecording]);

    // Auto-restart listening in conversation mode after avatar finishes speaking
    const handleConversationContinue = useCallback(() => {
        if (conversationModeRef.current && !loading && !isRecording) {
            console.log("🔄 Conversation mode: Restarting listening...");
            // Small delay to make it feel more natural
            setTimeout(() => {
                if (conversationModeRef.current) {
                    startRecording();
                }
            }, 500);
        }
    }, [loading, isRecording, startRecording]);

    // Handle speech end to restart listening
    useEffect(() => {
        if (!isSpeaking && conversationMode && !loading && !isRecording) {
            handleConversationContinue();
        }
    }, [isSpeaking, conversationMode, loading, isRecording, handleConversationContinue]);

    // Toggle conversation mode
    const toggleConversationMode = useCallback(() => {
        const newMode = !conversationMode;
        setConversationMode(newMode);
        
        if (newMode) {
            console.log("🎙️ Conversation mode ENABLED");
            // Start recording immediately when enabling
            startRecording();
        } else {
            console.log("⏸️ Conversation mode DISABLED");
            // Stop recording when disabling
            if (isRecording) {
                stopRecording();
            }
        }
    }, [conversationMode, isRecording, startRecording, stopRecording]);

    const handleMicClick = useCallback(() => {
        // In conversation mode, clicking mic toggles the mode off
        if (conversationMode) {
            toggleConversationMode();
        } else {
            // Manual mode: toggle recording
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    }, [conversationMode, isRecording, startRecording, stopRecording, toggleConversationMode]);

    const handleSendClick = useCallback(() => {
        if (conversationMode && isRecording) {
            // In conversation mode while recording, manually stop recording
            console.log("🛑 Manual stop triggered");
            stopRecording();
        } else if (!isRecording && !conversationMode) {
            // Manual mode - send text message
            sendMessage();
        }
    }, [isRecording, conversationMode, sendMessage, stopRecording]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-8 z-10 gap-4">
            {/* Welcome Hint for Conversation Mode */}
            {showWelcomeHint && conversationMode && (
                <div className="pointer-events-auto absolute top-24 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
                    <div className="bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-md rounded-2xl px-6 py-4 border border-green-400/30 shadow-2xl max-w-md">
                        <div className="flex items-start gap-3">
                            <MessageCircle size={24} className="text-white flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-base mb-1">🎙️ Voice Mode Active!</h3>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    Just start speaking naturally. I'll automatically detect when you're done and respond!
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowWelcomeHint(false)}
                                className="text-white/80 hover:text-white text-2xl leading-none flex-shrink-0 -mt-1"
                                title="Dismiss"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conversation Mode Toggle - positioned below header buttons */}
            <div className="pointer-events-auto absolute top-20 right-8 z-20">
                <button
                    onClick={toggleConversationMode}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 shadow-lg ${
                        conversationMode
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse-soft"
                            : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
                    } border border-white/20`}
                    title={conversationMode ? "Exit conversation mode" : "Enter conversation mode"}
                >
                    {conversationMode ? (
                        <>
                            <MessageCircle size={20} />
                            <span className="text-sm font-semibold">Conversation Mode</span>
                        </>
                    ) : (
                        <>
                            <MessageCircleOff size={20} />
                            <span className="text-sm font-semibold">Manual Mode</span>
                        </>
                    )}
                </button>
            </div>

            {/* Status Indicators */}
            {(isSpeaking || (isRecording && conversationMode)) && (
                <div className="pointer-events-auto max-w-screen-md mx-auto w-full animate-fade-in">
                    {isSpeaking ? (
                        <div className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-md rounded-xl px-5 py-3 border border-blue-400/30 shadow-2xl flex items-center gap-3 animate-pulse-soft">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg" style={{ animationDelay: "300ms" }}></div>
                            </div>
                            <span className="text-white text-sm font-semibold tracking-wide">Avatar is speaking...</span>
                        </div>
                    ) : isRecording && conversationMode && (
                        <div className={`backdrop-blur-md rounded-xl px-5 py-3 border shadow-2xl flex items-center gap-3 transition-all ${
                            isListening 
                                ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/30" 
                                : "bg-gradient-to-r from-yellow-500/90 to-orange-500/90 border-yellow-400/30"
                        }`}>
                            <div className="flex gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${isListening ? 'bg-white animate-pulse' : 'bg-white/60'}`}></div>
                                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${isListening ? 'bg-white animate-pulse' : 'bg-white/60'}`} style={{ animationDelay: "150ms" }}></div>
                                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${isListening ? 'bg-white animate-pulse' : 'bg-white/60'}`} style={{ animationDelay: "300ms" }}></div>
                            </div>
                            <span className="text-white text-sm font-semibold tracking-wide">
                                {isListening ? "Listening..." : "Waiting for speech..."}
                            </span>
                        </div>
                    )}
                </div>
            )}
            
            {/* Messages Display */}
            {messages.length > 0 && (
                <div className="pointer-events-auto max-w-screen-md mx-auto w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-2xl max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg transform transition-all hover:scale-105 ${
                                        message.role === "user"
                                            ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white"
                                            : "bg-white/20 text-white backdrop-blur-sm border border-white/10"
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {/* Input Box */}
            <div className={`pointer-events-auto max-w-screen-md mx-auto w-full backdrop-blur-lg rounded-3xl p-5 border shadow-2xl transition-all ${
                conversationMode 
                    ? "bg-gradient-to-br from-green-500/15 to-emerald-500/5 border-green-400/30 hover:border-green-400/50"
                    : "bg-gradient-to-br from-white/15 to-white/5 border-white/20 hover:border-white/30"
            }`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleMicClick}
                        disabled={loading && !conversationMode}
                        className={`p-4 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                            conversationMode
                                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/50 animate-pulse-soft"
                                : isRecording 
                                ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse shadow-red-500/50" 
                                : loading 
                                ? "bg-gray-500 cursor-not-allowed" 
                                : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/50"
                        } text-white`}
                        title={conversationMode ? "Exit conversation mode" : isRecording ? "Stop recording" : "Start recording"}
                    >
                        {conversationMode ? <MessageCircle size={24} /> : isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <input
                        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg font-medium"
                        placeholder={
                            conversationMode && isRecording
                                ? "🎤 Listening... (or click send to stop)" 
                                : conversationMode 
                                ? "🎙️ Conversation mode active..." 
                                : isRecording 
                                ? "🎤 Recording..." 
                                : "Type or speak your message..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isRecording && !conversationMode && handleSendClick()}
                        disabled={loading || isRecording || conversationMode}
                    />
                    <button
                        onClick={handleSendClick}
                        disabled={loading || (conversationMode && !isRecording)}
                        className={`p-4 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                            loading || (conversationMode && !isRecording)
                                ? "bg-gray-500 cursor-not-allowed" 
                                : conversationMode && isRecording
                                ? "bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/50 animate-pulse"
                                : "bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-pink-500/50"
                        } text-white`}
                        title={conversationMode && isRecording ? "Stop & send recording" : "Send message"}
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
