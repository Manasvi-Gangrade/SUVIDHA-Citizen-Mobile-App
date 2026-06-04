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
    /*
     * Outer canvas: neutral gray on desktop, transparent on actual mobile.
     * On very small screens (< 430px wide) we just fill the viewport
     * so it looks like a real native app rather than a phone-in-phone.
     */
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center
                    bg-transparent sm:bg-gray-200/80 sm:p-4 lg:p-8">

      {/*
       * Phone shell
       * – Full-screen on xs (actual phones)
       * – 390×844 px phone frame on sm+ (desktop/tablet preview)
       */}
      <div
        className="
          relative flex flex-col bg-background overflow-hidden
          /* xs – fill viewport, no decorative chrome */
          w-full h-[100dvh]
          /* sm+ – styled phone frame */
          sm:w-[390px] sm:h-[844px] sm:rounded-[40px]
          sm:shadow-[0_32px_80px_rgba(0,0,0,0.35),0_0_0_8px_#1a1a1a,0_0_0_10px_#2d2d2d]
          sm:border-0
        "
      >
        {/* Notch / status bar — hidden on xs, visible on sm+ */}
        <div className="hidden sm:block shrink-0">
          <StatusBar />
        </div>

        {/* Dynamic Island notch pill (decorative, sm+) */}
        <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 pointer-events-none" />

        {/* Main content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto relative bg-white">
          {children}
        </div>

        {/* Bottom nav */}
        {!hideNav && <BottomNav />}

        {/* Bottom home indicator pill (sm+) */}
        {!hideNav && (
          <div className="hidden sm:flex shrink-0 h-5 bg-white items-center justify-center">
            <div className="w-28 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
