import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, CheckCircle, ArrowLeft, Download, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FORM_CONFIG: Record<string, {
  title: string; steps: string[];
  step2Fields: { label: string; type: "input" | "select" | "textarea"; placeholder?: string; options?: string[] }[];
}> = {
  "new-connection": {
    title: "New Connection Request",
    steps: ["Consumer Info", "Service Details", "Review", "Confirmation"],
    step2Fields: [
      { label: "Service Address", type: "input", placeholder: "Full address with pin code" },
      { label: "Required Load (KW)", type: "select", options: ["1 KW", "2 KW", "5 KW", "10 KW", "15 KW+"] },
      { label: "Premises Type", type: "select", options: ["Residential", "Commercial", "Industrial", "Agricultural"] },
      { label: "Additional Notes", type: "textarea", placeholder: "Any special requirements..." },
    ],
  },
  "complaint": {
    title: "Register Complaint",
    steps: ["Consumer Info", "Complaint Details", "Review", "Confirmation"],
    step2Fields: [
      { label: "Complaint Category", type: "select", options: [
        "Incorrect Bill", "Power Outage", "Meter Malfunction", "Delay in Connection",
        "Gas Leakage", "Water Supply Disruption", "Sewage Overflow", "Streetlight Failure",
        "Road Damage", "Garbage Collection", "Property Tax Error", "Other"
      ]},
      { label: "Description", type: "textarea", placeholder: "Describe the issue clearly..." },
      { label: "Location / Landmark", type: "input", placeholder: "e.g. Near Community Hall, Sec 5" },
    ],
  },
  "meter-replacement": {
    title: "Meter Replacement Request",
    steps: ["Consumer Info", "Meter Details", "Review", "Confirmation"],
    step2Fields: [
      { label: "Reason", type: "select", options: ["Meter Malfunction", "Physical Damage", "Meter Shifting", "Display Blank"] },
      { label: "Meter Serial Number", type: "input", placeholder: "Found on meter plate" },
      { label: "Describe the Issue", type: "textarea", placeholder: "Brief description of the problem..." },
    ],
  },
  "load-extension": {
    title: "Load Extension Request",
    steps: ["Consumer Info", "Load Details", "Review", "Confirmation"],
    step2Fields: [
      { label: "Current Sanctioned Load (KW)", type: "input", placeholder: "e.g. 5" },
      { label: "Requested Load (KW)", type: "input", placeholder: "e.g. 10" },
      { label: "Reason for Extension", type: "textarea", placeholder: "e.g. New AC units, business expansion..." },
    ],
  },
  "water-connection": {
    title: "New Water Connection",
    steps: ["Citizen Info", "Connection Details", "Review", "Confirmation"],
    step2Fields: [
      { label: "Connection Type", type: "select", options: ["Domestic (15mm)", "Commercial (25mm)", "Industrial (50mm)"] },
      { label: "Property Address", type: "input", placeholder: "Full address with pin code" },
      { label: "Ownership Type", type: "select", options: ["Owner", "Tenant (with NOC)", "Government Allottee"] },
    ],
  },
};

