"use client";

import { Experience } from "@/components/Experience";
import { UI } from "@/components/UI";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { useChat } from "@/hooks/useChat";
import { useState } from "react";

export default function Home() {
  const { input, setInput, sendMessage, loading, isSpeaking, messages, audioRef } = useChat({
    onSpeechEnd: () => {
      console.log("Speech ended callback triggered");
    }
  });
  const [showLanding, setShowLanding] = useState(true);

  const startConversation = () => {
    setShowLanding(false);
  };

  const goBackToLanding = () => {
    setShowLanding(true);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <audio ref={audioRef} className="hidden" playsInline />
      <Header showLanding={showLanding} onStart={startConversation} onBack={goBackToLanding} />
      
      {showLanding ? (
        <LandingHero onStart={startConversation} />
      ) : (
      <UI 
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        isSpeaking={isSpeaking}
        messages={messages}
        onSpeechEnd={() => console.log("Speech ended in UI")}
      />
      )}
      
      <Experience audioRef={audioRef} showLanding={showLanding} />
    </main>
  );
}
