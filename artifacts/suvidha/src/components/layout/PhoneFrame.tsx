import { ReactNode } from "react";
import StatusBar from "./StatusBar";
import { useLocation } from "wouter";
import BottomNav from "./BottomNav";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [location] = useLocation();
  const hideNav = ["/", "/onboarding", "/login"].includes(location);

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center
                    bg-transparent sm:bg-gray-200/80 sm:p-4 lg:p-8">
      {/*
       * Phone shell.
       * IMPORTANT: `will-change: transform` (Tailwind: will-change-transform) creates a new
       * containing block for `position: fixed` descendants, trapping FABs and overlays
       * inside the phone frame instead of escaping to the viewport.
       * Also `overflow-hidden` clips them visually.
       */}
      <div
        className="
          relative flex flex-col bg-background overflow-hidden
          will-change-transform
          w-full h-[100dvh]
          sm:w-[390px] sm:h-[844px] sm:rounded-[40px]
          sm:shadow-[0_32px_80px_rgba(0,0,0,0.35),0_0_0_8px_#1a1a1a,0_0_0_10px_#2d2d2d]
        "
      >
        {/* Status bar — only on desktop frame */}
        <div className="hidden sm:block shrink-0">
          <StatusBar />
        </div>

        {/* Dynamic Island notch pill (desktop only) */}
        <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 pointer-events-none" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto relative">
          {children}
        </div>

        {/* Bottom nav */}
        {!hideNav && <BottomNav />}

        {/* Home indicator (desktop only) */}
        {!hideNav && (
          <div className="hidden sm:flex shrink-0 h-5 bg-white items-center justify-center">
            <div className="w-28 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
