import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  Clock,
  Settings,
  RotateCcw,
  Sparkles,
  Volume2,
  HelpCircle,
  ShieldCheck,
  Zap,
  GraduationCap,
} from "lucide-react";
import { CallMode, CustomerMood, OfferConfig } from "../types";

interface HeaderProps {
  config: OfferConfig;
  mood: CustomerMood;
  callMode: CallMode;
  onCallModeChange: (mode: CallMode) => void;
  onResetCall: () => void;
  onOpenAdmin: () => void;
  onOpenObjections: () => void;
  onOpenTrainingHelp: () => void;
  currentSayText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  mood,
  callMode,
  onCallModeChange,
  onResetCall,
  onOpenAdmin,
  onOpenObjections,
  onOpenTrainingHelp,
  currentSayText,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleTestVoice = () => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = currentSayText || "Hello, I'm calling regarding your telephone line services. How are you doing today?";
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = mood === "ELDERLY_SLOW" ? 0.85 : 0.95;
    utterance.pitch = 1.0;
    
    // Pick British English voice if available
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find((v) => v.lang.includes("en-GB") || v.lang.includes("en_GB"));
    if (ukVoice) utterance.voice = ukVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getMoodBadge = () => {
    switch (mood) {
      case "COMFORTABLE":
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">😊 Comfortable</span>;
      case "ELDERLY_SLOW":
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">🐢 Slower Pace</span>;
      case "CONFUSED":
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">❓ Confused</span>;
      case "SUSPICIOUS":
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">🛡️ Suspicious</span>;
      case "IMPATIENT":
        return <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">⏱️ Impatient</span>;
      case "TALKATIVE":
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium">💬 Talkative</span>;
      case "VULNERABILITY_CONCERN":
        return <span className="bg-red-500/25 text-red-300 border border-red-500/40 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-semibold animate-pulse">⚠️ Vulnerable / Alert</span>;
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5 sticky top-0 z-40 shadow-md">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sparta-500 to-indigo-600 flex items-center justify-between p-2 shadow-glow-primary">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-white">SPARTA</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-sparta-950 text-sparta-400 border border-sparta-800 font-mono">
                {config.scriptVersion}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline font-medium">LIVE CALL ASSISTANT</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                Active Call
              </span>
              <span>•</span>
              <span className="truncate max-w-[200px] text-slate-400">{config.campaignName}</span>
            </div>
          </div>
        </div>

        {/* Center: Call Timer & Mood & Cadence Preview */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-md">
            <Clock className="w-4 h-4 text-sparta-400" />
            <span className="font-mono text-sm tracking-widest text-sparta-300 font-bold">
              {formatTime(seconds)}
            </span>
            <button
              onClick={() => setIsActive(!isActive)}
              className="text-[10px] text-slate-400 hover:text-white underline ml-1"
              title="Pause or resume timer"
            >
              {isActive ? "Pause" : "Resume"}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Mood:</span>
            {getMoodBadge()}
          </div>

          <button
            onClick={handleTestVoice}
            className={`hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all ${
              isSpeaking
                ? "bg-sparta-600 text-white border-sparta-400 animate-pulse"
                : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
            title="Listen to calm British English pronunciation and speed cadence"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? "Speaking..." : "Listen Cadence"}</span>
          </button>
        </div>

        {/* Right: Mode Selector, Objections & Settings */}
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onCallModeChange("PRODUCTION")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                callMode === "PRODUCTION"
                  ? "bg-sparta-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Full balanced copilot view"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Production</span>
            </button>
            <button
              onClick={() => onCallModeChange("QUICK")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                callMode === "QUICK"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Minimalist view: Objective, Say, Next action"
            >
              <Zap className="w-3 h-3" />
              <span>Quick</span>
            </button>
            <button
              onClick={() => onCallModeChange("TRAINING")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                callMode === "TRAINING"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Deep training view with compliance tips & rationale"
            >
              <GraduationCap className="w-3 h-3" />
              <span className="hidden sm:inline">Training</span>
            </button>
          </div>

          <button
            onClick={onOpenObjections}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
            title="Open Objection Library (18+ UK responses)"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Objections</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Admin & Campaign Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onResetCall}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Reset and start new call"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
