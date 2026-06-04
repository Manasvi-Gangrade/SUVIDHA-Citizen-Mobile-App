import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@suvidha.gov.in" && password === "admin123") {
        setLocation("/admin");
      } else {
        setError("Invalid credentials. Use admin@suvidha.gov.in / admin123");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-suvidha-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8 hover:text-suvidha-navy transition-colors"
          data-testid="button-back-citizen"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Citizen App
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-suvidha-navy rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">SUVIDHA Administrative Dashboard</p>
            <div className="mt-3 px-3 py-1 bg-suvidha-navy/10 rounded-full text-xs font-bold text-suvidha-navy uppercase tracking-wider">
              Government of Assam
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Official Email ID
              </label>
              <Input
                type="email"
                placeholder="admin@suvidha.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
                data-testid="input-admin-email"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl pr-12"
                  data-testid="input-admin-password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full h-12 rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white font-semibold text-base mt-2"
              data-testid="button-admin-signin"
            >
              {loading ? "Signing in..." : "Sign In to Admin Panel"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo credentials: admin@suvidha.gov.in / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
