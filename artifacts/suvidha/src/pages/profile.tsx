import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Edit2, CheckCircle, Shield, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PROFILE_DATA = {
  name: "Rohan Sharma",
  mobile: "+91 98765 43210",
  email: "rohan.sharma@gmail.com",
  address: "123, Sector 7, Guwahati, Assam - 781001",
  aadhaar: "XXXX-XXXX-1234",
  accounts: [
    { dept: "Electricity", id: "APCL-8842", color: "bg-suvidha-saffron/10 text-suvidha-saffron" },
    { dept: "Piped Gas", id: "AGD-2201", color: "bg-destructive/10 text-destructive" },
    { dept: "Municipal", id: "GMC-4412", color: "bg-suvidha-teal/10 text-suvidha-teal" },
  ],
};

export default function Profile() {
  const [editField, setEditField] = useState<string | null>(null);
  const [values, setValues] = useState({ mobile: PROFILE_DATA.mobile, email: PROFILE_DATA.email, address: PROFILE_DATA.address });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [saved, setSaved] = useState(false);

  const handleEdit = (field: string) => {
    setEditField(field);
    setOtpStep(false);
    setSaved(false);
  };

  const handleSave = () => {
    if (editField === "mobile") {
      setOtpStep(true);
    } else {
      setSaved(true);
      setTimeout(() => { setEditField(null); setSaved(false); }, 1500);
    }
  };

  const handleVerifyOtp = () => {
    setSaved(true);
    setTimeout(() => { setEditField(null); setOtpStep(false); setSaved(false); }, 1500);
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title="My Profile" />

        <div className="p-5 space-y-4">
          {/* Avatar card */}
          <Card className="p-5 rounded-2xl border-border shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-suvidha-navy flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">{PROFILE_DATA.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-success">Verified Citizen</span>
              </div>
            </div>
          </Card>

          {/* Sensitive masked field */}
          <Card className="p-4 rounded-2xl border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aadhaar Number</span>
              <span className="ml-auto px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-full">Encrypted</span>
            </div>
            <div className="font-mono text-base font-bold tracking-widest text-foreground">{PROFILE_DATA.aadhaar}</div>
          </Card>

          {/* Editable fields */}
          {[
            { key: "mobile", label: "Mobile Number", sensitive: true },
            { key: "email", label: "Email Address", sensitive: false },
            { key: "address", label: "Address", sensitive: false },
          ].map(field => (
            <Card key={field.key} className="p-4 rounded-2xl border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{field.label}</span>
                {editField !== field.key && (
                  <button
                    onClick={() => handleEdit(field.key)}
                    className="flex items-center gap-1 text-xs font-semibold text-suvidha-navy hover:underline"
                    aria-label={`Edit ${field.label}`}
                    data-testid={`button-edit-${field.key}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editField === field.key ? (
                  <motion.div key="edit" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    {!otpStep ? (
                      <>
                        <Input
                          value={values[field.key as keyof typeof values]}
                          onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                          className="h-11 rounded-xl"
                          data-testid={`input-${field.key}`}
                        />
                        {field.sensitive && (
                          <p className="text-xs text-muted-foreground">An OTP will be sent to verify this change.</p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-10 rounded-xl text-sm border-2" onClick={() => setEditField(null)}>Cancel</Button>
                          <Button className="flex-1 h-10 rounded-xl text-sm bg-suvidha-navy text-white" onClick={handleSave} data-testid={`button-save-${field.key}`}>
                            {saved ? "Saved!" : field.sensitive ? "Send OTP" : "Save"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">Enter the 6-digit OTP sent to {values.mobile}</p>
                        <div className="flex gap-2 justify-between">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              maxLength={1}
                              value={otp[i] || ""}
                              onChange={e => {
                                const newOtp = otp.split("");
                                newOtp[i] = e.target.value;
                                setOtp(newOtp.join(""));
                                if (e.target.value) (document.getElementById(`otp-profile-${i + 1}`) as HTMLInputElement)?.focus();
                              }}
                              id={`otp-profile-${i}`}
                              className={cn("w-10 h-12 text-center border-2 rounded-xl text-lg font-bold focus:outline-none focus:border-suvidha-saffron transition-colors", otp[i] ? "border-suvidha-saffron bg-suvidha-saffron/5" : "border-border")}
                              data-testid={`input-otp-${i}`}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-10 rounded-xl text-sm border-2" onClick={() => setOtpStep(false)}>Back</Button>
                          <Button className="flex-1 h-10 rounded-xl text-sm bg-suvidha-saffron text-white" onClick={handleVerifyOtp} data-testid="button-verify-otp">
                            {saved ? <><CheckCircle className="w-4 h-4 mr-1" />Verified!</> : "Verify OTP"}
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-sm text-foreground">
                    {values[field.key as keyof typeof values]}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}

          {/* Consumer accounts */}
          <Card className="p-4 rounded-2xl border-border shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Linked Consumer Accounts</span>
            <div className="space-y-2.5">
              {PROFILE_DATA.accounts.map(acc => (
                <div key={acc.dept} className="flex items-center justify-between">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", acc.color)}>{acc.dept}</span>
                  <span className="font-mono text-sm font-bold text-foreground">{acc.id}</span>
                </div>
              ))}
            </div>
          </Card>

          <button
            className="w-full py-3 text-sm font-semibold text-destructive border-2 border-destructive/20 rounded-xl hover:bg-destructive/5 transition-colors"
            data-testid="button-delete-account"
          >
            Delete My Account & Data
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
