import { Bell, User, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTTS, GoogleTranslateWidget } from "@/contexts/LanguageContext";

interface TopAppBarProps {
  title?: string;
  className?: string;
}

export default function TopAppBar({ title, className }: TopAppBarProps) {
  const [, setLocation] = useLocation();
  const { ttsEnabled, setTtsEnabled, supported } = useTTS();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 shrink-0 bg-suvidha-navy text-white",
        className
      )}
    >
      {/* Main bar */}
      <div className="h-14 px-4 flex items-center justify-between gap-2">
        {/* Logo + title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center font-heading font-bold text-white text-sm shrink-0">
            S
          </div>
          {title ? (
            <h1 className="font-heading font-semibold text-[15px] truncate">{title}</h1>
          ) : (
            <span className="font-heading font-bold text-[15px] tracking-tight">SUVIDHA</span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* TTS */}
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
      </div>

      {/* Language bar — always visible below main bar */}
      <div className="px-4 pb-2 flex items-center gap-2 border-t border-white/10">
        <span className="text-white/50 text-[10px] font-semibold uppercase tracking-widest shrink-0">
          🌐 Language:
        </span>
        {/* GoogleTranslateWidget is ALWAYS mounted so the script only inits once */}
        <div className="flex-1">
          <GoogleTranslateWidget />
        </div>
      </div>
    </header>
  );
}
