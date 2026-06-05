import { Bell, User, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTTS, GoogleTranslateWidget } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface TopAppBarProps {
  title?: string;
  className?: string;
}

export default function TopAppBar({ title, className }: TopAppBarProps) {
  const [, setLocation] = useLocation();
  const { ttsEnabled, setTtsEnabled, supported } = useTTS();
  const { isOffline, setIsOffline } = useAccessibility();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 shrink-0 bg-suvidha-navy text-white transition-colors duration-300",
        isOffline && "bg-amber-800",
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
          <div className="flex flex-col min-w-0">
            {title ? (
              <h1 className="font-heading font-semibold text-[14px] leading-tight truncate">{title}</h1>
            ) : (
              <span className="font-heading font-bold text-[14px] tracking-tight">SUVIDHA</span>
            )}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isOffline ? "bg-amber-400 animate-pulse" : "bg-emerald-400")} />
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/75">
                {isOffline ? "Offline Sim Mode" : "Online"}
              </span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Offline Simulator Switcher */}
          <button
            aria-label={isOffline ? "Connect to online network" : "Simulate offline mode"}
            onClick={() => setIsOffline(!isOffline)}
            className={cn("p-1.5 rounded-lg transition-colors hover:bg-white/10",
              isOffline ? "text-amber-300" : "text-white/50"
            )}
            title={isOffline ? "Offline Sim Active" : "Simulate Offline"}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </button>

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

