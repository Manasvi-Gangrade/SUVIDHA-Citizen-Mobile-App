import { useLocation, Link } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import ChatBot from "@/components/ChatBot";
import {
  FileWarning, Zap, FileText, Search,
  BellRing, ChevronRight, Plus, Flame, Building2,
  TrendingUp, Clock, CheckCircle2
} from "lucide-react";

const ALERTS = [
  "Ward 5: Water supply disruption from 2 PM – 5 PM today",
  "Sector 12: Scheduled power outage on Jun 6 for maintenance",
  "Gas pipeline inspection in Zone 3 – Jun 7",
];

/* Each action: label, icon, muted accent color (border + icon bg + icon color) */
const QUICK_ACTIONS = [
  { icon: FileWarning, label: "New Grievance",  sub: "File a complaint",    border: "border-l-red-400",    iconBg: "bg-red-50",    iconColor: "text-red-500",    route: "/grievance/new" },
  { icon: Zap,         label: "Electricity",    sub: "Services & requests", border: "border-l-amber-400",  iconBg: "bg-amber-50",  iconColor: "text-amber-600",  route: "/services/electricity" },
  { icon: Flame,       label: "Gas Services",   sub: "Connection & more",   border: "border-l-orange-400", iconBg: "bg-orange-50", iconColor: "text-orange-600", route: "/services/gas" },
  { icon: Building2,   label: "Municipal",      sub: "Water, roads & more", border: "border-l-teal-500",   iconBg: "bg-teal-50",   iconColor: "text-teal-600",   route: "/services/municipal" },
  { icon: Search,      label: "Track Request",  sub: "Check status",        border: "border-l-violet-400", iconBg: "bg-violet-50", iconColor: "text-violet-600", route: "/track" },
  { icon: FileText,    label: "My Tickets",     sub: "View all activity",   border: "border-l-blue-400",   iconBg: "bg-blue-50",   iconColor: "text-blue-600",   route: "/tickets" },
];

const DEPTS = [
  { label: "Electricity Services",   icon: Zap,       bar: "bg-amber-400", iconBg: "bg-amber-50",   iconColor: "text-amber-600",  route: "/services/electricity" },
  { label: "Piped Gas Services",     icon: Flame,     bar: "bg-red-400",   iconBg: "bg-red-50",     iconColor: "text-red-500",    route: "/services/gas" },
  { label: "Municipal Corporation",  icon: Building2, bar: "bg-teal-500",  iconBg: "bg-teal-50",    iconColor: "text-teal-600",   route: "/services/municipal" },
];

const RECENT = [
  { title: "Streetlight repair pending",  id: "SVD-8892", dept: "Municipal",   ago: "2 days ago",  status: "Assigned",     dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700"   },
  { title: "Gas Subsidy Renewal",         id: "SVD-8100", dept: "Gas",         ago: "5 days ago",  status: "Resolved",     dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  { title: "New Electricity Connection",  id: "SVD-8845", dept: "Electricity", ago: "1 week ago",  status: "Under Review", dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700"     },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 pb-6">
        <TopAppBar />

        {/* Hero */}
        <div className="relative bg-suvidha-navy px-5 pt-5 pb-7 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-44 h-44 bg-suvidha-teal/15 rounded-full blur-[48px] pointer-events-none" />
          <p className="text-white/60 text-sm mb-0.5 relative z-10">{greeting},</p>
          <h1 className="text-xl font-heading font-bold text-white mb-5 relative z-10">Rohan Sharma</h1>

          <div className="grid grid-cols-3 gap-2 relative z-10">
            {[
              { label: "Active",   value: "2",  icon: Clock,         color: "text-amber-300",   bg: "bg-white/10" },
              { label: "Resolved", value: "14", icon: CheckCircle2,  color: "text-emerald-300", bg: "bg-white/10" },
              { label: "Pending",  value: "1",  icon: TrendingUp,    color: "text-blue-300",    bg: "bg-white/10" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`${s.bg} border border-white/10 rounded-xl p-2.5 flex flex-col gap-1`}>
                  <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-white/55 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert ticker */}
        <div className="mx-4 mt-[-12px] relative z-10 bg-white rounded-xl shadow-sm border border-red-100 flex items-center gap-2.5 px-3 py-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <BellRing className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-gray-700 whitespace-nowrap animate-marquee">
              {ALERTS.join("  •  ")}
            </p>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-5">

          {/* Quick Actions — 2-col, white cards with colored left border */}
          <section>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => setLocation(a.route)}
                    className={`bg-white rounded-xl border border-gray-100 border-l-4 ${a.border}
                               shadow-sm px-3.5 py-3 flex items-center gap-3
                               active:scale-[0.97] hover:shadow-md transition-all text-left`}
                    data-testid={`card-action-${a.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.iconBg}`}>
                      <Icon className={`w-4.5 h-4.5 ${a.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[13px] text-gray-800 leading-tight truncate">{a.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{a.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Department Services */}
          <section>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Department Services</h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {DEPTS.map(d => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.label}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    onClick={() => setLocation(d.route)}
                    data-testid={`card-dept-${d.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className={`w-1 h-7 rounded-full shrink-0 ${d.bar}`} />
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${d.iconBg}`}>
                      <Icon className={`w-4 h-4 ${d.iconColor}`} />
                    </div>
                    <span className="flex-1 font-semibold text-sm text-gray-800">{d.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
              <Link href="/tickets" className="text-xs font-bold text-suvidha-navy">View All →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {RECENT.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${t.dot} mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13px] text-gray-800 truncate">{t.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.id} · {t.dept} · {t.ago}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${t.badge}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FAB */}
        <button
          onClick={() => setLocation("/grievance/new")}
          className="fixed z-40 flex items-center justify-center rounded-full
                     bg-suvidha-saffron hover:bg-suvidha-saffron/90 active:scale-95
                     shadow-[0_4px_16px_rgba(255,128,0,0.35)] text-white transition-all"
          style={{ bottom: 80, right: 16, width: 50, height: 50 }}
          aria-label="File new grievance"
          data-testid="button-fab-grievance"
        >
          <Plus className="w-5 h-5" />
        </button>

        <ChatBot />
      </div>
    </PageTransition>
  );
}
