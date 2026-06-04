import { Link, useLocation } from "wouter";
import { Home, FileText, Lock, HelpCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home,        label: "Home",    color: "text-suvidha-saffron" },
  { href: "/tickets",   icon: FileText,    label: "Tickets", color: "text-purple-500"      },
  { href: "/track",     icon: MapPin,      label: "Track",   color: "text-suvidha-teal"    },
  { href: "/locker",    icon: Lock,        label: "Locker",  color: "text-blue-500"        },
  { href: "/faq",       icon: HelpCircle,  label: "Help",    color: "text-pink-500"        },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="shrink-0 h-[68px] bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
                    flex items-center justify-around px-1 z-40">
      {NAV_ITEMS.map((item) => {
        const isActive = location === item.href ||
          (item.href !== "/dashboard" && location.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <div
              className="flex flex-col items-center justify-center gap-0.5 cursor-pointer
                         w-14 h-14 rounded-2xl transition-all duration-200 relative"
              aria-label={item.label}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {/* Active pill background */}
              {isActive && (
                <div className="absolute inset-x-1 inset-y-1.5 rounded-xl bg-suvidha-navy/8 transition-all" />
              )}

              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 relative z-10",
                isActive ? "scale-110" : "scale-100"
              )}>
                <Icon className={cn(
                  "w-[18px] h-[18px] transition-colors duration-200",
                  isActive ? item.color : "text-gray-400"
                )} />
              </div>

              <span className={cn(
                "text-[9px] font-bold tracking-wide transition-colors duration-200 relative z-10",
                isActive ? "text-suvidha-navy" : "text-gray-400"
              )}>
                {item.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <div className={cn("absolute -bottom-0.5 w-1 h-1 rounded-full", item.color.replace("text-", "bg-"))} />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
