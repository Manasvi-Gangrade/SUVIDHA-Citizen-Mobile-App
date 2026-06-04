import { Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export default function TopAppBar({ title, className }: TopAppBarProps) {
  return (
    <header className={cn("h-16 px-4 flex items-center justify-between bg-suvidha-navy text-white z-40 sticky top-0", className)}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-heading font-bold text-white tracking-tighter">
          S
        </div>
        {title && (
          <h1 className="font-heading font-semibold text-lg">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="relative p-1">
          <Bell className="w-5 h-5 text-white/90" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-suvidha-saffron border border-suvidha-navy"></span>
        </button>
        <button aria-label="Profile" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
          <User className="w-5 h-5 text-white/90" />
        </button>
      </div>
    </header>
  );
}