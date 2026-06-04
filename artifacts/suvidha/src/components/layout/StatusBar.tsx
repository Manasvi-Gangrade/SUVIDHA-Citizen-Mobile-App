import { Battery, Wifi, Signal } from "lucide-react";

export default function StatusBar() {
  return (
    <div className="h-12 w-full flex items-center justify-between px-6 pt-2 bg-transparent absolute top-0 z-50 pointer-events-none">
      <div className="text-[15px] font-medium tracking-tight text-foreground/90">
        12:00
      </div>
      <div className="flex items-center gap-1.5 text-foreground/90">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-[18px] h-[18px]" />
      </div>
    </div>
  );
}