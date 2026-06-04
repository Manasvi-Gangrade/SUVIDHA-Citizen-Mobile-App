import { Link, useLocation } from "wouter";
import { Home, FileText, Lock, HelpCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/tickets", icon: FileText, label: "Tickets" },
    { href: "/track", icon: MapPin, label: "Track" },
    { href: "/locker", icon: Lock, label: "Locker" },
    { href: "/faq", icon: HelpCircle, label: "Help" },
  ];

  return (
    <div className="h-[84px] bg-white border-t border-border flex items-center justify-around px-1 pb-5 z-40 shrink-0">
      {navItems.map((item) => {
        const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <div
              className="flex flex-col items-center justify-center w-14 h-12 gap-1 cursor-pointer relative"
              aria-label={item.label}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {isActive && (
                <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-suvidha-saffron" />
              )}
              <Icon className={cn("w-5 h-5 transition-colors duration-200", isActive ? "text-suvidha-navy" : "text-muted-foreground")} />
              <span className={cn("text-[9px] font-semibold transition-colors duration-200", isActive ? "text-suvidha-navy" : "text-muted-foreground")}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
