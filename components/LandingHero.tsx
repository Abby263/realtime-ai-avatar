"use client";

import { ArrowRight, Mic, MessageSquare, Sparkles, Zap, Globe, Brain } from "lucide-react";

export const LandingHero = ({ onStart }: { onStart: () => void }) => {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="max-w-6xl mx-auto px-8 text-center">
                {/* Hero Section */}
                <div className="mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span className="text-pink-300 text-sm font-medium">Powered by GPT-4 & Advanced TTS</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">AI Companion</span>
                        <br />
                        Speaks Like a Human
                    </h1>
                    
                    <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Experience natural, real-time conversations with a lifelike 3D avatar. 
                        Speak naturally, get instant responses, and watch as your AI companion 
                        responds with perfectly synchronized speech and expressions.
                    </p>
                    
                    <button
                        onClick={onStart}
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl shadow-pink-500/50"
                    >
                        Start Talking Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                    <FeatureCard
                        icon={<Mic className="w-8 h-8" />}
                        title="Voice-to-Voice"
                        description="Speak naturally and get instant audio responses. No typing required."
                        gradient="from-blue-500 to-cyan-500"
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Real-Time Streaming"
                        description="Lightning-fast responses that stream word-by-word as they're generated."
                        gradient="from-purple-500 to-pink-500"
                    />
                    <FeatureCard
                        icon={<Brain className="w-8 h-8" />}
                        title="Lifelike Animation"
                        description="Advanced lip sync and facial expressions for natural conversation."
                        gradient="from-pink-500 to-orange-500"
                    />
                </div>

                {/* Stats Section */}
                <div className="mt-16 flex justify-center gap-12">
                    <Stat value="< 100ms" label="Response Time" />
                    <Stat value="24/7" label="Always Available" />
                    <Stat value="∞" label="Conversations" />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ 
    icon, 
    title, 
    description, 
    gradient 
}: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    gradient: string; 
}) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 hover:border-white/20">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
                <div className="text-white">{icon}</div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{description}</p>
        </div>
    );
};

const Stat = ({ value, label }: { value: string; label: string }) => {
    return (
        <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-1">
                {value}
            </div>
            <div className="text-white/50 text-sm">{label}</div>
        </div>
    );
};

