"use client";

import { Experience } from "@/components/Experience";
import { UI } from "@/components/UI";
import { Header } from "@/components/Header";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { input, setInput, sendMessage, loading, isSpeaking, messages, audioRef } = useChat();

  return (
    <main className="h-screen w-screen bg-slate-900 relative overflow-hidden">
      <audio ref={audioRef} className="hidden" playsInline />
      <Header />
      <UI
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        isSpeaking={isSpeaking}
        messages={messages}
      />
      <Experience audioRef={audioRef} />
    </main>
  );
}
