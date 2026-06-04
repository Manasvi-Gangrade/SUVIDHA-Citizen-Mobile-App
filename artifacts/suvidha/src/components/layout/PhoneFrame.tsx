import { ReactNode } from "react";
import { useLocation } from "wouter";
import BottomNav from "./BottomNav";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * No phone-chrome simulation — this is a real mobile web app.
 * `will-change-transform` creates a new containing block so that
 * `position:fixed` children (FAB, ChatBot sheet, BottomNav) are
 * confined to this container instead of the viewport.
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
