import { useLocation, Link } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import ChatBot from "@/components/ChatBot";
import {
  FileWarning, Zap, FileText, Search,
  BellRing, ChevronRight, Plus, Flame, Building2, MapPin
} from "lucide-react";

const ALERTS = [
  "Ward 5: Water supply disruption from 2 PM – 5 PM today",
  "Sector 12: Scheduled power outage on Jun 6 for maintenance",
  "Gas pipeline inspection in Zone 3 – Jun 7",
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const timeHour = new Date().getHours();
  const greeting = timeHour < 12 ? "Good Morning" : timeHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar />

        {/* Hero header */}
        <div className="px-5 pt-5 pb-6 bg-suvidha-navy rounded-b-3xl text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px]" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-suvidha-saffron/10 rounded-full blur-[24px]" />
          <p className="text-sm font-medium text-white/70 mb-0.5">{greeting},</p>
          <h1 className="text-2xl font-heading font-bold mb-5">Rohan Sharma</h1>

          <div className="grid grid-cols-3 gap-3">
            <StatChip label="Active" value="2" color="text-suvidha-saffron" />
            <StatChip label="Resolved" value="14" color="text-success" />
            <StatChip label="Pending" value="1" color="text-white/70" />
          </div>
        </div>

        {/* Alerts ticker */}
        <div className="mx-5 mt-[-14px] relative z-10 bg-white rounded-xl shadow-md border border-border flex items-center gap-3 px-3 py-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <BellRing className="w-3.5 h-3.5 text-destructive" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-foreground whitespace-nowrap animate-marquee">
              {ALERTS.join("  •  ")}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Quick Actions */}
          <section>
            <h3 className="text-base font-heading font-bold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard icon={FileWarning} label="New Grievance" sub="File a complaint" color="bg-destructive/10 text-destructive" onClick={() => setLocation("/grievance/new")} />
              <ActionCard icon={Zap} label="Electricity" sub="Services & requests" color="bg-suvidha-saffron/10 text-suvidha-saffron" onClick={() => setLocation("/services/electricity")} />
              <ActionCard icon={Flame} label="Gas Services" sub="Connection & more" color="bg-orange-100 text-orange-600" onClick={() => setLocation("/services/gas")} />
              <ActionCard icon={Building2} label="Municipal" sub="Water, roads & more" color="bg-suvidha-teal/10 text-suvidha-teal" onClick={() => setLocation("/services/municipal")} />
              <ActionCard icon={Search} label="Track Request" sub="Check status" color="bg-suvidha-navy/10 text-suvidha-navy" onClick={() => setLocation("/track")} />
              <ActionCard icon={FileText} label="My Tickets" sub="View all activity" color="bg-purple-100 text-purple-600" onClick={() => setLocation("/tickets")} />
            </div>
          </section>

          {/* Department shortcuts */}
          <section>
            <h3 className="text-base font-heading font-bold text-foreground mb-3">Department Services</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Electricity Services", icon: Zap, color: "text-suvidha-saffron", bg: "bg-suvidha-saffron/10", route: "/services/electricity" },
                { label: "Piped Gas Services", icon: Flame, color: "text-destructive", bg: "bg-destructive/10", route: "/services/gas" },
                { label: "Municipal Corporation", icon: Building2, color: "text-suvidha-teal", bg: "bg-suvidha-teal/10", route: "/services/municipal" },
              ].map(d => {
                const Icon = d.icon;
                return (
                  <Card
                    key={d.label}
                    className="p-3.5 rounded-xl border-border shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:bg-gray-50"
                    onClick={() => setLocation(d.route)}
                    data-testid={`card-dept-${d.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${d.bg}`}>
                        <Icon className={`w-4.5 h-4.5 ${d.color}`} />
                      </div>
                      <span className="font-semibold text-sm">{d.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-heading font-bold text-foreground">Recent Activity</h3>
              <Link href="/tickets" className="text-sm font-semibold text-suvidha-navy">View All</Link>
            </div>
            <div className="flex flex-col gap-3">
              <ActivityCard
                title="Streetlight repair pending"
                id="SVD-8892"
                dept="Municipal"
                ago="2 days ago"
                status="Assigned"
                statusColor="bg-suvidha-saffron/10 text-suvidha-saffron"
              />
              <ActivityCard
                title="Gas Subsidy Renewal"
                id="SVD-8100"
                dept="Gas"
                ago="5 days ago"
                status="Resolved"
                statusColor="bg-success/10 text-success"
              />
              <ActivityCard
                title="New Electricity Connection"
                id="SVD-8845"
                dept="Electricity"
                ago="1 week ago"
                status="Under Review"
                statusColor="bg-suvidha-navy/10 text-suvidha-navy"
              />
            </div>
          </section>
        </div>

        {/* FAB */}
        <button
          onClick={() => setLocation("/grievance/new")}
          className="fixed bottom-24 right-5 w-14 h-14 bg-suvidha-saffron rounded-full shadow-[0_8px_16px_rgba(255,128,0,0.4)] flex items-center justify-center text-white z-40 hover:scale-105 transition-transform"
          aria-label="File new grievance"
          data-testid="button-fab-grievance"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* ChatBot */}
        <ChatBot />
      </div>
    </PageTransition>
  );
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center">
      <div className={`text-2xl font-bold mb-0.5 ${color}`}>{value}</div>
      <div className="text-[10px] text-white/70 font-medium">{label}</div>
    </div>
  );
}

function ActionCard({ icon: Icon, label, sub, color, onClick }: { icon: React.ElementType; label: string; sub: string; color: string; onClick: () => void }) {
  const [bg, fg] = color.split(" ");
  return (
    <Card
      onClick={onClick}
      className="p-4 rounded-2xl shadow-sm border-border cursor-pointer hover:shadow-md transition-all active:scale-95"
      data-testid={`card-action-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${bg}`}>
        <Icon className={`w-5 h-5 ${fg}`} />
      </div>
      <div className="font-semibold text-sm leading-tight text-foreground">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </Card>
  );
}

function ActivityCard({ title, id, dept, ago, status, statusColor }: {
  title: string; id: string; dept: string; ago: string; status: string; statusColor: string;
}) {
  return (
    <Card className="p-4 rounded-2xl shadow-sm border-border flex items-center justify-between">
      <div>
        <div className="font-semibold text-sm mb-1 text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{id} • {dept} • {ago}</div>
      </div>
      <div className={`px-2.5 py-1 text-xs font-bold rounded-full shrink-0 ${statusColor}`}>
        {status}
      </div>
    </Card>
  );
}
