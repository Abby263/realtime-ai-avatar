"use client";

import { Sparkles, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { SignInModal } from "./SignInModal";

export const Header = ({ 
    showLanding, 
    onStart, 
    onBack 
}: { 
    showLanding: boolean; 
    onStart?: () => void; 
    onBack?: () => void;
}) => {
    const [showSignInModal, setShowSignInModal] = useState(false);

    return (
        <>
            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-xl shadow-lg">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-white font-bold text-2xl tracking-tight">
                        Lingua<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">AI</span>
                    </h1>
                </div>
                <div className="pointer-events-auto flex items-center gap-3">
                    {!showLanding && onBack && (
                        <button 
                            onClick={onBack}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </button>
                    )}
                    <button 
                        onClick={() => setShowSignInModal(true)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
                    >
                        Sign In
                    </button>
                </div>
            </div>
            
            <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
        </>
    );
};
