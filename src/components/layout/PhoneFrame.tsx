import { ReactNode } from "react";
import { useLocation } from 'wouter';
import BottomNav from "./BottomNav";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Centered responsive smartphone simulator frame with slate-950 backdrop.
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [location] = useLocation();
  const hideNav = ["/", "/onboarding", "/login"].includes(location);

  return (
    <div
      className="
        relative mx-auto bg-gray-50 overflow-x-hidden
        will-change-transform
        w-full max-w-[430px]
        min-h-[100dvh]
      "
    >
      <div className={hideNav ? "min-h-[100dvh]" : "pb-[68px]"}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}