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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      {/* Phone container */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-background rounded-[40px] shadow-2xl overflow-hidden flex flex-col border-[8px] border-gray-900">
        <StatusBar />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto relative bg-suvidha-bg">
          {children}
        </div>

        {/* Bottom Nav */}
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}