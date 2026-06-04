import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-background pt-16 px-6">
        <div className="flex flex-col items-center mt-10 mb-12">
          <div className="w-16 h-16 bg-suvidha-navy rounded-2xl flex items-center justify-center mb-6 shadow-lg border-b-4 border-suvidha-saffron">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {step === "phone" ? "Citizen Login" : "Verify OTP"}
          </h1>
          <p className="text-muted-foreground text-center mt-2 text-sm">
            {step === "phone" 
              ? "Enter your mobile number to access civic services" 
              : `Code sent to +91 ${phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6 flex-1">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Mobile Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-medium text-muted-foreground">+91</span>
                <Input 
                  type="tel"
                  maxLength={10}
                  className="pl-12 h-14 text-lg bg-suvidha-bg border-border rounded-xl"
                  placeholder="99999 99999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full h-14 text-lg rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white mt-auto mb-6"
              disabled={phone.length !== 10}
            >
              Get OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6 flex-1">
            <div className="flex justify-between gap-2 px-2">
              {otp.map((digit, i) => (
                <Input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-xl font-bold bg-suvidha-bg border-border rounded-xl focus:border-suvidha-saffron focus:ring-suvidha-saffron"
                  value={digit}
                  onChange={(e) => {
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
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn't receive code? </span>
              <button type="button" className="text-suvidha-navy font-semibold">Resend in 0:30</button>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 text-lg rounded-xl bg-suvidha-saffron hover:bg-suvidha-saffron/90 text-white mt-auto mb-6 shadow-md"
              disabled={otp.some(d => !d)}
            >
              Verify & Proceed
            </Button>
          </form>
        )}
      </div>
    </PageTransition>
  );
}