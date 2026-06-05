import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import PageTransition from "@/components/PageTransition";
import ChatBot from "@/components/ChatBot";
import { GoogleTranslateWidget } from "@/components/StandaloneTranslateTTS";
import {
  FileWarning, Zap, FileText, Search,
  BellRing, Plus, Flame, Building2,
  User, Smartphone, Mic, Sparkles, AlertCircle, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALERTS = [
  "Ward 5: Water supply disruption from 2 PM – 5 PM today",
  "Sector 12: Scheduled power outage on Jun 6 for maintenance",
  "Gas pipeline inspection in Zone 3 – Jun 7",
];

const CAROUSEL_DATA = [
  {
    tag: "National Helpline",
    title: "MANAS Support",
    desc: "National drug abuse support helpline integrated with SUVIDHA. Call 1933.",
    bg: "from-indigo-600 to-slate-900",
  },
  {
    tag: "Citizen Privacy",
    title: "DPDP Compliance",
    desc: "Your data is client-side encrypted. Decryption keys remain local.",
    bg: "from-emerald-600 to-slate-900",
  },
  {
    tag: "Offline Resiliency",
    title: "Offline-First Sync",
    desc: "No internet? Requests are queued locally and automatically sync online.",
    bg: "from-amber-600 to-slate-900",
  },
  {
    tag: "Civic Kiosks",
    title: "Kiosk QR Link",
    desc: "Scan the receipt barcode of physical kiosks to import requests.",
    bg: "from-blue-600 to-slate-900",
  },
  {
    tag: "Billing Safety",
    title: "Compare Billing Spike",
    desc: "Verify winter consumption averages before filing incorrect bill disputes.",
    bg: "from-purple-600 to-slate-900",
  },
  {
    tag: "Locker Sync",
    title: "Right to Forget",
    desc: "Purge local session keys and request logs easily in profile settings.",
    bg: "from-rose-600 to-slate-900",
  }
];

const RECENT = [
  { title: "Streetlight repair pending",  id: "SVD-8892", dept: "Municipal",   ago: "2 days ago",  status: "Assigned",     dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700"   },
  { title: "Gas Subsidy Renewal",         id: "SVD-8100", dept: "Gas",         ago: "5 days ago",  status: "Resolved",     dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  { title: "New Electricity Connection",  id: "SVD-8845", dept: "Electricity", ago: "1 week ago",  status: "Under Review", dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700"     },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const userStr = localStorage.getItem("suvidha_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "Rohan Sharma";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % CAROUSEL_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 pb-8 flex-1">
        
        {/* Custom Premium Header matching user's image */}
        <div className="bg-gradient-to-b from-blue-50 to-transparent px-4.5 pt-5 pb-2 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-2">
            {/* emblem + logo */}
            <div className="w-8.5 h-8.5 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
              <svg viewBox="0 0 32 32" className="w-6.5 h-6.5">
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
              </svg>
            </div>
            {/* Phone/kiosk indicator icon */}
            <div className="w-8.5 h-8.5 rounded-xl bg-orange-50 flex items-center justify-center shadow-sm border border-orange-100">
              <Smartphone className="w-4 h-4 text-suvidha-saffron" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 z-40">
            {/* Google Translate Widget */}
            <GoogleTranslateWidget />

            {/* Profile Avatar with badge */}
            <button
              onClick={() => setLocation("/profile")}
              className="relative w-8.5 h-8.5 rounded-full bg-suvidha-navy flex items-center justify-center shadow-sm text-white hover:opacity-90 active:scale-95 transition-transform"
            >
              <User className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-suvidha-saffron rounded-full border border-white" />
            </button>
          </div>
        </div>

        {/* Welcome Text block */}
        <div className="px-4.5 pt-1.5 pb-0.5">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{greeting},</p>
          <h2 className="text-gray-800 font-heading font-extrabold text-lg leading-tight">{userName}</h2>
        </div>

        {/* Search bar matching the image */}
        <div className="px-4.5 py-2">
          <div className="relative flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-12">
            <input
              type="text"
              placeholder='Search for "Electricity", "CA ID" etc.'
              className="w-full h-full pl-4 pr-16 text-sm text-gray-800 focus:outline-none placeholder:text-gray-400"
              onClick={() => setLocation("/services/electricity")}
            />
            <div className="absolute right-3 flex items-center gap-2 text-gray-400 border-l border-gray-100 pl-2">
              <Search className="w-4 h-4 text-suvidha-navy cursor-pointer hover:text-suvidha-saffron transition-colors" />
              <Mic className="w-4 h-4 text-orange-400 cursor-pointer hover:text-suvidha-saffron transition-colors" />
            </div>
          </div>
        </div>

        {/* Announcement Carousel (6 visual graphics) matching reference image */}
        <div className="px-4.5 py-2 shrink-0">
          <div className="relative h-44 rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-suvidha-navy">
            {/* Sliding slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className={`absolute inset-0 p-5 flex items-center justify-between bg-gradient-to-br ${CAROUSEL_DATA[currentSlide].bg}`}
              >
                {/* Left content column */}
                <div className="w-[60%] flex flex-col justify-between h-full text-white z-10">
                  <div>
                    <span className="bg-white/20 border border-white/30 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                      {CAROUSEL_DATA[currentSlide].tag}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-xs leading-tight text-white">
                      {CAROUSEL_DATA[currentSlide].title}
                    </h4>
                    <p className="text-white/75 text-[10px] leading-snug">
                      {CAROUSEL_DATA[currentSlide].desc}
                    </p>
                  </div>
                </div>

                {/* Right Mock Graphic Column */}
                <div className="w-[35%] h-full flex items-center justify-center relative select-none">
                  {/* Outer glow circle */}
                  <div className="absolute w-24 h-24 rounded-full bg-white/10 blur-md" />
                  
                  {/* Decorative graphic illustration based on slide index */}
                  {currentSlide === 0 && (
                    <div className="relative bg-white/10 border border-white/20 rounded-2xl w-14 h-24 p-1.5 flex flex-col justify-between shadow-lg backdrop-blur-xs">
                      <div className="w-full h-1 bg-white/40 rounded-full" />
                      <div className="text-center text-lg">📞</div>
                      <div className="w-full bg-suvidha-saffron text-white text-[8px] font-extrabold py-0.5 rounded text-center">1933</div>
                    </div>
                  )}
                  {currentSlide === 1 && (
                    <div className="relative flex flex-col items-center gap-1">
                      <div className="text-3xl">🛡️</div>
                      <div className="bg-emerald-500 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider text-center">DPDP Safe</div>
                    </div>
                  )}
                  {currentSlide === 2 && (
                    <div className="relative bg-white/15 border border-white/20 rounded-2xl w-14 h-22 p-2 flex flex-col items-center justify-center gap-1.5 shadow-lg">
                      <div className="text-2xl">⚡</div>
                      <span className="text-[7px] text-white/80 font-bold uppercase tracking-wider text-center leading-none">Sync Queued</span>
                    </div>
                  )}
                  {currentSlide === 3 && (
                    <div className="relative bg-white/10 border border-white/20 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                      <div className="text-2xl">🔍</div>
                      <div className="absolute inset-0 border border-dashed border-suvidha-saffron rounded-xl animate-pulse" />
                    </div>
                  )}
                  {currentSlide === 4 && (
                    <div className="relative bg-white/15 border border-white/20 rounded-xl w-16 h-16 p-2 flex flex-col justify-end gap-1 shadow-lg">
                      <div className="flex items-end justify-between h-8 gap-0.5">
                        <div className="w-2.5 h-3 bg-white/35 rounded-xs" />
                        <div className="w-2.5 h-6 bg-white/35 rounded-xs animate-pulse" />
                        <div className="w-2.5 h-8 bg-suvidha-saffron rounded-xs" />
                      </div>
                      <span className="text-[7px] text-white/80 font-bold uppercase text-center">Spike Mean</span>
                    </div>
                  )}
                  {currentSlide === 5 && (
                    <div className="relative flex flex-col items-center gap-1">
                      <div className="text-3xl">🔑</div>
                      <div className="bg-red-500 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider text-center">Erasure</div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider progress dots and slide number index tag */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
              <span className="bg-black/40 text-white text-[9px] font-mono px-2 py-0.5 rounded-full select-none">
                {currentSlide + 1}/{CAROUSEL_DATA.length}
              </span>
              <div className="flex gap-1">
                {CAROUSEL_DATA.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all pointer-events-auto ${currentSlide === index ? "w-4 bg-suvidha-saffron" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Services matching reference image */}
        <div className="px-4.5 py-4 bg-white border-y border-gray-100 shadow-2xs mt-2">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-suvidha-navy font-heading font-bold text-xs uppercase tracking-wider">🔗 Quick Services</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Grievance", icon: FileWarning, bg: "bg-emerald-500", text: "text-white", route: "/grievance/new" },
              { label: "Emergency", icon: Flame,       bg: "bg-rose-500",    text: "text-white", route: "/services/gas" },
              { label: "Outages",   icon: AlertCircle, bg: "bg-violet-500",  text: "text-white", route: "/services/electricity" },
              { label: "Utility",   icon: Building2,   bg: "bg-blue-500",    text: "text-white", route: "/services/municipal" }
            ].map(qs => {
              const Icon = qs.icon;
              return (
                <button
                  key={qs.label}
                  onClick={() => setLocation(qs.route)}
                  className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
                >
                  <div className={`w-11 h-11 rounded-full ${qs.bg} ${qs.text} flex items-center justify-center shadow-md hover:brightness-105 transition-all`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 group-hover:text-suvidha-navy transition-colors">{qs.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* My Documents (DigiLocker Integration) matching reference image */}
        <div className="px-4.5 py-4 bg-white border-b border-gray-100 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-suvidha-navy font-heading font-bold text-xs uppercase tracking-wider">📁 My Documents</span>
          </div>
          <div className="bg-gray-50 border border-gray-200/60 rounded-2xl p-4 flex gap-4 items-center">
            <div className="flex-1 space-y-2.5">
              <p className="text-[10px] font-semibold text-gray-500 leading-normal">
                Login into your DigiLocker account to access authentic government utility and identity documents directly inside SUVIDHA.
              </p>
              <button
                onClick={() => setLocation("/locker")}
                className="px-3 py-1.5 bg-white border border-suvidha-navy text-suvidha-navy hover:bg-suvidha-navy hover:text-white rounded-lg text-[10px] font-bold active:scale-[0.98] transition-all shadow-2xs"
              >
                Get Started
              </button>
            </div>
            
            {/* Mock DigiLocker logo matching the reference style */}
            <div className="w-20 h-14 shrink-0 bg-white border border-gray-200/50 rounded-xl flex flex-col items-center justify-center p-1.5 shadow-2xs">
              <span className="text-[8px] font-bold text-blue-900 tracking-wider">DigiLocker</span>
              <div className="w-5 h-5 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center mt-1">
                <Lock className="w-3 h-3 text-indigo-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Alert ticker */}
        <div className="mx-4.5 mt-3 relative z-10 bg-white rounded-xl shadow-2xs border border-red-100 flex items-center gap-2.5 px-3 py-2">
          <div className="w-5.5 h-5.5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <BellRing className="w-3 h-3 text-red-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-semibold text-gray-700 whitespace-nowrap animate-marquee">
              {ALERTS.join("  •  ")}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4.5 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
            <Link href="/tickets" className="text-[10px] font-bold text-suvidha-navy hover:underline">View All →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {RECENT.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${t.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-gray-800 truncate">{t.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.id} · {t.dept} · {t.ago}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${t.badge}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAB */}
        <button
          onClick={() => setLocation("/grievance/new")}
          className="fixed z-45 flex items-center justify-center rounded-full
                     bg-suvidha-saffron hover:bg-suvidha-saffron/90 active:scale-95
                     shadow-[0_4px_16px_rgba(255,128,0,0.35)] text-white transition-all"
          style={{ bottom: 84, right: 18, width: 48, height: 48 }}
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
