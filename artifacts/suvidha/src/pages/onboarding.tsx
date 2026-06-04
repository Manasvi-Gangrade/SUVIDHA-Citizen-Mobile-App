import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Flame, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  { id: "electricity", name: "Electricity", icon: Zap, color: "text-suvidha-saffron", bg: "bg-suvidha-saffron/10" },
  { id: "gas", name: "Piped Gas", icon: Flame, color: "text-destructive", bg: "bg-destructive/10" },
  { id: "municipal", name: "Municipal Corp.", icon: Building2, color: "text-suvidha-teal", bg: "bg-suvidha-teal/10" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState("EN");
  const [dept, setDept] = useState("");

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-background p-6 pt-20">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Welcome to Suvidha</h1>
        <p className="text-muted-foreground text-sm mb-8">Please select your preferred language and primary department.</p>

        <div className="mb-8">
          <label className="text-sm font-semibold mb-3 block text-foreground">Language</label>
          <div className="flex gap-3">
            {["EN", "HI", "AS"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 transition-all font-medium text-sm",
                  lang === l 
                    ? "border-suvidha-navy bg-suvidha-navy/5 text-suvidha-navy" 
                    : "border-border text-muted-foreground hover:border-suvidha-navy/30"
                )}
              >
                {l === "EN" ? "English" : l === "HI" ? "हिंदी" : "অসমীয়া"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="text-sm font-semibold mb-3 block text-foreground">Primary Department</label>
          <div className="flex flex-col gap-3">
            {DEPARTMENTS.map((d) => {
              const Icon = d.icon;
              const isSelected = dept === d.id;
              return (
                <Card 
                  key={d.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all border-2",
                    isSelected ? "border-suvidha-saffron shadow-md" : "border-border shadow-sm hover:border-suvidha-saffron/50"
                  )}
                  onClick={() => setDept(d.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", d.bg)}>
                      <Icon className={cn("w-6 h-6", d.color)} />
                    </div>
                    <span className="font-semibold text-lg">{d.name}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="pt-6">
          <Button 
            className="w-full h-14 text-lg rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/90 text-white"
            disabled={!dept}
            onClick={() => setLocation("/login")}
          >
            Continue
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}