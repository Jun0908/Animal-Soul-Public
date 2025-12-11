"use client";

import { useState, FormEvent } from "react";

type VoiceType = "dog" | "parrot";

interface HistoryItem {
  id: string;
  voiceType: VoiceType;
  text: string;
  audioUrl?: string;
  transcript?: string;
  createdAt: string;
}

export default function Home() {
  const [voiceType, setVoiceType] = useState<VoiceType>("dog");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, voiceType }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Error from /api/speak:", data);
        alert(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const data = (await res.json()) as {
        audioUrl: string;
        transcript?: string;
        voiceType?: VoiceType;
      };

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        voiceType: data.voiceType ?? voiceType,
        text: inputText,
        audioUrl: data.audioUrl,
        transcript: data.transcript ?? inputText,
        createdAt: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newItem, ...prev]);
      setInputText("");
    } catch (error) {
      console.error("Error generating voice:", error);
      alert("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertExample = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 p-4 md:p-8 font-sans">
      <main className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Animal Voice Agent
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
              Hackathon Prototype
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Talk to playful AI agents with dog and parrot voices.
          </p>
        </header>

        {/* Voice Selection Panel */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setVoiceType("dog")}
            className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
              voiceType === "dog"
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-500 shadow-lg scale-[1.02]"
                : "border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            <div className="text-4xl mb-3">🐶</div>
            <h3 className="text-xl font-bold mb-2">Dog Voice Agent</h3>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
              <li>Playful, friendly</li>
              <li>Safety tips</li>
              <li>Loyal companion</li>
            </ul>
          </button>

          <button
            onClick={() => setVoiceType("parrot")}
            className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
              voiceType === "parrot"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500 shadow-lg scale-[1.02]"
                : "border-zinc-200 dark:border-zinc-800 hover:border-green-300 dark:hover:border-green-700 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            <div className="text-4xl mb-3">🦜</div>
            <h3 className="text-xl font-bold mb-2">Parrot Voice Agent</h3>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
              <li>Chirpy, curious</li>
              <li>Guide-like</li>
              <li>Repeats fun facts</li>
            </ul>
          </button>
        </section>

        {/* Input & Controls */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <textarea
              className="w-full min-h-[120px] p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg placeholder:text-zinc-400"
              placeholder={`Ask the ${voiceType} anything in English...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleInsertExample("Tell me a fun fact about space.")
                  }
                  className="text-sm text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Example 1
                </button>
                <span className="text-zinc-300">|</span>
                <button
                  type="button"
                  onClick={() => handleInsertExample("Who's a good boy?")}
                  className="text-sm text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Example 2
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Voice"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Output Area */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            History
          </h2>

          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-600 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                No history yet. Start by generating a voice!
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  {/* Header of card */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {item.voiceType === "dog" ? "🐶" : "🦜"}
                        </span>
                        <span className="font-bold text-lg capitalize">
                          {item.voiceType} Agent
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 ml-9">
                        {item.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* User Input */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl text-zinc-700 dark:text-zinc-300 italic border-l-4 border-zinc-300 dark:border-zinc-600">
                    "{item.text}"
                  </div>

                  {/* Audio & Transcript */}
                  <div className="space-y-3 pt-2">
                    {item.audioUrl && (
                      <audio
                        controls
                        className="w-full h-10"
                        src={item.audioUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {item.transcript && (
                      <div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                          Transcript
                        </span>
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                          {item.transcript}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Future Vision */}
        <footer className="pt-12 pb-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center md:text-left space-y-4 max-w-lg">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-sm">
              Future Vision
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Future: speaking with real animals (birds, dolphins, etc.) using
              bioacoustics and AI.
            </p>
            <ul className="text-sm text-zinc-500 dark:text-zinc-500 list-disc list-inside space-y-1">
              <li>Integrate real-time bioacoustic analysis</li>
              <li>Expand to more species</li>
              <li>Mobile app for field usage</li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
}

