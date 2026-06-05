import { ReactNode } from "react";
import { useLocation } from "wouter";
import BottomNav from "./BottomNav";
import { cn } from "@/lib/utils";
import { useTTS, GoogleTranslateWidget } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  ChevronLeft, User, Volume2,
  VolumeX, Wifi, WifiOff
} from "lucide-react";

interface PhoneFrameProps {
  children: ReactNode;
}

interface PageMeta {
  title: string;
  subtitle: string;
  emoji: string;
}

const getPageMeta = (loc: string): PageMeta => {
  if (loc.startsWith("/services/electricity")) return { title: "Electricity Services", subtitle: "Power & connection requests", emoji: "⚡" };
  if (loc.startsWith("/services/gas"))         return { title: "Piped Gas Services",   subtitle: "Gas connection & complaints",  emoji: "🔥" };
  if (loc.startsWith("/services/municipal"))   return { title: "Municipal Services",   subtitle: "Water, roads & civic works",   emoji: "🏛️" };
  if (loc.startsWith("/service-form/"))        return { title: "Service Application",  subtitle: "Fill & submit your request",   emoji: "📋" };
  if (loc === "/queue")                        return { title: "Digital Queue Token",  subtitle: "Reserve your kiosk slot",      emoji: "🎫" };
  if (loc === "/track")                        return { title: "Track Request",        subtitle: "Live status of your tickets",  emoji: "📍" };
  if (loc === "/locker")                       return { title: "DigiLocker Wallet",    subtitle: "Your verified documents",      emoji: "🔐" };
  if (loc === "/faq")                          return { title: "Help & FAQs",          subtitle: "Guides & support resources",   emoji: "💬" };
  if (loc === "/locator")                      return { title: "Kiosk Locator",        subtitle: "Find nearby service centres",  emoji: "🗺️" };
  if (loc === "/profile")                      return { title: "Account Profile",      subtitle: "Manage your account",          emoji: "👤" };
  if (loc === "/grievance/new")                return { title: "File Grievance",       subtitle: "Report a civic issue",         emoji: "📢" };
  return                                              { title: "SUVIDHA Portal",       subtitle: "Citizen Services Platform",    emoji: "🏛️" };
};

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [location, setLocation] = useLocation();
  const { ttsEnabled, setTtsEnabled, supported } = useTTS();
  const { isOffline, setIsOffline } = useAccessibility();

  const hideNav = ["/", "/onboarding", "/login"].includes(location);
  const isHome  = location === "/dashboard";
  const meta    = getPageMeta(location);

  return (
    <div
      className="
        relative mx-auto bg-gray-50 flex flex-col h-[100dvh] overflow-hidden
        w-full max-w-[430px] shadow-[0_0_50px_rgba(0,0,0,0.1)]
      "
    >
      {/* ── Unified Non-Movable Header ── */}
      {!hideNav && (
        <header className="bg-suvidha-navy flex flex-col shrink-0 z-40 shadow-lg">

          {/* Top utility row */}
          <div className="h-[56px] px-4 flex items-center justify-between gap-2">

            {/* Left: back button (non-home) or logo text (home) */}
            <div className="flex items-center gap-2.5">
              {isHome ? (
                <>
                  {/* Ashoka Chakra emblem */}
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                    <svg viewBox="0 0 32 32" className="w-6 h-6">
                      <circle cx="16" cy="16" r="11" fill="none" stroke="white" strokeWidth="1.5" />
                      <circle cx="16" cy="16" r="2.5"  fill="white" />
                      {Array.from({ length: 12 }).map((_, i) => {
                        const a = (i * 30 * Math.PI) / 180;
                        return (
                          <line
                            key={i}
                            x1={16 + 3  * Math.cos(a)} y1={16 + 3  * Math.sin(a)}
                            x2={16 + 10 * Math.cos(a)} y2={16 + 10 * Math.sin(a)}
                            stroke={i % 3 === 0 ? "#FF8000" : "white"}
                            strokeWidth={i % 3 === 0 ? "1.5" : "0.7"}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex flex-col -space-y-0.5">
                    <span className="font-heading font-black text-white text-[18px] tracking-tight leading-none">SUVIDHA</span>
                    <span className="text-white/55 text-[9px] font-semibold uppercase tracking-[0.18em]">Citizen Portal</span>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => window.history.back()}
                  className="w-9 h-9 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center text-white active:scale-95 hover:bg-white/20 transition-all shrink-0"
                  title="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right: global utility buttons */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">

              {/* Google Translate */}
              <GoogleTranslateWidget />

              {/* Offline switcher */}
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={cn(
                  "w-8.5 h-8.5 rounded-xl border flex items-center justify-center transition-all active:scale-95",
                  isOffline
                    ? "bg-amber-400/20 border-amber-300/40 text-amber-300"
                    : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
                )}
                title={isOffline ? "Offline Sim Active" : "Simulate Offline"}
              >
                {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              </button>

              {/* TTS toggler */}
              {supported && (
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={cn(
                    "w-8.5 h-8.5 rounded-xl border flex items-center justify-center transition-all active:scale-95",
                    ttsEnabled
                      ? "bg-suvidha-saffron/20 border-suvidha-saffron/40 text-suvidha-saffron"
                      : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
                  )}
                  title={ttsEnabled ? "TTS Voice Active" : "Enable TTS Voice"}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}

              {/* Profile avatar */}
              {location !== "/profile" && (
                <button
                  onClick={() => setLocation("/profile")}
                  className="relative w-8.5 h-8.5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white active:scale-95 hover:bg-white/30 transition-all"
                  title="My Profile"
                >
                  <User className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-suvidha-saffron rounded-full border-2 border-suvidha-navy" />
                </button>
              )}

            </div>
          </div>

          {/* ── Page title strip (only on non-home pages) ── */}
          {!isHome && (
            <div className="px-4 pt-1 pb-3.5 flex items-center gap-3 border-t border-white/8">
              {/* Emoji badge */}
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xl shrink-0 shadow-inner">
                {meta.emoji}
              </div>
              {/* Title + subtitle */}
              <div className="flex flex-col min-w-0">
                <h1 className="font-heading font-black text-white text-[17px] tracking-tight leading-tight truncate">
                  {meta.title}
                </h1>
                <p className="text-white/55 text-[10px] font-semibold truncate mt-0.5">
                  {meta.subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Offline warning banner */}
          {isOffline && (
            <div className="bg-amber-500 text-white text-[9px] font-bold py-1 text-center tracking-wide flex items-center justify-center gap-1.5">
              <WifiOff className="w-3 h-3" />
              <span>OFFLINE SIMULATOR MODE ACTIVE</span>
            </div>
          )}

        </header>
      )}

      {/* Page content */}
      <div className={cn("flex-1 overflow-y-auto", hideNav ? "h-full" : "pb-[68px]")}>
        {children}
      </div>

      {/* Bottom nav */}
      {!hideNav && <BottomNav />}
    </div>
  );
}