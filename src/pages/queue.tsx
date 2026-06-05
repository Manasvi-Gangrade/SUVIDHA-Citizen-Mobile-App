import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap, Flame, Building2, UserCheck, RefreshCw,
  QrCode, AlertCircle, ArrowLeft, ArrowRight,
  Clock, Users, CheckCircle2, Ticket, Printer, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type DeptType = "electricity" | "gas" | "municipal" | "aadhaar";

interface QueueSlip {
  tokenNo: string;
  dept: string;
  purpose: string;
  estimatedWait: number;
  peopleAhead: number;
  counter: string;
  timestamp: string;
}

export default function QueueToken() {
  const [step, setStep] = useState<"form" | "slip">("form");
  const [selectedDept, setSelectedDept] = useState<DeptType>("municipal");
  const [purpose, setPurpose] = useState("Bill disputation / Rectification");
  const [name, setName] = useState("Rohan Sharma");
  const [phone, setPhone] = useState("9876543210");
  const [generating, setGenerating] = useState(false);
  const [slip, setSlip] = useState<QueueSlip | null>(null);

  const handleGenerateToken = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your details.");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const prefixes = {
        electricity: "EL",
        gas: "GS",
        municipal: "MC",
        aadhaar: "AD"
      };
      
      const deptNames = {
        electricity: "Electricity Department",
        gas: "Piped Gas Division",
        municipal: "Municipal Corporation Ward 4",
        aadhaar: "UIDAI Aadhaar Seva Center"
      };

      const randNo = Math.floor(Math.random() * 80) + 10;
      const randWait = Math.floor(Math.random() * 25) + 5;
      const randAhead = Math.floor(Math.random() * 6) + 1;
      const randCounter = String(Math.floor(Math.random() * 4) + 1);

      setSlip({
        tokenNo: `${prefixes[selectedDept]}-${randNo}`,
        dept: deptNames[selectedDept],
        purpose: purpose || "General Query Inquiry",
        estimatedWait: randWait,
        peopleAhead: randAhead,
        counter: `Counter ${randCounter}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setGenerating(false);
      setStep("slip");
      toast.success("Digital Token generated successfully!");
    }, 1500);
  };

  const handleRefreshPosition = () => {
    if (!slip) return;
    if (slip.peopleAhead <= 0) {
      toast.info("Your token number has been called! Please proceed to your counter.");
      return;
    }
    
    // Simulate progression
    const newAhead = Math.max(0, slip.peopleAhead - 1);
    const newWait = Math.max(0, slip.estimatedWait - Math.floor(Math.random() * 4) - 2);
    
    setSlip({
      ...slip,
      peopleAhead: newAhead,
      estimatedWait: newWait,
      counter: newAhead === 0 ? slip.counter : slip.counter
    });

    if (newAhead === 0) {
      toast.success("🚨 Token Called! Please proceed to " + slip.counter);
    } else {
      toast.success(`Position updated: ${newAhead} people ahead.`);
    }
  };

  const handleCancelToken = () => {
    setSlip(null);
    setStep("form");
    toast.info("Token canceled successfully.");
  };

  const DEPT_INFO = [
    { id: "municipal", name: "Municipal", desc: "Tax & Grievances", icon: Building2, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { id: "electricity", name: "Electricity", desc: "Meter & Billing", icon: Zap, color: "text-amber-500 bg-amber-50 border-amber-100" },
    { id: "gas", name: "Piped Gas", desc: "New Connection & Subsidy", icon: Flame, color: "text-red-500 bg-red-50 border-red-100" },
    { id: "aadhaar", name: "Aadhaar Card", desc: "Update & Enrollment", icon: UserCheck, color: "text-indigo-600 bg-indigo-50 border-indigo-100" }
  ];

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full pb-8">
        <TopAppBar title="Digital Kiosk Token" />

        <div className="px-4.5 pt-4 space-y-4 flex-1 flex flex-col">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: TOKEN FORM GENERATOR */}
            {step === "form" && (
              <motion.div
                key="token-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                {/* Informational banner */}
                <div className="bg-suvidha-navy text-white rounded-2xl p-4 shadow-sm flex items-start gap-3 relative overflow-hidden select-none">
                  {/* Subtle watermarked ticket shape */}
                  <Ticket className="absolute right-[-10px] bottom-[-10px] w-28 h-28 text-white/5 -rotate-12 shrink-0 pointer-events-none" />
                  <AlertCircle className="w-5 h-5 text-suvidha-saffron shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h3 className="font-heading font-extrabold text-[13px] tracking-wide text-suvidha-saffron uppercase">Skip the Kiosk Lines!</h3>
                    <p className="text-[10px] text-gray-300 leading-normal font-semibold">
                      Generate an entry token here. Scan the QR code at your physical center kiosk to confirm arrival and bypass waiting times.
                    </p>
                  </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4.5 space-y-4">
                  
                  {/* Dept selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                      Select Department Center
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {DEPT_INFO.map(d => {
                        const Icon = d.icon;
                        const active = selectedDept === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelectedDept(d.id as DeptType)}
                            className={cn(
                              "p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all active:scale-[0.98]",
                              active
                                ? "border-suvidha-saffron bg-orange-50/70"
                                : "border-gray-100 hover:bg-gray-50/60"
                            )}
                          >
                            <div className={cn("w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border", active ? "bg-white text-suvidha-saffron border-orange-100" : "bg-gray-50 text-gray-400 border-transparent")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-extrabold text-[11px] text-gray-800 mt-1">{d.name}</span>
                            <span className="text-[9px] text-gray-400 font-semibold leading-none">{d.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Purpose Input */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                      Purpose of Visit
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Bill payment support"
                      value={purpose}
                      onChange={e => setPurpose(e.target.value)}
                      className="h-11 px-4 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm placeholder:text-gray-300"
                    />
                  </div>

                  {/* Identification inputs */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="h-11 px-4 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                        Mobile Number
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="h-11 px-4 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm"
                      />
                    </div>
                  </div>

                </div>

                <Button
                  onClick={handleGenerateToken}
                  disabled={generating}
                  className="w-full h-12 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white mt-auto font-bold shadow-sm active:scale-[0.98] transition-transform"
                >
                  {generating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Generate Digital Token
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* STEP 2: GENERATED TICKET SLIP CARD */}
            {step === "slip" && slip && (
              <motion.div
                key="token-slip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-4 flex-1 flex flex-col items-center justify-center py-2"
              >
                
                {/* Digital Ticket Pass Card */}
                <div className="w-full bg-white border border-gray-200/60 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden relative select-none">
                  
                  {/* Decorative Ticket Punch Cuts */}
                  <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 border border-r-gray-200 rounded-full z-10" />
                  <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 border border-l-gray-200 rounded-full z-10" />
                  
                  {/* Card Header */}
                  <div className="bg-suvidha-navy text-white px-5 py-4 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-extrabold text-suvidha-saffron uppercase tracking-widest">Digital Entry Pass</span>
                      <h4 className="font-heading font-extrabold text-xs mt-0.5">{slip.dept}</h4>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Ticket className="w-4.5 h-4.5 text-suvidha-saffron" />
                    </div>
                  </div>

                  {/* Token Number Highlight */}
                  <div className="p-6 text-center border-b border-dashed border-gray-200/80">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Your Token Number</span>
                    <h2 className="text-4xl font-heading font-black text-suvidha-navy tracking-tight my-1.5 select-all">
                      {slip.tokenNo}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-bold max-w-xs mx-auto mt-1">
                      {slip.purpose}
                    </p>
                  </div>

                  {/* Queue live metrics */}
                  <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 py-4.5 bg-gray-50/50">
                    
                    <div className="text-center flex flex-col items-center justify-center">
                      <Users className="w-4 h-4 text-suvidha-saffron mb-1" />
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase">Queue Position</span>
                      <span className="text-sm font-black text-gray-800 mt-0.5">
                        {slip.peopleAhead === 0 ? "Now Called" : `${slip.peopleAhead} Ahead`}
                      </span>
                    </div>

                    <div className="text-center flex flex-col items-center justify-center">
                      <Clock className="w-4 h-4 text-teal-600 mb-1" />
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase">Est. Wait Time</span>
                      <span className="text-sm font-black text-gray-800 mt-0.5">
                        {slip.estimatedWait === 0 ? "0 mins" : `~ ${slip.estimatedWait} mins`}
                      </span>
                    </div>

                    <div className="text-center flex flex-col items-center justify-center">
                      <UserCheck className="w-4 h-4 text-indigo-600 mb-1" />
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase">Assigned Counter</span>
                      <span className="text-sm font-black text-gray-800 mt-0.5">{slip.counter}</span>
                    </div>

                  </div>

                  {/* QR Code and Instructions */}
                  <div className="p-6 flex flex-col items-center bg-white">
                    <div className="relative p-2.5 bg-white border border-gray-100 rounded-2xl shadow-inner select-none mb-3">
                      <QrCode className="w-32 h-32 text-suvidha-navy" />
                      {slip.peopleAhead === 0 && (
                        <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-3xs rounded-2xl flex flex-col items-center justify-center text-white p-2">
                          <CheckCircle2 className="w-8 h-8 text-white mb-1" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Pass Active</span>
                          <span className="text-[8px] opacity-80">Proceed to Counter</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold text-center leading-normal max-w-xs">
                      Scan this QR code at the physical kiosk's scanner when called to display your dossier.
                    </p>
                    <span className="text-[8px] text-gray-400 font-bold tracking-wider uppercase mt-4">
                      Generated at {slip.timestamp}
                    </span>
                  </div>

                </div>

                {/* Queue Control Buttons */}
                <div className="w-full grid grid-cols-2 gap-3 mt-1">
                  <Button
                    onClick={handleRefreshPosition}
                    className="h-11 text-xs rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.97] transition-transform font-bold"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-suvidha-saffron" />
                    Refresh Position
                  </Button>
                  <Button
                    onClick={handleCancelToken}
                    className="h-11 text-xs rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100/50 active:scale-[0.97] transition-transform font-bold"
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Cancel Token
                  </Button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest flex items-center gap-1.5 select-none pt-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Pass Receipt
                </button>

              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
}
