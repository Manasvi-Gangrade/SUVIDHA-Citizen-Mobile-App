import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Shield, ArrowLeft, Check, Lock, Info, Smartphone, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type LoginStep = "language_consent" | "dept_identifier" | "phone" | "otp";

export default function Login() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { consentAccepted, setConsentAccepted } = useAccessibility();
  
  // Parse department from query params
  const params = new URLSearchParams(search);
  const deptParam = params.get("dept") as "electricity" | "gas" | "municipal" | null;

  useEffect(() => {
    const user = localStorage.getItem("suvidha_user");
    if (user) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  const [step, setStep] = useState<LoginStep>("language_consent");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | "as">("en");
  const [selectedDept, setSelectedDept] = useState<"electricity" | "gas" | "municipal">(deptParam || "electricity");
  const [identifierType, setIdentifierType] = useState<"ca" | "aadhaar">("ca");
  const [identifierVal, setIdentifierVal] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Consent checkboxes
  const [termsAccepted, setTermsAccepted] = useState(consentAccepted);
  const [dataSharingAccepted, setDataSharingAccepted] = useState(consentAccepted);
  
  // Privacy Shielding
  const [isAadhaarMasked, setIsAadhaarMasked] = useState(true);

  // Translate labels based on selection
  const t = {
    en: {
      title: "SUVIDHA Login Gateway",
      subtitle: "Select preferred language & accept terms",
      langSelect: "Select Preferred Language",
      consentTitle: "DPDP Act 2023 Consent",
      consent1: "I agree to the Terms of Service & Privacy Policy.",
      consent2: "I authorize SUVIDHA to securely access my utility account identifiers for service delivery.",
      btnNext: "Continue",
      btnBack: "Back",
      deptTitle: "Select Department & ID",
      deptSub: "Choose a department to link your session",
      electricity: "Electricity",
      gas: "Piped Gas",
      municipal: "Municipal",
      idLabel: {
        ca: "Consumer Account (CA) ID",
        aadhaar: "Aadhaar Number"
      },
      idPlaceholder: {
        ca: "e.g. APCL-8842",
        aadhaar: "12-digit Aadhaar Number"
      },
      phoneTitle: "Mobile Verification",
      phoneSub: "Enter mobile number associated with your ID",
      otpTitle: "Verify Security OTP",
      otpSub: "Sent dynamic code to",
      btnVerify: "Verify & Proceed",
      btnOtp: "Get OTP"
    },
    hi: {
      title: "सुविधा लॉगिन गेटवे",
      subtitle: "अपनी पसंद की भाषा चुनें और शर्तों को स्वीकार करें",
      langSelect: "पसंदीदा भाषा चुनें",
      consentTitle: "डीपीडीपी अधिनियम 2023 सहमति",
      consent1: "मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ।",
      consent2: "मैं सुविधा को सेवा वितरण के लिए मेरे उपयोगिता खाता पहचानकर्ताओं तक सुरक्षित रूप से पहुंचने के लिए अधिकृत करता हूँ।",
      btnNext: "जारी रखें",
      btnBack: "पीछे",
      deptTitle: "विभाग और आईडी चुनें",
      deptSub: "अपना सत्र जोड़ने के लिए एक विभाग चुनें",
      electricity: "बिजली",
      gas: "पाइप गैस",
      municipal: "नगर पालिका",
      idLabel: {
        ca: "उपभोक्ता खाता (CA) आईडी",
        aadhaar: "आधार संख्या"
      },
      idPlaceholder: {
        ca: "उदा. APCL-8842",
        aadhaar: "12-अंकीय आधार संख्या"
      },
      phoneTitle: "मोबाइल सत्यापन",
      phoneSub: "अपनी आईडी से जुड़े मोबाइल नंबर दर्ज करें",
      otpTitle: "सुरक्षा OTP सत्यापित करें",
      otpSub: "डायनामिक कोड भेजा गया है",
      btnVerify: "सत्यापित करें और आगे बढ़ें",
      btnOtp: "ओटीपी प्राप्त करें"
    },
    as: {
      title: "সুবিধা লগইন গেটৱে",
      subtitle: "পছন্দৰ ভাষা বাছনি কৰক আৰু চৰ্তসমূহ স্বীকাৰ কৰক",
      langSelect: "পছন্দৰ ভাষা বাছনি কৰক",
      consentTitle: "DPDP আইন ২০২৩ সন্মতি",
      consent1: "মই সেৱাৰ চৰ্তাৱলী আৰু গোপনীয়তা নীতিৰ সৈতে সন্মত হৈছোঁ।",
      consent2: "মই সুবিধা পৰ্টেলক সেৱা প্ৰদানৰ বাবে মোৰ উপযোগিতা একাউণ্ট চিনাক্তকাৰীসমূহ সুৰক্ষিতভাৱে ব্যৱহাৰ কৰিবলৈ কৰ্তৃত্ব দিছোঁ।",
      btnNext: "আগলৈ যাওক",
      btnBack: "পাছলৈ",
      deptTitle: "বিভাগ আৰু আইডি বাছনি কৰক",
      deptSub: "আপোনাৰ সেশ্বন সংযোগ কৰিবলৈ এটা বিভাগ বাছক",
      electricity: "বিদ্যুৎ",
      gas: "পাইপ গেছ",
      municipal: "পৌৰসভা",
      idLabel: {
        ca: "গ্ৰাহক একাউণ্ট (CA) আইডি",
        aadhaar: "আধাৰ নম্বৰ"
      },
      idPlaceholder: {
        ca: "उदा. APCL-8842",
        aadhaar: "১২-টা সংখ্যাৰ আধাৰ নম্বৰ"
      },
      phoneTitle: "মোবাইল সত্যাপন",
      phoneSub: "আপোনাৰ আইডিৰ সৈতে জড়িত মোবাইল নম্বৰ লিখক",
      otpTitle: "সুৰক্ষা OTP সত্যাপন কৰক",
      otpSub: "ডাইনামিক ক’ড প্ৰেৰণ কৰা হৈছে",
      btnVerify: "সত্যপন কৰক আৰু আগবাঢ়ক",
      btnOtp: "অ’টিপি প্ৰাপ্ত কৰক"
    }
  }[selectedLanguage];

  const handleLanguageConsentSubmit = () => {
    setConsentAccepted(true);
    setStep("dept_identifier");
  };

  const handleDeptIdSubmit = () => {
    if (identifierVal.trim().length > 3) {
      setStep("phone");
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate setting citizen credentials in localStorage
    localStorage.setItem("suvidha_user", JSON.stringify({
      name: "Rohan Sharma",
      phone: `+91 ${phone}`,
      dept: selectedDept,
      id: identifierVal
    }));
    setLocation("/dashboard");
  };

  // Aadhaar masking formatter helper
  const formatAadhaar = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 12);
    if (isAadhaarMasked) {
      // e.g. XXXX-XXXX-1234
      const visible = raw.slice(8);
      let masked = "";
      if (raw.length > 0) masked += "XXXX";
      if (raw.length > 4) masked += "-XXXX";
      if (raw.length > 8) masked += `-${visible}`;
      return masked;
    }
    // standard formatting: 1234-5678-9012
    let formatted = "";
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += "-";
      formatted += raw[i];
    }
    return formatted;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/-/g, "");
    if (identifierType === "aadhaar") {
      // Allow only numbers
      if (/^\d*$/.test(rawVal)) {
        setIdentifierVal(rawVal.slice(0, 12));
      }
    } else {
      setIdentifierVal(e.target.value);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-background pt-8 px-6 pb-24 relative overflow-hidden">
        {/* Background Aurora Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-suvidha-teal/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-10 right-0 w-60 h-60 bg-suvidha-saffron/10 rounded-full blur-[70px]" />
        </div>

        {/* Back navigation */}
        {step === "language_consent" ? (
          <button
            onClick={() => setLocation("/onboarding")}
            className="self-start p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors mb-4 flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        ) : (
          <button
            onClick={() => {
              if (step === "dept_identifier") setStep("language_consent");
              else if (step === "phone") setStep("dept_identifier");
              else if (step === "otp") setStep("phone");
            }}
            className="self-start p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors mb-4 flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> {t.btnBack}
          </button>
        )}

        <div className="flex flex-col items-center mt-4 mb-6">
          <div className="w-14 h-14 bg-suvidha-navy rounded-2xl flex items-center justify-center mb-4 shadow-md border-b-3 border-suvidha-saffron">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-heading font-bold text-foreground text-center">
            {step === "language_consent" && t.title}
            {step === "dept_identifier" && t.deptTitle}
            {step === "phone" && t.phoneTitle}
            {step === "otp" && t.otpTitle}
          </h1>
          <p className="text-muted-foreground text-center mt-1 text-xs max-w-xs">
            {step === "language_consent" && t.subtitle}
            {step === "dept_identifier" && t.deptSub}
            {step === "phone" && t.phoneSub}
            {step === "otp" && `${t.otpSub} +91 ${phone}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Language & DPDP Consent */}
          {step === "language_consent" && (
            <motion.div
              key="lang_consent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5 flex-1"
            >
              {/* Language Selection Gateway */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  {t.langSelect}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: "en", label: "English" },
                    { code: "hi", label: "हिन्दी" },
                    { code: "as", label: "অসমীয়া" }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code as any)}
                      className={cn(
                        "h-12 rounded-xl font-bold border-2 transition-all text-sm flex items-center justify-center gap-1",
                        selectedLanguage === lang.code
                          ? "border-suvidha-saffron bg-suvidha-saffron/10 text-suvidha-navy"
                          : "border-border text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {selectedLanguage === lang.code && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DPDP Act consent card */}
              <div className="bg-card rounded-2xl border border-card-border p-4.5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-suvidha-navy border-b border-border pb-2.5">
                  <Lock className="w-4.5 h-4.5 text-suvidha-saffron" />
                  <span className="font-heading font-bold text-xs uppercase tracking-wider">{t.consentTitle}</span>
                  <span className="ml-auto bg-suvidha-navy/10 text-suvidha-navy text-[9px] font-bold px-2 py-0.5 rounded-full">Compliance Shield</span>
                </div>
                
                <div className="space-y-3">
                  {/* Consent Checkbox 1 */}
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4 h-4"
                    />
                    <span className="text-[11px] leading-normal font-semibold text-card-foreground">
                      {t.consent1}
                    </span>
                  </label>

                  {/* Consent Checkbox 2 */}
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dataSharingAccepted}
                      onChange={e => setDataSharingAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-suvidha-saffron focus:ring-suvidha-saffron w-4 h-4"
                    />
                    <span className="text-[11px] leading-normal font-semibold text-card-foreground">
                      {t.consent2}
                    </span>
                  </label>
                </div>
                
                <div className="flex items-start gap-2 bg-suvidha-navy/5 p-3 rounded-xl border border-suvidha-navy/10">
                  <Info className="w-4 h-4 text-suvidha-navy shrink-0 mt-0.5" />
                  <p className="text-[9px] leading-normal text-muted-foreground font-semibold">
                    In compliance with India's DPDP Act 2023, your data remains fully encrypted client-side. Decryption keys never leave your secure enclave.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleLanguageConsentSubmit}
                className="w-full h-13 text-base rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white mt-auto font-bold shadow-sm"
                disabled={!termsAccepted || !dataSharingAccepted}
              >
                {t.btnNext} →
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Department Selector & Account ID */}
          {step === "dept_identifier" && (
            <motion.div
              key="dept_identifier"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5 flex-1"
            >
              {/* Department Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Select Organization
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "electricity", label: t.electricity, iconBg: "bg-amber-50 text-amber-600 border-amber-200" },
                    { key: "gas", label: t.gas, iconBg: "bg-orange-50 text-orange-500 border-orange-200" },
                    { key: "municipal", label: t.municipal, iconBg: "bg-teal-50 text-teal-600 border-teal-200" }
                  ].map(dept => (
                    <button
                      key={dept.key}
                      onClick={() => setSelectedDept(dept.key as any)}
                      className={cn(
                        "p-3.5 rounded-xl border-2 transition-all flex items-center justify-between text-left",
                        selectedDept === dept.key
                          ? "border-suvidha-navy bg-suvidha-navy/5 font-bold"
                          : "border-border hover:bg-muted/30"
                      )}
                    >
                      <span className="text-sm font-semibold">{dept.label}</span>
                      {selectedDept === dept.key && <div className="w-5 h-5 rounded-full bg-suvidha-navy text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Identifier Type Choice */}
              <div className="space-y-3">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => { setIdentifierType("ca"); setIdentifierVal(""); }}
                    className={cn("flex-1 pb-2 text-xs font-bold border-b-2 uppercase tracking-widest",
                      identifierType === "ca" ? "border-suvidha-saffron text-suvidha-navy" : "border-transparent text-muted-foreground")}
                  >
                    Utility Account ID
                  </button>
                  <button
                    onClick={() => { setIdentifierType("aadhaar"); setIdentifierVal(""); }}
                    className={cn("flex-1 pb-2 text-xs font-bold border-b-2 uppercase tracking-widest",
                      identifierType === "aadhaar" ? "border-suvidha-saffron text-suvidha-navy" : "border-transparent text-muted-foreground")}
                  >
                    Aadhaar Verification
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold block text-card-foreground">
                    {t.idLabel[identifierType]}
                  </label>
                  
                  <div className="relative flex items-center">
                    <Input
                      type={identifierType === "aadhaar" ? "text" : "text"}
                      className="h-12 pr-10 rounded-xl bg-card border-border"
                      placeholder={t.idPlaceholder[identifierType]}
                      value={identifierType === "aadhaar" ? formatAadhaar(identifierVal) : identifierVal}
                      onChange={handleIdentifierChange}
                    />
                    
                    {identifierType === "aadhaar" && (
                      <button
                        type="button"
                        onClick={() => setIsAadhaarMasked(!isAadhaarMasked)}
                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                      >
                        {isAadhaarMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDeptIdSubmit}
                className="w-full h-13 text-base rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white mt-auto font-bold shadow-sm"
                disabled={identifierVal.trim().length < (identifierType === "aadhaar" ? 12 : 4)}
              >
                {t.btnNext} →
              </Button>
            </motion.div>
          )}

          {/* STEP 3: Phone Number */}
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5 flex-1"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-semibold text-muted-foreground text-sm">+91</span>
                  <Input
                    type="tel"
                    maxLength={10}
                    className="pl-12 h-13 text-lg bg-card border-border rounded-xl"
                    placeholder="99999 99999"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                  />
                </div>
              </div>

              <div className="bg-muted/30 p-3.5 rounded-xl border border-border flex items-start gap-2.5">
                <Smartphone className="w-4.5 h-4.5 text-suvidha-navy shrink-0 mt-0.5" />
                <p className="text-[10px] leading-normal text-muted-foreground font-semibold">
                  A dynamic security verification code will be sent to this number. SMS charges may apply.
                </p>
              </div>

              <Button
                onClick={handlePhoneSubmit}
                className="w-full h-13 text-base rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white mt-auto font-bold shadow-sm"
                disabled={phone.length !== 10}
              >
                {t.btnOtp}
              </Button>
            </motion.div>
          )}

          {/* STEP 4: OTP verification */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6 flex-1"
            >
              <div className="flex justify-between gap-2 px-1">
                {otp.map((digit, i) => (
                  <Input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    className="w-11 h-13 text-center text-lg font-bold bg-card border-border rounded-xl focus:border-suvidha-saffron focus:ring-suvidha-saffron"
                    value={digit}
                    onChange={e => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value.replace(/\D/g, "");
                      setOtp(newOtp);
                      if (e.target.value && i < 5) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <div className="text-center text-xs font-semibold">
                <span className="text-muted-foreground">Didn't receive code? </span>
                <button type="button" className="text-suvidha-navy hover:underline">Resend in 0:25</button>
              </div>

              <Button
                onClick={handleOtpSubmit}
                className="w-full h-13 text-base rounded-xl bg-suvidha-saffron hover:bg-suvidha-saffron/90 text-white mt-auto font-bold shadow-sm"
                disabled={otp.some(d => !d)}
              >
                {t.btnVerify}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}