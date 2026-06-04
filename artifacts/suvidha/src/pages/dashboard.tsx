import { useLocation, Link } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import ChatBot from "@/components/ChatBot";
import {
  FileWarning, Zap, FileText, Search,
  BellRing, ChevronRight, Plus, Flame, Building2, MapPin,
  TrendingUp, Clock, CheckCircle2
} from "lucide-react";

const ALERTS = [
  "Ward 5: Water supply disruption from 2 PM – 5 PM today",
  "Sector 12: Scheduled power outage on Jun 6 for maintenance",
  "Gas pipeline inspection in Zone 3 – Jun 7",
];

const QUICK_ACTIONS = [
  { icon: FileWarning, label: "New Grievance",  sub: "File a complaint",    grad: "from-red-500 to-rose-600",     shadow: "shadow-red-200" },
  { icon: Zap,         label: "Electricity",    sub: "Services & requests", grad: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
  { icon: Flame,       label: "Gas Services",   sub: "Connection & more",   grad: "from-orange-500 to-red-500",   shadow: "shadow-orange-200" },
  { icon: Building2,   label: "Municipal",      sub: "Water, roads & more", grad: "from-teal-500 to-cyan-600",    shadow: "shadow-teal-200" },
  { icon: Search,      label: "Track Request",  sub: "Check status",        grad: "from-violet-500 to-purple-600",shadow: "shadow-violet-200" },
  { icon: FileText,    label: "My Tickets",     sub: "View all activity",   grad: "from-blue-500 to-indigo-600",  shadow: "shadow-blue-200" },
];

const ROUTES: Record<string, string> = {
  "New Grievance": "/grievance/new",
  "Electricity":   "/services/electricity",
  "Gas Services":  "/services/gas",
  "Municipal":     "/services/municipal",
  "Track Request": "/track",
  "My Tickets":    "/tickets",
};

const RECENT = [
  { title: "Streetlight repair pending",    id: "SVD-8892", dept: "Municipal",    ago: "2 days ago",  status: "Assigned",     dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700" },
  { title: "Gas Subsidy Renewal",           id: "SVD-8100", dept: "Gas",          ago: "5 days ago",  status: "Resolved",     dot: "bg-emerald-500",badge: "bg-emerald-50 text-emerald-700" },
  { title: "New Electricity Connection",    id: "SVD-8845", dept: "Electricity",  ago: "1 week ago",  status: "Under Review", dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700" },
];

const DEPTS = [
  { label: "Electricity Services",   icon: Zap,       leftBar: "bg-amber-400",   iconBg: "bg-amber-50",   iconColor: "text-amber-500",  route: "/services/electricity" },
  { label: "Piped Gas Services",     icon: Flame,     leftBar: "bg-red-400",     iconBg: "bg-red-50",     iconColor: "text-red-500",    route: "/services/gas" },
  { label: "Municipal Corporation",  icon: Building2, leftBar: "bg-teal-400",    iconBg: "bg-teal-50",    iconColor: "text-teal-600",   route: "/services/municipal" },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 pb-6">
        <TopAppBar />

        {/* ── Hero ──────────────────────────────────── */}
        <div className="relative bg-suvidha-navy px-5 pt-5 pb-8 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-suvidha-teal/20 rounded-full blur-[50px]" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-suvidha-saffron/15 rounded-full blur-[40px]" />

          <p className="text-white/60 text-sm mb-0.5 relative z-10">{greeting},</p>
          <h1 className="text-2xl font-heading font-bold text-white mb-5 relative z-10">Rohan Sharma</h1>

          <div className="grid grid-cols-3 gap-2.5 relative z-10">
            <StatCard label="Active"   value="2"  icon={Clock}        bg="bg-amber-400/20"   val="text-amber-300" />
            <StatCard label="Resolved" value="14" icon={CheckCircle2} bg="bg-emerald-400/20" val="text-emerald-300" />
            <StatCard label="Pending"  value="1"  icon={TrendingUp}   bg="bg-blue-400/20"    val="text-blue-300" />
          </div>
        </div>

        {/* Alert ticker */}
        <div className="mx-4 mt-[-14px] relative z-10 bg-white rounded-2xl shadow-md border border-red-100 flex items-center gap-3 px-3 py-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <BellRing className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-foreground whitespace-nowrap animate-marquee">
              {ALERTS.join("  •  ")}
            </p>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-6">

          {/* Quick Actions */}
          <section>
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {QUICK_ACTIONS.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => setLocation(ROUTES[a.label])}
                    className={`bg-gradient-to-br ${a.grad} rounded-2xl p-3.5 flex flex-col items-start
                               shadow-md ${a.shadow} active:scale-95 transition-all text-left`}
                    data-testid={`card-action-${a.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-white font-bold text-[11px] leading-tight">{a.label}</span>
                    <span className="text-white/70 text-[9px] mt-0.5 leading-tight hidden sm:block">{a.sub}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Department Services */}
          <section>
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3">Department Services</h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {DEPTS.map(d => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.label}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    onClick={() => setLocation(d.route)}
                    data-testid={`card-dept-${d.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className={`w-1 h-8 rounded-full shrink-0 ${d.leftBar}`} />
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${d.iconBg}`}>
                      <Icon className={`w-4.5 h-4.5 ${d.iconColor}`} />
                    </div>
                    <span className="flex-1 font-semibold text-sm text-gray-800">{d.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Recent Activity</h3>
              <Link href="/tickets" className="text-xs font-bold text-suvidha-navy">View All →</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {RECENT.map(t => (
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{t.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.id} • {t.dept} • {t.ago}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${t.badge}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FAB — fixed, contained inside phone frame via will-change-transform */}
        <button
          onClick={() => setLocation("/grievance/new")}
          className="fixed bottom-[5.5rem] right-3 w-13 h-13 bg-gradient-to-br from-suvidha-saffron to-orange-600
                     rounded-full shadow-[0_6px_20px_rgba(255,128,0,0.45)] flex items-center justify-center
                     text-white z-40 hover:scale-105 active:scale-95 transition-transform"
          aria-label="File new grievance"
          data-testid="button-fab-grievance"
          style={{ width: 52, height: 52 }}
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* ChatBot */}
        <ChatBot />
      </div>
    </PageTransition>
  );
}

function StatCard({ label, value, icon: Icon, bg, val }: {
  label: string; value: string; icon: React.ElementType; bg: string; val: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-3 border border-white/10 flex flex-col gap-1`}>
      <Icon className={`w-4 h-4 ${val} mb-0.5`} />
      <div className={`text-xl font-bold ${val}`}>{value}</div>
      <div className="text-[10px] text-white/60 font-medium">{label}</div>
    </div>
  );
}
