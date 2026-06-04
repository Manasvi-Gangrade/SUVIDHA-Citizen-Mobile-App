import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, CheckCircle2, Circle, Clock, User, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_TICKETS: Record<string, {
  id: string; title: string; dept: string; status: string; step: number;
  citizen: string; submitted: string; sla: string; officer: string; remarks: string;
}> = {
  "SVD-8892": { id: "SVD-8892", title: "Streetlight repair pending", dept: "Municipal", status: "Assigned", step: 3, citizen: "Rohan Sharma", submitted: "Jun 2, 2026", sla: "Jun 8, 2026", officer: "Rajan Kumar (Ward 4)", remarks: "Assigned to field crew. Repair scheduled." },
  "SVD-8845": { id: "SVD-8845", title: "New Electricity Connection", dept: "Electricity", status: "Under Review", step: 2, citizen: "Rohan Sharma", submitted: "May 31, 2026", sla: "Jun 10, 2026", officer: "Pending Assignment", remarks: "Documents under verification." },
  "SVD-8100": { id: "SVD-8100", title: "Gas Subsidy Renewal", dept: "Piped Gas", status: "Resolved", step: 4, citizen: "Rohan Sharma", submitted: "May 26, 2026", sla: "Jun 1, 2026", officer: "Suresh Jha", remarks: "Subsidy renewed and linked to bank account." },
  "SVD-9012": { id: "SVD-9012", title: "Billing Dispute", dept: "Electricity", status: "In Progress", step: 2, citizen: "Priya Sharma", submitted: "Jun 3, 2026", sla: "Jun 9, 2026", officer: "Rajan Verma", remarks: "Bill being recalculated by finance team." },
};

const TIMELINE_STEPS = ["Submitted", "Under Review", "Assigned to Officer", "Resolved"];

const STATUS_COLOR: Record<string, string> = {
  "Resolved":     "text-success",
  "Assigned":     "text-suvidha-saffron",
  "Under Review": "text-suvidha-navy",
  "In Progress":  "text-suvidha-teal",
  "Submitted":    "text-muted-foreground",
};

export default function TrackRequest() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof MOCK_TICKETS[string] | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleTrack = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const key = query.trim().toUpperCase();
      const found = MOCK_TICKETS[key];
      setResult(found || null);
      setLoading(false);
    }, 900);
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title="Track Request" />

        <div className="p-5 space-y-5">
          <Card className="p-4 rounded-2xl border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Enter your Ticket ID or registered mobile number to track your request.</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. SVD-8892 or 9876543210"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="h-12 rounded-xl flex-1"
                data-testid="input-track-query"
                onKeyDown={e => e.key === "Enter" && handleTrack()}
              />
              <Button
                onClick={handleTrack}
                disabled={loading || !query.trim()}
                className="h-12 px-4 bg-suvidha-navy text-white rounded-xl"
                data-testid="button-track"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Try: SVD-8892, SVD-8845, SVD-8100, SVD-9012</p>
          </Card>

          {loading && (
            <div className="flex flex-col items-center py-10 text-muted-foreground gap-3">
              <div className="w-8 h-8 border-2 border-suvidha-navy border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Fetching status...</span>
            </div>
          )}

          {result === null && !loading && (
            <Card className="p-6 rounded-2xl border-border shadow-sm text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-bold text-base mb-1">No Record Found</h3>
              <p className="text-sm text-muted-foreground">No ticket found for "{query}". Please check the ID and try again.</p>
            </Card>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card className="p-5 rounded-2xl border-border shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold text-suvidha-teal uppercase tracking-wider">{result.dept}</span>
                    <h3 className="font-heading font-bold text-base mt-0.5">{result.title}</h3>
                    <span className="font-mono text-sm text-muted-foreground">{result.id}</span>
                  </div>
                  <span className={cn("text-sm font-bold", STATUS_COLOR[result.status])}>{result.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <InfoRow icon={User} label="Citizen" value={result.citizen} />
                  <InfoRow icon={Calendar} label="Submitted" value={result.submitted} />
                  <InfoRow icon={Clock} label="SLA Date" value={result.sla} />
                  <InfoRow icon={User} label="Officer" value={result.officer} />
                </div>

                {result.remarks && (
                  <div className="p-3 bg-suvidha-navy/5 rounded-xl">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Latest Remark</span>
                    <p className="text-sm mt-1 font-medium">{result.remarks}</p>
                  </div>
                )}
              </Card>

              <Card className="p-5 rounded-2xl border-border shadow-sm">
                <h4 className="font-heading font-bold text-sm mb-4 text-foreground">Progress Timeline</h4>
                <div className="relative pl-4">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />
                  {TIMELINE_STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const done = result.step > stepNum;
                    const active = result.step === stepNum;
                    return (
                      <div key={step} className={cn("relative pb-5 last:pb-0", idx === TIMELINE_STEPS.length - 1 ? "pb-0" : "")}>
                        <div className="absolute -left-[20px] top-0.5 bg-white">
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-success fill-success/20" />
                          ) : active ? (
                            <div className="w-4 h-4 rounded-full border-2 border-suvidha-saffron bg-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-suvidha-saffron rounded-full" />
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/30" />
                          )}
                        </div>
                        <div className={cn("ml-2", active || done ? "opacity-100" : "opacity-40")}>
                          <div className={cn("text-sm font-semibold", active ? "text-suvidha-saffron" : "")}>{step}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-xs font-semibold">{value}</div>
      </div>
    </div>
  );
}
