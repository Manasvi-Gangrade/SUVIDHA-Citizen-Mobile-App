import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import {
  Search, CheckCircle2, Circle, Clock, User, Calendar,
  Zap, Flame, Building2, ChevronRight, AlertCircle, MapPin, QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_TICKETS: Record<string, {
  id: string; title: string; dept: string; status: string; step: number;
  citizen: string; submitted: string; sla: string; officer: string;
  remarks: string; priority: string;
}> = {
  "SVD-8892": { id: "SVD-8892", title: "Streetlight repair pending",  dept: "Municipal",   status: "Assigned",     step: 3, citizen: "Rohan Sharma", submitted: "Jun 2, 2026",  sla: "Jun 8, 2026",  officer: "Rajan Kumar (Ward 4)",     remarks: "Assigned to field crew. Repair scheduled for tomorrow.",    priority: "High"   },
  "SVD-8845": { id: "SVD-8845", title: "New Electricity Connection",  dept: "Electricity", status: "Under Review", step: 2, citizen: "Rohan Sharma", submitted: "May 31, 2026", sla: "Jun 10, 2026", officer: "Pending Assignment",         remarks: "Documents under verification by the technical committee.",  priority: "Normal" },
  "SVD-8100": { id: "SVD-8100", title: "Gas Subsidy Renewal",         dept: "Piped Gas",   status: "Resolved",     step: 4, citizen: "Rohan Sharma", submitted: "May 26, 2026", sla: "Jun 1, 2026",  officer: "Suresh Jha",                remarks: "Subsidy renewed and linked to bank account.",               priority: "Normal" },
  "SVD-9012": { id: "SVD-9012", title: "Billing Dispute",             dept: "Electricity", status: "In Progress",  step: 2, citizen: "Priya Sharma", submitted: "Jun 3, 2026",  sla: "Jun 9, 2026",  officer: "Rajan Verma",               remarks: "Bill being recalculated by finance team.",                  priority: "High"   },
};

const TIMELINE_STEPS = ["Submitted", "Under Review", "Assigned to Officer", "Resolved"];

const RECENT_PREVIEW = [
  { id: "SVD-8892", title: "Streetlight repair", dept: "Municipal",   status: "Assigned",     icon: Building2, dotColor: "bg-amber-400",   textColor: "text-amber-700",   bgColor: "bg-amber-50"  },
  { id: "SVD-8845", title: "Electricity Connection", dept: "Electricity", status: "Under Review", icon: Zap,       dotColor: "bg-blue-400",    textColor: "text-blue-700",    bgColor: "bg-blue-50"   },
  { id: "SVD-8100", title: "Gas Subsidy Renewal",    dept: "Piped Gas",   status: "Resolved",     icon: Flame,     dotColor: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50"},
];

const STATUS_STYLE: Record<string, { badge: string; dot: string }> = {
  "Resolved":     { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Assigned":     { badge: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-400"   },
  "Under Review": { badge: "bg-blue-50 text-blue-700 border border-blue-200",          dot: "bg-blue-400"    },
  "In Progress":  { badge: "bg-teal-50 text-teal-700 border border-teal-200",          dot: "bg-teal-500"    },
};

const PRIORITY_STYLE: Record<string, string> = {
  "High":   "bg-red-50 text-red-600 border border-red-200",
  "Normal": "bg-gray-100 text-gray-500 border border-gray-200",
};

const DEPT_ICON: Record<string, React.ElementType> = {
  "Electricity": Zap,
  "Piped Gas":   Flame,
  "Municipal":   Building2,
};
const DEPT_COLOR: Record<string, string> = {
  "Electricity": "text-amber-600 bg-amber-50",
  "Piped Gas":   "text-red-500 bg-red-50",
  "Municipal":   "text-teal-600 bg-teal-50",
};

export default function TrackRequest() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof MOCK_TICKETS[string] | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleTrack = (q?: string) => {
    const val = (q ?? query).trim();
    if (!val) return;
    setLoading(true);
    setResult(undefined);
    setTimeout(() => {
      setResult(MOCK_TICKETS[val.toUpperCase()] ?? null);
      setLoading(false);
    }, 900);
  };

  const DeptIcon = result ? (DEPT_ICON[result.dept] ?? Building2) : Building2;
  const deptColor = result ? (DEPT_COLOR[result.dept] ?? "text-gray-500 bg-gray-100") : "";

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full pb-8">
        <TopAppBar title="Track Request" />

        {/* Hero search */}
        <div className="bg-suvidha-navy px-4 pt-5 pb-7">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Live Status</p>
          <h2 className="text-white font-heading font-bold text-lg mb-4">Track your grievance</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Ticket ID e.g. SVD-8892"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleTrack()}
                className="w-full h-12 pl-10 pr-4 bg-white rounded-xl text-sm font-medium text-gray-800
                           placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-suvidha-saffron/50 shadow-sm"
                data-testid="input-track-query"
              />
            </div>
            
            <button
              onClick={() => setShowScanner(true)}
              className="h-12 w-12 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-95 transition-transform"
              title="Scan Receipt QR"
              data-testid="button-qr-scan"
            >
              <QrCode className="w-5 h-5 text-suvidha-saffron" />
            </button>

            <button
              onClick={() => handleTrack()}
              disabled={loading || !query.trim()}
              className="h-12 px-5 bg-suvidha-saffron text-white rounded-xl font-bold text-sm
                         disabled:opacity-40 active:scale-95 transition-transform shadow-sm"
              data-testid="button-track"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : "Track"}
            </button>
          </div>
        </div>


        <div className="px-4 mt-[-14px] space-y-4">

          {/* Result card */}
          <AnimatePresence mode="wait">
            {result === null && !loading && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-center"
              >
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">No Record Found</h3>
                <p className="text-sm text-gray-400">No ticket matching <span className="font-mono font-bold text-gray-600">"{query}"</span>. Please check the ID.</p>
                <p className="text-xs text-gray-400 mt-3">Try: SVD-8892 · SVD-8845 · SVD-8100 · SVD-9012</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Main card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Dept color strip */}
                  <div className={cn("px-4 py-3 flex items-center gap-3", deptColor.split(" ")[1])}>
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", deptColor.split(" ")[1])}>
                      <DeptIcon className={cn("w-5 h-5", deptColor.split(" ")[0])} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest", deptColor.split(" ")[0])}>{result.dept}</p>
                      <p className="font-heading font-bold text-gray-800 text-[15px] truncate">{result.title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", STATUS_STYLE[result.status]?.badge)}>
                        {result.status}
                      </span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", PRIORITY_STYLE[result.priority])}>
                        {result.priority}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-4 space-y-3">
                    <div className="font-mono text-xs text-gray-400">{result.id}</div>

                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow icon={Calendar} label="Submitted"  value={result.submitted} />
                      <InfoRow icon={Clock}    label="SLA Date"   value={result.sla}       />
                      <InfoRow icon={User}     label="Officer"    value={result.officer}    />
                      <InfoRow icon={MapPin}   label="Department" value={result.dept}       />
                    </div>

                    {result.remarks && (
                      <div className="p-3 bg-suvidha-navy/5 rounded-xl border border-suvidha-navy/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Latest Update</p>
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{result.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Progress Timeline</p>
                  <div className="relative pl-5">
                    <div className="absolute left-[7px] top-1 bottom-3 w-px bg-gray-200" />
                    {TIMELINE_STEPS.map((step, idx) => {
                      const stepNum = idx + 1;
                      const done = result.step > stepNum;
                      const active = result.step === stepNum;
                      return (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className={cn("relative pb-4 last:pb-0", idx === TIMELINE_STEPS.length - 1 ? "pb-0" : "")}
                        >
                          <div className="absolute -left-5 top-0.5 z-10">
                            {done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                            ) : active ? (
                              <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-3.5 h-3.5 rounded-full border-2 border-suvidha-saffron bg-white flex items-center justify-center"
                              >
                                <div className="w-1.5 h-1.5 bg-suvidha-saffron rounded-full" />
                              </motion.div>
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-gray-300" />
                            )}
                          </div>
                          <div className={cn("pl-1 transition-opacity", active || done ? "opacity-100" : "opacity-35")}>
                            <p className={cn("text-sm font-semibold", active ? "text-suvidha-saffron" : done ? "text-gray-700" : "text-gray-400")}>
                              {step}
                            </p>
                            {active && (
                              <p className="text-xs text-gray-400 mt-0.5">In progress</p>
                            )}
                            {done && (
                              <p className="text-xs text-emerald-500 mt-0.5 font-medium">Completed</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent tickets (shown when no search yet) */}
          {result === undefined && !loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Recent Tickets</p>
              {RECENT_PREVIEW.map((t, i) => {
                const Icon = t.icon;
                const style = STATUS_STYLE[t.status] ?? { badge: "", dot: "" };
                return (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => { setQuery(t.id); handleTrack(t.id); }}
                    className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                    data-testid={`recent-ticket-${t.id}`}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", t.bgColor)}>
                      <Icon className={cn("w-5 h-5", t.dotColor.replace("bg-", "text-"))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-gray-800 truncate">{t.title}</p>
                      <p className="font-mono text-[10px] text-gray-400 mt-0.5">{t.id} · {t.dept}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", style.badge)}>{t.status}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mock QR Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-center items-center p-6 text-white"
          >
            {/* Scan box frame */}
            <div className="relative w-64 h-64 border-2 border-dashed border-suvidha-saffron rounded-3xl overflow-hidden flex items-center justify-center bg-black/40">
              {/* Laser animation */}
              <motion.div
                animate={{ y: [-110, 110, -110] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_10px_#ef4444] z-10"
              />
              <QrCode className="w-24 h-24 text-white/25" />
            </div>
            
            <h3 className="text-lg font-heading font-bold mt-8 text-center text-suvidha-saffron">Scan Kiosk Receipt QR Code</h3>
            <p className="text-xs text-white/60 text-center max-w-xs mt-2 leading-relaxed">
              Align the QR code printed at the bottom of your SUVIDHA kiosk receipt within the frame scanner.
            </p>

            {/* Paste or Simulate controls */}
            <div className="mt-8 space-y-3 w-full max-w-xs">
              <button
                onClick={() => {
                  setShowScanner(false);
                  setQuery("SVD-8892");
                  handleTrack("SVD-8892");
                  toast.success("Kiosk Receipt Scanned!", {
                    description: "Linked Streetlight repair (SVD-8892) to your mobile session."
                  });
                }}
                className="w-full h-12 bg-suvidha-saffron text-white rounded-xl font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
              >
                Simulate Scan: Kiosk Grievance SVD-8892
              </button>
              <button
                onClick={() => {
                  setShowScanner(false);
                  setQuery("SVD-9012");
                  handleTrack("SVD-9012");
                  toast.success("Kiosk Receipt Scanned!", {
                    description: "Linked Billing Dispute (SVD-9012) to your mobile session."
                  });
                }}
                className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-transform"
              >
                Simulate Scan: Billing Ticket SVD-9012
              </button>
              <button
                onClick={() => setShowScanner(false)}
                className="w-full h-12 text-white/60 font-semibold text-xs hover:underline mt-2"
              >
                Cancel Scan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
