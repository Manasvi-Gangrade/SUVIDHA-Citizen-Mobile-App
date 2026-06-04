import { Bell, User, Volume2, VolumeX, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTTS } from "@/contexts/LanguageContext";
import { GoogleTranslateWidget } from "@/contexts/LanguageContext";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export default function TopAppBar({ title, className }: TopAppBarProps) {
  const [, setLocation] = useLocation();
  const { ttsEnabled, setTtsEnabled, supported } = useTTS();

  return (
    <header className={cn("h-16 px-4 flex items-center justify-between bg-suvidha-navy text-white z-40 sticky top-0 shrink-0", className)}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-heading font-bold text-white tracking-tighter shrink-0">
          S
        </div>
        {title ? (
          <h1 className="font-heading font-semibold text-base truncate">{title}</h1>
        ) : (
          <span className="font-heading font-bold text-base tracking-tight">SUVIDHA</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Google Translate widget */}
        <div className="scale-90 origin-right opacity-90">
          <GoogleTranslateWidget />
        </div>

        {/* TTS toggle */}
        {supported && (
          <button
            aria-label={ttsEnabled ? "Disable voice assistance" : "Enable voice assistance"}
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            data-testid="button-tts-toggle"
          >
            {ttsEnabled
              ? <Volume2 className="w-4 h-4 text-suvidha-saffron" />
              : <VolumeX className="w-4 h-4 text-white/50" />
            }
          </button>
        )}

        <button
          aria-label="Notifications"
          className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5 text-white/90" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-suvidha-saffron border border-suvidha-navy" />
        </button>

        <button
          aria-label="View my profile"
          onClick={() => setLocation("/profile")}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 hover:bg-white/30 transition-colors"
          data-testid="button-profile"
        >
          <User className="w-5 h-5 text-white/90" />
        </button>
      </div>
    </header>
  );
}
