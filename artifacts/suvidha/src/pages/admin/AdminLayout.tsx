import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Menu, X, LayoutDashboard, FileText, Building2, Users, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const NAV_ITEMS = [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Complaints", path: "/admin/complaints", icon: FileText },
    { label: "Departments", path: "/admin/departments", icon: Building2 },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Analytics", path: "/admin/analytics", icon: Activity },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-suvidha-bg w-full">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-suvidha-navy text-white transition-transform duration-300 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-6 font-heading font-bold text-xl border-b border-white/10 shrink-0">
          SUVIDHA Admin
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                  isActive 
                    ? "bg-white/10 text-suvidha-saffron border-l-4 border-suvidha-saffron" 
                    : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white font-medium text-sm">
            <X className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-1 bg-suvidha-navy/10 text-suvidha-navy text-xs font-bold rounded-md">Admin Panel</span>
              <span className="text-sm font-medium text-muted-foreground">Welcome back, Administrator</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-suvidha-navy flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
              <span className="text-sm font-semibold hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}