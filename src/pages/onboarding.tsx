import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Zap, Flame, Building2, ChevronRight, Search, ShieldCheck, Bell, MapPin } from "lucide-react";

const DEPARTMENTS = [
  {
    id: "electricity",
    name: "Electricity",
    desc: "Bill disputes, connections, outage reports",
    icon: Zap,
    color: "text-suvidha-saffron",
    bg: "bg-suvidha-saffron/10",
    border: "border-suvidha-saffron/30",
    dot: "bg-suvidha-saffron",
  },
  {
    id: "gas",
    name: "Piped Gas",
    desc: "New connection, leakage reports, KYC",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
  {
    id: "municipal",
    name: "Municipal",
    desc: "Water supply, sanitation, civic services",
    icon: Building2,
    color: "text-suvidha-teal",
    bg: "bg-suvidha-teal/10",
    border: "border-suvidha-teal/30",
    dot: "bg-suvidha-teal",
  },
];

const FEATURES = [
  { icon: ShieldCheck, label: "Secure OTP Login", desc: "Aadhaar-linked verification" },
  { icon: Bell, label: "Live Alerts", desc: "Outages, maintenance & civic news" },
  { icon: MapPin, label: "Track Requests", desc: "Real-time complaint status" },
  { icon: Search, label: "Find Services", desc: "Electricity, Gas & Municipal" },
];

/* Spinning mini chakra used in the badge */
function MiniChakra() {
  return (
    <motion.svg
      viewBox="0 0 32 32"
      className="w-5 h-5"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="16" cy="16" r="11" fill="none" stroke="#162D5A" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2.5" fill="#162D5A" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={16 + 3 * Math.cos(a)} y1={16 + 3 * Math.sin(a)}
            x2={16 + 10 * Math.cos(a)} y2={16 + 10 * Math.sin(a)}
            stroke={i % 3 === 0 ? "#FF8000" : "#162D5A"}
            strokeWidth={i % 3 === 0 ? "1.2" : "0.6"}
          />
        );
      })}
    </motion.svg>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("suvidha_user");
    if (user) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative bg-suvidha-navy overflow-hidden px-5 pt-10 pb-8 shrink-0">
        {/* Aurora blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-suvidha-teal/20 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-suvidha-saffron/15 rounded-full blur-[50px] pointer-events-none" />

        {/* Gov badge — no opacity animation so it's always visible */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
            <MiniChakra />
          </div>
          <div>
            <p className="text-white/50 text-[10px] tracking-widest uppercase leading-none">Government of Assam</p>
            <p className="text-white font-heading font-bold text-sm leading-tight">SUVIDHA Portal</p>
          </div>
        </div>

        {/* Hero headline — slides in from below, starts visible */}
        <motion.div
          initial={{ y: 12, opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="text-[28px] font-heading font-bold text-white leading-tight mb-2">
            Your City,<br />
            <span className="text-suvidha-saffron">Your Services.</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            One app for all civic utility services — file complaints, track requests, and manage connections.
          </p>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ y: 8, opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="flex gap-3 mt-5"
        >
          <button
            onClick={() => setLocation("/login")}
            className="flex-1 h-12 bg-suvidha-saffron text-white font-heading font-bold rounded-xl text-sm
                       shadow-[0_4px_16px_rgba(255,128,0,0.4)] hover:bg-suvidha-saffron/90 active:scale-95 transition-all"
          >
            Get Started
          </button>
          <button
            onClick={() => setLocation("/track")}
            className="flex-1 h-12 bg-white/10 border border-white/20 text-white font-semibold rounded-xl text-sm
                       hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Track
          </button>
        </motion.div>
      </div>

      {/* ── Department cards ─────────────────────────────── */}
      <div className="px-5 pt-5 pb-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Available Departments
        </p>
        <div className="flex flex-col gap-2.5">
          {DEPARTMENTS.map((dept, i) => {
            const Icon = dept.icon;
            return (
              <motion.button
                key={dept.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                onClick={() => setLocation(`/login?dept=${dept.id}`)}
                className={`flex items-center gap-4 p-3.5 bg-white rounded-2xl border ${dept.border}
                            shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left w-full`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dept.bg}`}>
                  <Icon className={`w-5 h-5 ${dept.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-bold text-sm text-foreground">{dept.name}</p>
                    <div className={`w-1.5 h-1.5 rounded-full ${dept.dot} animate-pulse`} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{dept.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Feature grid ─────────────────────────────────── */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          What you can do
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                className="bg-suvidha-bg rounded-2xl p-3.5 border border-border"
              >
                <div className="w-8 h-8 bg-suvidha-navy/10 rounded-xl flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-suvidha-navy" />
                </div>
                <p className="font-semibold text-xs text-foreground leading-tight">{f.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-border" />
          <p className="text-[9px] text-muted-foreground tracking-widest uppercase whitespace-nowrap">Secure & Accessible</p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setLocation("/admin/login")}
            className="text-xs text-muted-foreground hover:text-suvidha-navy font-medium transition-colors"
          >
            Admin Portal
          </button>
          <span className="text-border">•</span>
          <button
            onClick={() => setLocation("/faq")}
            className="text-xs text-muted-foreground hover:text-suvidha-navy font-medium transition-colors"
          >
            Help & FAQ
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground/50 text-center">
          SUVIDHA v2.0 • Smart Urban Digital Helpdesk Assistant
        </p>
      </div>
    </div>
  );
}