export default function ServiceForm() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const type = params.get("type") || "complaint";
  const dept = params.get("dept") || "";

  const config = FORM_CONFIG[type] || FORM_CONFIG["complaint"];
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [refNo] = useState(`SVD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [, setLocation] = useLocation();

  const DEPT_LABEL: Record<string, string> = { electricity: "Electricity", gas: "Piped Gas", municipal: "Municipal Corp." };
  const deptLabel = DEPT_LABEL[dept] || dept;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    if (step === 3) {
      setTimeout(() => setSuccess(true), 300);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-full bg-suvidha-bg px-6 text-center pb-24">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-success" />
          </motion.div>
          <h1 className="text-2xl font-heading font-bold mb-2">Request Submitted!</h1>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Your {config.title.toLowerCase()} has been registered. Track it using the reference number below.
          </p>
          <Card className="px-6 py-4 rounded-xl border-border shadow-sm flex flex-col items-center w-full max-w-xs mb-6">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Reference No.</span>
            <span className="text-xl font-mono font-bold text-suvidha-navy">{refNo}</span>
          </Card>
          <div className="flex gap-3 w-full max-w-xs">
            <Button variant="outline" className="flex-1 h-12 rounded-xl border-2 gap-2" onClick={() => setLocation("/tickets")}>
              <Search className="w-4 h-4" /> Track
            </Button>
            <Button className="flex-1 h-12 rounded-xl bg-suvidha-navy text-white gap-2">
              <Download className="w-4 h-4" /> Receipt
            </Button>
          </div>
          <button onClick={() => setLocation("/dashboard")} className="mt-4 text-sm font-semibold text-suvidha-navy hover:underline">
            Back to Home
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title={config.title} />

        <div className="px-5 pt-6 pb-2">
          {/* Step progress */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border -z-10" />
            <div className="absolute left-0 top-1/2 h-[2px] bg-suvidha-saffron -z-10 transition-all duration-300"
              style={{ width: `${((step - 1) / (config.steps.length - 1)) * 100}%` }} />
            {config.steps.map((label, idx) => (
              <div key={label} className="flex flex-col items-center gap-1.5 bg-suvidha-bg px-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  step > idx + 1 ? "bg-suvidha-saffron border-suvidha-saffron text-white" :
                  step === idx + 1 ? "bg-white border-suvidha-saffron text-suvidha-saffron" :
                  "bg-white border-border text-muted-foreground"
                )}>
                  {step > idx + 1 ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={cn("text-[9px] font-semibold text-center leading-tight max-w-[50px]",
                  step >= idx + 1 ? "text-suvidha-navy" : "text-muted-foreground")}>{label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Consumer Info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="font-heading font-bold text-lg">Consumer Information</h3>
              {deptLabel && (
                <div className="p-3 bg-suvidha-navy/5 rounded-xl text-sm font-medium text-suvidha-navy">
                  Department: <strong>{deptLabel}</strong>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Consumer / Account ID</label>
                <Input defaultValue="APCL-8842" className="h-11 rounded-xl" data-testid="input-consumer-id" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Full Name</label>
                <Input defaultValue="Rohan Sharma" className="h-11 rounded-xl" data-testid="input-name" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Mobile Number</label>
                <Input defaultValue="+91 98765 43210" className="h-11 rounded-xl" data-testid="input-mobile" />
              </div>
            </motion.div>
          )}

          {/* Step 2: Service-specific fields */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="font-heading font-bold text-lg">{config.steps[1]}</h3>
              {config.step2Fields.map(f => (
                <div key={f.label}>
                  <label className="text-sm font-semibold mb-1.5 block">{f.label}</label>
                  {f.type === "input" && (
                    <Input placeholder={f.placeholder} className="h-11 rounded-xl" data-testid={`input-${f.label.toLowerCase().replace(/\s+/g, "-")}`} />
                  )}
                  {f.type === "select" && (
                    <select className="w-full h-11 px-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-navy/30 bg-white" data-testid={`select-${f.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  )}
                  {f.type === "textarea" && (
                    <Textarea placeholder={f.placeholder} className="min-h-[100px] rounded-xl resize-none" data-testid={`textarea-${f.label.toLowerCase().replace(/\s+/g, "-")}`} />
                  )}
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Supporting Document (Optional)</label>
                <button className="w-full py-6 border-2 border-dashed border-border rounded-xl bg-white flex flex-col items-center text-muted-foreground hover:border-suvidha-navy transition-colors" data-testid="button-upload-doc">
                  <Camera className="w-6 h-6 mb-1.5 opacity-50" />
                  <span className="text-sm font-medium">Tap to upload photo / document</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="font-heading font-bold text-lg">Review & Confirm</h3>
              <Card className="p-4 rounded-xl border-border space-y-3">
                <ReviewRow label="Form Type" value={config.title} />
                <ReviewRow label="Department" value={deptLabel || "—"} />
                <ReviewRow label="Consumer ID" value="APCL-8842" />
                <ReviewRow label="Citizen Name" value="Rohan Sharma" />
                <ReviewRow label="Mobile" value="+91 98765 43210" />
              </Card>
              <div className="flex items-start gap-3 p-3 bg-suvidha-saffron/10 rounded-xl">
                <CheckCircle className="w-5 h-5 text-suvidha-saffron shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-suvidha-navy">I declare that the information provided above is true and correct to the best of my knowledge.</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-auto px-5 pt-4 pb-4">
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" className="w-12 h-14 rounded-xl border-2 p-0 shrink-0" onClick={() => setStep(step - 1)} data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Button
              className="flex-1 h-14 rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white text-base font-semibold"
              onClick={handleNext}
              data-testid="button-next"
            >
              {step === 3 ? "Submit Request" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}
