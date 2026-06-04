import { Link, useLocation } from "wouter";
import { Home, FileText, Lock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/tickets", icon: FileText, label: "Tickets" },
    { href: "/locker", icon: Lock, label: "Locker" },
    { href: "/faq", icon: HelpCircle, label: "FAQ" },
  ];

  return (
    <div className="h-[84px] bg-white border-t border-border flex items-center justify-around px-2 pb-6 z-40">
      {navItems.map((item) => {
        const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href}>
            <div
              className="flex flex-col items-center justify-center w-16 h-12 gap-1 cursor-pointer relative"
              aria-label={item.label}
            >
              {isActive && (
                <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-suvidha-saffron" />
              )}
              <Icon
                className={cn(
                  "w-6 h-6 transition-colors duration-200",
                  isActive ? "text-suvidha-navy" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-suvidha-navy" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}