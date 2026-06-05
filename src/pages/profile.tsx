import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Input } from "@/components/ui/input";
import { Lock, Edit2, CheckCircle, Shield, User, LogOut, Bell, ChevronRight, Zap, Flame, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { toast } from "sonner";

const PROFILE_DATA = {
  name: "Rohan Sharma",
  mobile: "+91 98765 43210",
  email: "rohan.sharma@gmail.com",
  address: "123, Sector 7, Guwahati, Assam - 781001",
  aadhaar: "XXXX-XXXX-1234",
  accounts: [
    { dept: "Electricity", id: "APCL-8842", icon: Zap,       color: "bg-amber-50 text-amber-600",   border: "border-amber-200" },
    { dept: "Piped Gas",   id: "AGD-2201",  icon: Flame,     color: "bg-red-50 text-red-500",       border: "border-red-200"   },
    { dept: "Municipal",   id: "GMC-4412",  icon: Building2, color: "bg-teal-50 text-teal-600",     border: "border-teal-200"  },
  ],
};

const MENU_ITEMS = [
  { icon: Bell,          label: "Notification Preferences", sub: "Manage SMS & push alerts" },
  { icon: Shield,        label: "Privacy & Security",       sub: "2FA, sessions, data"       },
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const accessibility = useAccessibility();
  const {
    theme, setTheme,
    dyslexic, setDyslexic,
    privacyMode, setPrivacyMode,
    isOffline, setIsOffline
  } = accessibility;

  const userStr = localStorage.getItem("suvidha_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || PROFILE_DATA.name;
  const userAadhaar = user?.id || PROFILE_DATA.aadhaar;
  const userPhone = user?.phone || PROFILE_DATA.mobile;

  const [editField, setEditField] = useState<string | null>(null);
  const [values, setValues] = useState({ mobile: userPhone, email: PROFILE_DATA.email, address: PROFILE_DATA.address });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [saved, setSaved] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleEdit = (field: string) => { setEditField(field); setOtpStep(false); setSaved(false); };


  const handleSave = () => {
    if (editField === "mobile") { setOtpStep(true); }
    else { setSaved(true); setTimeout(() => { setEditField(null); setSaved(false); }, 1500); }
  };

  const handleVerifyOtp = () => {
    setSaved(true);
    setTimeout(() => { setEditField(null); setOtpStep(false); setSaved(false); }, 1500);
  };

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full pb-8">
        <TopAppBar title="My Profile" />

        <div className="px-4 py-4 space-y-3">
          {/* Avatar card */}
          <div className="bg-suvidha-navy rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-lg text-white">{userName}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">Verified Citizen</span>
              </div>
              <p className="text-white/40 text-xs mt-0.5">Guwahati, Assam</p>
            </div>
          </div>

          {/* Aadhaar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aadhaar Number</span>
              <span className="ml-auto px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">Encrypted</span>
            </div>
            <div className="font-mono text-base font-bold tracking-widest text-gray-800">{userAadhaar}</div>
          </div>

          {/* Editable fields */}
          {[
            { key: "mobile",  label: "Mobile Number",  sensitive: true  },
            { key: "email",   label: "Email Address",  sensitive: false },
            { key: "address", label: "Address",        sensitive: false },
          ].map(field => (
            <div key={field.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{field.label}</span>
                {editField !== field.key && (
                  <button
                    onClick={() => handleEdit(field.key)}
                    className="flex items-center gap-1 text-xs font-bold text-suvidha-navy hover:underline"
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
                        {field.sensitive && <p className="text-xs text-gray-400">An OTP will be sent to verify this change.</p>}
                        <div className="flex gap-2">
                          <button onClick={() => setEditField(null)} className="flex-1 h-10 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">Cancel</button>
                          <button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-suvidha-navy text-white text-sm font-bold" data-testid={`button-save-${field.key}`}>
                            {saved ? "Saved!" : field.sensitive ? "Send OTP" : "Save"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700">Enter the 6-digit OTP sent to {values.mobile}</p>
                        <div className="flex gap-2 justify-between">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              maxLength={1}
                              value={otp[i] || ""}
                              onChange={e => {
                                const arr = otp.split("");
                                arr[i] = e.target.value;
                                setOtp(arr.join(""));
                                if (e.target.value) (document.getElementById(`otp-p-${i + 1}`) as HTMLInputElement)?.focus();
                              }}
                              id={`otp-p-${i}`}
                              className={cn("w-10 h-12 text-center border-2 rounded-xl text-lg font-bold focus:outline-none transition-colors",
                                otp[i] ? "border-suvidha-saffron bg-suvidha-saffron/5" : "border-gray-200")}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setOtpStep(false)} className="flex-1 h-10 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">Back</button>
                          <button onClick={handleVerifyOtp} className="flex-1 h-10 rounded-xl bg-suvidha-saffron text-white text-sm font-bold" data-testid="button-verify-otp">
                            {saved ? <span className="flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" />Verified!</span> : "Verify OTP"}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-sm text-gray-800">
                    {values[field.key as keyof typeof values]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Consumer accounts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Linked Consumer Accounts</span>
            <div className="space-y-2.5">
              {PROFILE_DATA.accounts.map(acc => {
                const Icon = acc.icon;
                return (
                  <div key={acc.dept} className={cn("flex items-center gap-3 p-2.5 rounded-xl border", acc.border, acc.color.split(" ")[0])}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", acc.color.split(" ")[0])}>
                      <Icon className={cn("w-4 h-4", acc.color.split(" ")[1])} />
                    </div>
                    <span className={cn("font-semibold text-sm flex-1", acc.color.split(" ")[1])}>{acc.dept}</span>
                    <span className="font-mono text-xs font-bold text-gray-600">{acc.id}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accessibility Settings Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-100 pb-2">
              Accessibility & Simulator
            </span>
            
            <div className="space-y-4">
              {/* Theme selection buttons */}
              <div>
                <span className="text-xs font-semibold block text-gray-700 mb-2">Contrast Theme Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "light", label: "Standard" },
                    { key: "dark", label: "Dark Mode" },
                    { key: "high-contrast", label: "High Contrast" }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setTheme(item.key as any)}
                      className={cn(
                        "py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all",
                        theme === item.key
                          ? "border-suvidha-saffron bg-suvidha-saffron/10 text-suvidha-navy"
                          : "border-gray-200 text-gray-500 bg-white hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dyslexic toggle */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div>
                  <span className="text-xs font-semibold block text-gray-700">Dyslexic-Friendly Font</span>
                  <span className="text-[10px] text-gray-400 block">OpenDyslexic spacing support</span>
                </div>
                <input
                  type="checkbox"
                  checked={dyslexic}
                  onChange={e => setDyslexic(e.target.checked)}
                  className="rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4.5 h-4.5 cursor-pointer"
                />
              </div>

              {/* Privacy Shield toggle */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div>
                  <span className="text-xs font-semibold block text-gray-700">Privacy Input Shield</span>
                  <span className="text-[10px] text-gray-400 block">Blur text input fields on inactivity</span>
                </div>
                <input
                  type="checkbox"
                  checked={privacyMode}
                  onChange={e => setPrivacyMode(e.target.checked)}
                  className="rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4.5 h-4.5 cursor-pointer"
                />
              </div>

              {/* Offline Sim Mode toggle */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div>
                  <span className="text-xs font-semibold block text-gray-700">Simulate Offline Mode</span>
                  <span className="text-[10px] text-gray-400 block">Test offline queue sync functionality</span>
                </div>
                <input
                  type="checkbox"
                  checked={isOffline}
                  onChange={e => setIsOffline(e.target.checked)}
                  className="rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4.5 h-4.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {MENU_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <AnimatePresence>
            {!logoutConfirm ? (
              <motion.button
                key="logout"
                onClick={() => setLogoutConfirm(true)}
                className="w-full py-3.5 rounded-2xl border-2 border-suvidha-navy/20 text-suvidha-navy font-bold text-sm
                           flex items-center justify-center gap-2 hover:bg-suvidha-navy/5 active:bg-suvidha-navy/10 transition-colors"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            ) : (
              <motion.div
                key="logout-confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3"
              >
                <p className="font-semibold text-sm text-gray-800 text-center">Sign out of SUVIDHA?</p>
                <div className="flex gap-3">
                  <button onClick={() => setLogoutConfirm(false)} className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">Cancel</button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("suvidha_user");
                      setLocation("/login");
                    }}
                    className="flex-1 h-11 rounded-xl bg-suvidha-navy text-white text-sm font-bold"
                    data-testid="button-confirm-logout"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DPDP Act Account Erasure */}
          <AnimatePresence>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="w-full py-3 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                data-testid="button-delete-account"
              >
                Delete My Account & Data
              </button>
            ) : (
              <motion.div
                key="delete-confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-4 space-y-3"
              >
                <p className="font-heading font-bold text-sm text-red-800 text-center">Delete account permanently?</p>
                <p className="text-[10px] text-red-600 text-center leading-normal">
                  In compliance with DPDP Act 2023, this will completely wipe your local profile, pending offline requests, tracking tickets, and visual preferences from this device. This action is irreversible.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(false)} className="flex-1 h-11 rounded-xl border-2 border-red-200 bg-white text-sm font-bold text-red-800">Cancel</button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      toast.success("Account & Local Data Purged!", {
                        description: "All local database caches, tickets, and configurations successfully deleted."
                      });
                      setLocation("/");
                    }}
                    className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-bold"
                    data-testid="button-confirm-delete"
                  >
                    Yes, Purge Data
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

