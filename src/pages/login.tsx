import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  Shield, ArrowLeft, Check, Lock, Info,
  Smartphone, Eye, EyeOff, User, KeyRound,
  Fingerprint, Flame, Zap, PhoneCall
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleTranslateWidget } from "@/components/StandaloneTranslateTTS";
import { toast } from "sonner";

type LoginStep = "consent" | "dept_identifier" | "phone" | "otp";

export default function Login() {
  const [, setLocation] = useLocation();
  const { consentAccepted, setConsentAccepted } = useAccessibility();

  // Mode: citizen vs admin
  const [loginMode, setLoginMode] = useState<"citizen" | "admin">("citizen");

  // Citizen step state
  const [step, setStep] = useState<LoginStep>("consent");
  const [selectedDept, setSelectedDept] = useState<"electricity" | "gas" | "municipal">("electricity");
  const [identifierType, setIdentifierType] = useState<"ca" | "aadhaar">("ca");
  const [identifierVal, setIdentifierVal] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Admin state
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [admin2FA, setAdmin2FA] = useState("");

  // Consent checkbox states
  const [termsAccepted, setTermsAccepted] = useState(consentAccepted);
  const [dataSharingAccepted, setDataSharingAccepted] = useState(consentAccepted);

  // Biometric state
  const [biometricScanning, setBiometricScanning] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("suvidha_user");
    if (user) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  const handleCitizenLogin = () => {
    localStorage.setItem(
      "suvidha_user",
      JSON.stringify({
        name: "Rohan Sharma",
        phone: `+91 ${phone || "98765 43210"}`,
        dept: selectedDept,
        id: identifierVal || "APCL-8842",
      })
    );
    toast.success("Welcome back Rohan! Session established.");
    setLocation("/dashboard");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser || !adminPass) {
      toast.error("Enter administrative credentials.");
      return;
    }
    toast.success("Official verification complete.");
    setLocation("/admin");
  };

  const triggerBiometrics = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      localStorage.setItem(
        "suvidha_user",
        JSON.stringify({
          name: "Rohan Sharma",
          phone: "+91 98765 43210",
          dept: "electricity",
          id: "APCL-8842",
        })
      );
      toast.success("Biometric match authenticated.");
      setLocation("/dashboard");
    }, 1400);
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-full bg-slate-50 pt-5 px-5 pb-20 relative overflow-x-hidden">
        
        {/* Decorative Blurred Mesh Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-12 -left-12 w-72 h-72 bg-suvidha-saffron/10 rounded-full blur-[60px] animate-pulse" />
          <div className="absolute top-1/3 right-[-40px] w-64 h-64 bg-suvidha-teal/15 rounded-full blur-[80px]" />
          <div className="absolute bottom-5 left-10 w-80 h-80 bg-suvidha-navy/5 rounded-full blur-[90px]" />
        </div>

        {/* Toolbar Header */}
        <div className="flex items-center justify-between mb-4 z-40 relative">
          {loginMode === "citizen" && step !== "consent" ? (
            <button
              onClick={() => {
                if (step === "dept_identifier") setStep("consent");
                else if (step === "phone") setStep("dept_identifier");
                else if (step === "otp") setStep("phone");
              }}
              className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-90 transition-transform shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8" />
          )}
          
          <GoogleTranslateWidget />
        </div>

        {/* App Branding Section */}
        <div className="flex flex-col items-center mt-1 mb-6">
          <div className="relative mb-3.5 select-none">
            {/* Outer animated halo ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-suvidha-saffron to-suvidha-teal opacity-20 blur-xs"
            />
            <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
              <svg viewBox="0 0 32 32" className="w-8 h-8">
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
                      strokeWidth={i % 3 === 0 ? "1.5" : "0.7"}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <h1 className="text-[21px] font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-suvidha-navy to-slate-900 tracking-tight text-center leading-tight">
            SUVIDHA Gateway
          </h1>
          <p className="text-gray-400 text-center text-[10px] font-bold tracking-wider uppercase mt-0.5">
            Smart Unified Civic Assistance
          </p>
        </div>

        {/* Premium Sliding Segment Switcher (iOS style pill segment) */}
        <div className="bg-gray-100/90 border border-gray-200/50 p-1 rounded-2xl flex relative w-full mb-6 select-none">
          {/* Animated background sliding pill */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute top-1 bottom-1 rounded-xl bg-white shadow-xs border border-gray-200/60"
            style={{
              width: "calc(50% - 6px)",
              left: loginMode === "citizen" ? 5 : "calc(50% + 1px)",
            }}
          />
          <button
            onClick={() => {
              setLoginMode("citizen");
              setStep("consent");
            }}
            className={cn(
              "flex-1 py-2 text-center text-[11px] font-bold z-10 transition-colors rounded-xl flex items-center justify-center gap-1.5",
              loginMode === "citizen" ? "text-suvidha-navy" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <User className="w-3.5 h-3.5" />
            Citizen Login
          </button>
          <button
            onClick={() => setLoginMode("admin")}
            className={cn(
              "flex-1 py-2 text-center text-[11px] font-bold z-10 transition-colors rounded-xl flex items-center justify-center gap-1.5",
              loginMode === "admin" ? "text-suvidha-navy" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Official Portal
          </button>
        </div>

        {/* Dynamic Glassmorphic input container */}
        <div className="bg-white/95 backdrop-blur-md border border-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 flex-1 flex flex-col transition-all duration-300">
          <AnimatePresence mode="wait">
            
            {/* CITIZEN LOGIN BLOCK */}
            {loginMode === "citizen" && (
              <motion.div
                key="citizen-panel"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col flex-1"
              >
                {/* Step dot indices indicator */}
                <div className="flex items-center justify-between mb-5 select-none">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Verification Step {step === "consent" ? "1/4" : step === "dept_identifier" ? "2/4" : step === "phone" ? "3/4" : "4/4"}
                  </span>
                  <div className="flex gap-1.5">
                    {["consent", "dept_identifier", "phone", "otp"].map((s) => (
                      <div
                        key={s}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          step === s ? "w-5 bg-suvidha-saffron" : "bg-gray-100"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Step 1: Consent */}
                {step === "consent" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <Lock className="w-4 h-4 text-suvidha-saffron" />
                      <h3 className="font-heading font-extrabold text-[13px] text-suvidha-navy uppercase tracking-wider">Consent Verification</h3>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                      In compliance with India's DPDP Act 2023, please authorize data queries to initialize your secure session.
                    </p>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/70 p-3 rounded-2xl border border-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={e => setTermsAccepted(e.target.checked)}
                          className="mt-0.5 rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4 h-4 border-gray-300"
                        />
                        <span className="text-[10px] leading-normal font-bold text-gray-600">
                          I agree to terms of service & client-side encryption policy.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/70 p-3 rounded-2xl border border-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={dataSharingAccepted}
                          onChange={e => setDataSharingAccepted(e.target.checked)}
                          className="mt-0.5 rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4 h-4 border-gray-300"
                        />
                        <span className="text-[10px] leading-normal font-bold text-gray-600">
                          I authorize SUVIDHA to fetch utility records for my account.
                        </span>
                      </label>
                    </div>

                    {/* Biometrics simulator circle */}
                    <div className="pt-3 flex flex-col items-center">
                      <button
                        onClick={triggerBiometrics}
                        disabled={biometricScanning}
                        className={cn(
                          "w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center relative active:scale-90 transition-transform bg-white",
                          biometricScanning ? "shadow-inner border-suvidha-saffron" : "shadow-sm hover:border-gray-300"
                        )}
                        title="Simulate Biometric Fingerprint"
                      >
                        {biometricScanning ? (
                          <div className="absolute inset-0 rounded-full border-2 border-suvidha-saffron border-t-transparent animate-spin" />
                        ) : (
                          <Fingerprint className="w-5 h-5 text-suvidha-saffron animate-pulse" />
                        )}
                      </button>
                      <span className="text-[9px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">
                        {biometricScanning ? "Scanning FaceID..." : "Quick Biometric Login"}
                      </span>
                    </div>

                    <Button
                      onClick={() => setStep("dept_identifier")}
                      disabled={!termsAccepted || !dataSharingAccepted}
                      className="w-full h-12 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white mt-auto font-bold shadow-sm active:scale-[0.98] transition-transform"
                    >
                      Accept & Continue
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Department and ID */}
                {step === "dept_identifier" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex flex-col flex-1">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                        Select Department
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "electricity", name: "Electricity", icon: Zap, bg: "bg-amber-500", text: "text-amber-500" },
                          { id: "gas", name: "Piped Gas", icon: Flame, bg: "bg-orange-500", text: "text-orange-500" },
                          { id: "municipal", name: "Municipal", icon: PhoneCall, bg: "bg-teal-500", text: "text-teal-500" },
                        ].map(d => {
                          const Icon = d.icon;
                          const active = selectedDept === d.id;
                          return (
                            <button
                              key={d.id}
                              onClick={() => setSelectedDept(d.id as any)}
                              className={cn(
                                "py-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all font-bold text-[10px] active:scale-95",
                                active
                                  ? "border-suvidha-saffron bg-orange-50/70 text-suvidha-navy shadow-2xs"
                                  : "border-gray-100 hover:bg-gray-50 text-gray-400"
                              )}
                            >
                              <Icon className={cn("w-4.5 h-4.5", active ? d.text : "text-gray-300")} />
                              {d.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                          Account Identifier
                        </label>
                        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200/50">
                          <button
                            onClick={() => { setIdentifierType("ca"); setIdentifierVal(""); }}
                            className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md transition-all", identifierType === "ca" ? "bg-white text-suvidha-navy shadow-3xs" : "text-gray-400")}
                          >
                            CA ID
                          </button>
                          <button
                            onClick={() => { setIdentifierType("aadhaar"); setIdentifierVal(""); }}
                            className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md transition-all", identifierType === "aadhaar" ? "bg-white text-suvidha-navy shadow-3xs" : "text-gray-400")}
                          >
                            Aadhaar
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <Input
                          type="text"
                          placeholder={identifierType === "ca" ? "e.g. APCL-8842" : "12-digit Aadhaar Number"}
                          value={identifierVal}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (identifierType === "aadhaar") {
                              if (/^\d*$/.test(raw)) setIdentifierVal(raw.slice(0, 12));
                            } else {
                              setIdentifierVal(raw);
                            }
                          }}
                          className="h-11 px-4.5 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep("phone")}
                      disabled={identifierVal.trim().length < 4}
                      className="w-full h-12 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white mt-auto font-bold shadow-sm active:scale-[0.98] transition-transform"
                    >
                      Next Step
                    </Button>
                  </motion.div>
                )}

                {/* Step 3: Phone */}
                {step === "phone" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex flex-col flex-1">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">
                        Registered Mobile Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-sm font-bold text-gray-400 select-none">+91</span>
                        <Input
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) setPhone(val);
                          }}
                          className="h-11 pl-12 pr-4 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm tracking-wide"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed mt-1">
                        We will send a dynamic 6-digit security code to this number.
                      </p>
                    </div>

                    <Button
                      onClick={() => setStep("otp")}
                      disabled={phone.length !== 10}
                      className="w-full h-12 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white mt-auto font-bold shadow-sm active:scale-[0.98] transition-transform"
                    >
                      Send Verification Code
                    </Button>
                  </motion.div>
                )}

                {/* Step 4: OTP */}
                {step === "otp" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex flex-col flex-1">
                    <div className="space-y-3.5">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block text-center">
                        Input Security Code
                      </label>
                      <div className="flex gap-2 justify-center">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            type="text"
                            maxLength={1}
                            value={otp[idx] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                const newOtp = [...otp];
                                newOtp[idx] = val;
                                setOtp(newOtp);
                                if (val && idx < 5) {
                                  document.getElementById(`otp-box-${idx + 1}`)?.focus();
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                                document.getElementById(`otp-box-${idx - 1}`)?.focus();
                              }
                            }}
                            className="w-10 h-11 border border-gray-200 rounded-xl text-center font-bold text-base text-gray-700 focus:outline-none focus:ring-4 focus:ring-suvidha-saffron/10 focus:border-suvidha-saffron transition-all"
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                        <span className="text-gray-400">Resend SMS code in 30s</span>
                        <button className="text-suvidha-saffron hover:underline">Resend Now</button>
                      </div>
                    </div>

                    <Button
                      onClick={handleCitizenLogin}
                      disabled={otp.filter(Boolean).length !== 6}
                      className="w-full h-12 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white mt-auto font-bold shadow-sm active:scale-[0.98] transition-transform"
                    >
                      Authenticate Portal
                    </Button>
                  </motion.div>
                )}

              </motion.div>
            )}

            {/* ADMINISTRATOR LOGIN BLOCK */}
            {loginMode === "admin" && (
              <motion.div
                key="admin-panel"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col flex-1 space-y-4"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Lock className="w-4 h-4 text-suvidha-saffron" />
                  <h3 className="font-heading font-extrabold text-[13px] text-suvidha-navy uppercase tracking-wider">Admin Portal</h3>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4 flex flex-col flex-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                      Username / Official ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="e.g. admin_guwahati"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        className="h-11 pl-10 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                      Secure Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showAdminPass ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="h-11 pl-10 pr-10 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm placeholder:text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                      Two-Factor TOTP (Google Auth)
                    </label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit code"
                      value={admin2FA}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setAdmin2FA(val.slice(0, 6));
                      }}
                      className="h-11 rounded-xl border-gray-200 focus:border-suvidha-saffron focus:ring-4 focus:ring-suvidha-saffron/10 font-bold text-gray-700 text-sm placeholder:text-gray-300 text-center tracking-widest font-mono"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex gap-2.5 mt-1">
                    <Shield className="w-4.5 h-4.5 text-suvidha-saffron shrink-0 mt-0.5" />
                    <p className="text-[9px] leading-normal text-gray-400 font-bold uppercase tracking-wider">
                      Authorized access only. Log monitoring is active.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white mt-auto font-bold shadow-sm active:scale-[0.98] transition-transform"
                  >
                    Authenticate Admin Securely
                  </Button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Quick Emergency Helplines at bottom */}
        <div className="mt-6 border-t border-gray-200/50 pt-4.5">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 text-center">
            🚨 Quick Utility Emergency Help
          </p>
          <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-gray-600">
            <a
              href="tel:1912"
              className="bg-white border border-gray-100 p-2.5 rounded-2xl flex items-center gap-2 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <div className="w-6.5 h-6.5 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div>
                <p className="leading-tight text-gray-800">Power Incident</p>
                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Call 1912</p>
              </div>
            </a>
            <a
              href="tel:1906"
              className="bg-white border border-gray-100 p-2.5 rounded-2xl flex items-center gap-2 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <div className="w-6.5 h-6.5 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <Flame className="w-3.5 h-3.5 text-red-500" />
              </div>
              <div>
                <p className="leading-tight text-gray-800">Gas Leakage</p>
                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Call 1906</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}