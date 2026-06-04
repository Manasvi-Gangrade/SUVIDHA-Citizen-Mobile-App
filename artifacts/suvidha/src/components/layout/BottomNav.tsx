import { Link, useLocation } from "wouter";
import { Home, FileText, MapPin, Lock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home,        label: "Home"    },
  { href: "/tickets",   icon: FileText,    label: "Tickets" },
  { href: "/track",     icon: MapPin,      label: "Track"   },
  { href: "/locker",    icon: Lock,        label: "Locker"  },
  { href: "/faq",       icon: HelpCircle,  label: "Help"    },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    /* fixed + will-change-transform on PhoneFrame keeps this inside the container */
    <nav
      className="fixed bottom-0 left-0 right-0 z-40
                 bg-white border-t border-gray-200
                 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]
                 flex items-stretch h-[68px]"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          location === item.href ||
          (item.href !== "/dashboard" && location.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={cn(
                "flex flex-col items-center justify-center h-full gap-1 mx-1 my-1.5 rounded-xl transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-suvidha-navy"
                  : "hover:bg-gray-50 active:bg-gray-100"
              )}
              aria-label={item.label}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon
                className={cn(
                  "w-[18px] h-[18px] transition-colors duration-150",
                  isActive ? "text-white" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-bold transition-colors duration-150",
                  isActive ? "text-white" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
