import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle, Zap, Droplets, Trash2, Construction, Trees, Flame, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const DEPARTMENTS = [
  { label: "Electricity",   icon: Zap,           bg: "bg-amber-50",  iconColor: "text-amber-600",  border: "border-amber-200" },
  { label: "Water Supply",  icon: Droplets,       bg: "bg-blue-50",   iconColor: "text-blue-600",   border: "border-blue-200"  },
  { label: "Sanitation",    icon: Trash2,         bg: "bg-green-50",  iconColor: "text-green-600",  border: "border-green-200" },
  { label: "Roads",         icon: AlertTriangle,  bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-200"},
  { label: "Public Parks",  icon: Trees,          bg: "bg-teal-50",   iconColor: "text-teal-600",   border: "border-teal-200"  },
  { label: "Piped Gas",     icon: Flame,          bg: "bg-red-50",    iconColor: "text-red-500",    border: "border-red-200"   },
];

const PRIORITY = [
  { key: "low",    label: "Low",      desc: "Non-urgent, 7–10 days",    color: "border-gray-300 text-gray-600", active: "border-suvidha-navy bg-suvidha-navy/5 text-suvidha-navy" },
  { key: "medium", label: "Medium",   desc: "Standard, 3–5 days",       color: "border-gray-300 text-gray-600", active: "border-suvidha-saffron bg-suvidha-saffron/10 text-suvidha-saffron" },
  { key: "high",   label: "High",     desc: "Urgent, within 24 hrs",    color: "border-gray-300 text-gray-600", active: "border-red-500 bg-red-50 text-red-600" },
];

export default function NewGrievance() {
  const [, setLocation] = useLocation();
  const { isOffline, addOfflineRequest } = useAccessibility();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [dept, setDept] = useState("Electricity");
  const [priority, setPriority] = useState("medium");
  const [locationVal, setLocationVal] = useState("");
  const [descriptionVal, setDescriptionVal] = useState("");
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    setTicketId(`SVD-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      if (isOffline) {
        const offId = addOfflineRequest({
          type: "Grievance",
          dept: dept,
          title: `Grievance: ${descriptionVal.substring(0, 30) || "Streetlight/Utility repair"}`,
          description: descriptionVal || "Filed offline",
        });
        setTicketId(offId);
      } else {
        // Also save online tickets to local tickets storage so they show in list
        const localTickets = JSON.parse(localStorage.getItem("suvidha_local_tickets") || "[]");
        const ticketRepresentation = {
          title: `Grievance: ${descriptionVal.substring(0, 30) || "Streetlight/Utility repair"}`,
          id: ticketId,
          dept: dept,
          ago: "Just now",
          status: "Submitted",
          dot: "bg-blue-400",
          badge: "bg-blue-50 text-blue-700 border-blue-200"
        };
        localStorage.setItem("suvidha_local_tickets", JSON.stringify([ticketRepresentation, ...localTickets]));
      }
      setSuccess(true);
      setTimeout(() => setLocation("/tickets"), 4000);
    }
  };

  const STEPS = ["Department", "Details", "Review"];


  if (success) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 px-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">Grievance Submitted!</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your grievance has been registered. You will receive SMS updates on your registered mobile.
            </p>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-8 py-5 mb-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reference No.</p>
              <p className="text-2xl font-mono font-bold text-suvidha-navy">{ticketId}</p>
              <p className="text-xs text-gray-400 mt-1">Expected resolution: 3–5 working days</p>
            </div>
            <p className="text-xs text-gray-400">Redirecting to My Tickets…</p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full">
        <TopAppBar title="File Grievance" />

        {/* Step indicator */}
        <div className="bg-white border-b border-gray-100 px-5 pt-4 pb-4">
          <div className="flex items-center gap-0">
            {STEPS.map((label, idx) => {
              const num = idx + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                      done ? "bg-suvidha-saffron border-suvidha-saffron text-white" :
                      active ? "bg-white border-suvidha-saffron text-suvidha-saffron" :
                      "bg-white border-gray-200 text-gray-400"
                    )}>
                      {done ? <CheckCircle className="w-4 h-4" /> : num}
                    </div>
                    <span className={cn("text-[9px] font-bold mt-1 whitespace-nowrap",
                      active ? "text-suvidha-navy" : done ? "text-suvidha-saffron" : "text-gray-400"
                    )}>{label}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] mx-1 mt-[-14px]">
                      <div className={cn("h-full transition-all", step > num ? "bg-suvidha-saffron" : "bg-gray-200")} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 px-4 py-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-gray-800">Select Department</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DEPARTMENTS.map(d => {
                    const Icon = d.icon;
                    const selected = dept === d.label;
                    return (
                      <button
                        key={d.label}
                        onClick={() => setDept(d.label)}
                        className={cn(
                          "bg-white rounded-2xl border-2 p-4 flex flex-col items-start gap-2.5 transition-all active:scale-[0.97]",
                          selected ? `${d.border} shadow-sm` : "border-gray-100"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", d.bg)}>
                          <Icon className={cn("w-5 h-5", d.iconColor)} />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-semibold text-sm text-gray-800">{d.label}</span>
                          {selected && <div className="w-4 h-4 rounded-full bg-suvidha-saffron flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-gray-800">Grievance Details</h3>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Location / Landmark</label>
                  <Input
                    placeholder="E.g. Near Community Center, Sec 4"
                    className="h-12 bg-white rounded-xl"
                    value={locationVal}
                    onChange={e => setLocationVal(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Description</label>
                  <Textarea
                    placeholder="Describe the issue clearly..."
                    className="min-h-[100px] bg-white rounded-xl resize-none"
                    value={descriptionVal}
                    onChange={e => setDescriptionVal(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRIORITY.map(p => (
                      <button
                        key={p.key}
                        onClick={() => setPriority(p.key)}
                        className={cn(
                          "border-2 rounded-xl p-2.5 flex flex-col items-center gap-0.5 transition-all text-center",
                          priority === p.key ? p.active : "border-gray-200 text-gray-500 bg-white"
                        )}
                      >
                        <span className="font-bold text-sm">{p.label}</span>
                        <span className="text-[9px] leading-tight opacity-70">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Attach Photo <span className="text-gray-300 normal-case font-normal">(optional)</span></label>
                  <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl bg-white flex flex-col items-center gap-2 text-gray-400 hover:border-suvidha-navy hover:text-suvidha-navy transition-colors active:bg-gray-50">
                    <Camera className="w-7 h-7" />
                    <span className="text-sm font-semibold">Tap to attach photo</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-gray-800">Review & Submit</h3>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100">
                  {[
                    { label: "Department", value: dept },
                    { label: "Priority",   value: PRIORITY.find(p => p.key === priority)?.label ?? "" },
                    { label: "Location",   value: locationVal || "—" },
                    { label: "Description", value: descriptionVal || "—" },
                  ].map(row => (
                    <div key={row.label} className="px-4 py-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{row.label}</p>
                      <p className="font-semibold text-sm text-gray-800">{row.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-suvidha-saffron/10 rounded-xl border border-suvidha-saffron/20">
                  <CheckCircle className="w-5 h-5 text-suvidha-saffron shrink-0" />
                  <p className="text-xs font-semibold text-suvidha-navy leading-snug">I declare that the information provided is true to the best of my knowledge.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action bar */}
        <div className="sticky bottom-[68px] bg-white border-t border-gray-100 px-4 py-4 flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              className="w-1/3 h-13 rounded-xl font-bold border-2 text-gray-700"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            className="flex-1 h-13 rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white font-bold text-[15px] shadow-sm"
            onClick={handleNext}
          >
            {step === 3 ? "Submit Grievance" : "Continue →"}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
