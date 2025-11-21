"use client";

import { Sparkles } from "lucide-react";

export const Header = () => {
    return (
        <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
                <div className="bg-pink-500 p-2 rounded-lg">
                    <Sparkles className="text-white w-6 h-6" />
                </div>
                <h1 className="text-white font-bold text-xl tracking-tight">
                    Lingua<span className="text-pink-500">AI</span>
                </h1>
            </div>
            <div className="pointer-events-auto">
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-sm border border-white/10">
                    Sign In
                </button>
            </div>
        </div>
    );
};
