import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function NewGrievance() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const steps = ["Department", "Details", "Submit"];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setSuccess(true);
      setTimeout(() => {
        setLocation("/tickets");
      }, 3000);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-full bg-suvidha-bg px-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-success" />
          </motion.div>
          <h1 className="text-2xl font-heading font-bold mb-2">Grievance Submitted!</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Your grievance has been registered successfully. You can track it using the reference number below.
          </p>
          <div className="bg-white px-6 py-4 rounded-xl border border-border shadow-sm flex flex-col items-center w-full max-w-xs">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Reference No.</span>
            <span className="text-xl font-mono font-bold text-suvidha-navy">SVD-{Math.floor(1000 + Math.random() * 9000)}</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title="File Grievance" />
        
        <div className="px-5 pt-6 pb-2">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border -z-10" />
            <div className="absolute left-0 top-1/2 h-[2px] bg-suvidha-saffron -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }} />
            
            {steps.map((label, idx) => (
              <div key={label} className="flex flex-col items-center gap-2 bg-suvidha-bg px-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                  step > idx + 1 ? "bg-suvidha-saffron border-suvidha-saffron text-white" : 
                  step === idx + 1 ? "bg-white border-suvidha-saffron text-suvidha-saffron" : 
                  "bg-white border-border text-muted-foreground"
                )}>
                  {step > idx + 1 ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={cn("text-[10px] font-semibold", step >= idx + 1 ? "text-suvidha-navy" : "text-muted-foreground")}>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex-1">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="font-heading font-bold text-lg">Select Department</h3>
                <div className="grid gap-3">
                  {["Electricity", "Water Supply", "Sanitation", "Roads & Traffic", "Public Parks"].map((d, i) => (
                    <label key={i} className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl cursor-pointer active:bg-gray-50">
                      <input type="radio" name="dept" className="w-5 h-5 text-suvidha-saffron focus:ring-suvidha-saffron border-border" defaultChecked={i === 0} />
                      <span className="font-semibold text-sm">{d}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h3 className="font-heading font-bold text-lg">Grievance Details</h3>
                
                <div>
                  <label className="text-sm font-semibold mb-2 block text-foreground">Location / Landmark</label>
                  <Input placeholder="E.g. Near Community Center, Sec 4" className="h-12 bg-white rounded-xl" />
                </div>
                
                <div>
                  <label className="text-sm font-semibold mb-2 block text-foreground">Description</label>
                  <Textarea placeholder="Please describe the issue in detail..." className="min-h-[120px] bg-white rounded-xl resize-none" />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block text-foreground">Attach Photo (Optional)</label>
                  <button className="w-full py-8 border-2 border-dashed border-border rounded-xl bg-white flex flex-col items-center justify-center text-muted-foreground hover:border-suvidha-navy transition-colors">
                    <Camera className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Tap to take photo</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h3 className="font-heading font-bold text-lg">Review & Submit</h3>
                
                <div className="bg-white border border-border rounded-xl p-4 space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Department</div>
                    <div className="font-semibold text-sm">Electricity</div>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Location</div>
                    <div className="font-semibold text-sm">Near Community Center, Sec 4</div>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Description</div>
                    <div className="font-semibold text-sm leading-relaxed">The street light pole no. 45 has been completely non-functional for the past 3 days.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-suvidha-saffron/10 rounded-xl text-sm font-medium text-suvidha-navy">
                  <CheckCircle className="w-5 h-5 text-suvidha-saffron shrink-0" />
                  I declare that the information provided is true to the best of my knowledge.
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-auto px-5 pt-4">
          <div className="flex gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                className="w-1/3 h-14 rounded-xl font-semibold border-2"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button 
              className="flex-1 h-14 rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white text-lg font-semibold shadow-md"
              onClick={handleNext}
            >
              {step === 3 ? "Submit Grievance" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}