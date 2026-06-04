import { Bell, User, Volume2, VolumeX, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTTS } from "@/contexts/LanguageContext";
import { GoogleTranslateWidget } from "@/contexts/LanguageContext";
import { useState } from "react";

interface TopAppBarProps {
  title?: string;
  className?: string;
}

export default function TopAppBar({ title, className }: TopAppBarProps) {
  const [, setLocation] = useLocation();
  const { ttsEnabled, setTtsEnabled, supported } = useTTS();
  const [showLang, setShowLang] = useState(false);

  return (
    <>
      <header className={cn(
        "h-14 px-4 flex items-center justify-between bg-suvidha-navy text-white z-40 sticky top-0 shrink-0",
        className
      )}>
        {/* Left: logo + title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center font-heading font-bold text-white text-sm shrink-0">
            S
          </div>
          {title ? (
            <h1 className="font-heading font-semibold text-base truncate">{title}</h1>
          ) : (
            <span className="font-heading font-bold text-base tracking-tight">SUVIDHA</span>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Language toggle button */}
          <button
            onClick={() => setShowLang(v => !v)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              showLang
                ? "bg-suvidha-saffron text-white"
                : "bg-white/15 text-white hover:bg-white/20"
            )}
            aria-label="Change language"
            data-testid="button-language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Language</span>
          </button>

          {/* TTS toggle */}
          {supported && (
            <button
              aria-label={ttsEnabled ? "Disable voice" : "Enable voice"}
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              data-testid="button-tts-toggle"
            >
              {ttsEnabled
                ? <Volume2 className="w-4 h-4 text-suvidha-saffron" />
                : <VolumeX className="w-4 h-4 text-white/50" />
              }
            </button>
          )}

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-4 h-4 text-white/90" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-suvidha-saffron border border-suvidha-navy" />
          </button>

          {/* Profile */}
          <button
            aria-label="View my profile"
            onClick={() => setLocation("/profile")}
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors ml-0.5"
            data-testid="button-profile"
          >
            <User className="w-4 h-4 text-white/90" />
          </button>
        </div>
      </header>

      {/* Language panel — drops below the header */}
      {showLang && (
        <div className="sticky top-14 z-30 bg-suvidha-navy/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center gap-3">
          <Globe className="w-4 h-4 text-suvidha-saffron shrink-0" />
          <p className="text-white text-xs font-semibold whitespace-nowrap">Translate page:</p>
          <div className="flex-1">
            {/* Actual Google Translate widget — styled via index.css */}
            <GoogleTranslateWidget />
          </div>
          <button
            onClick={() => setShowLang(false)}
            className="text-white/50 hover:text-white text-xs px-2 py-1 rounded transition-colors shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
