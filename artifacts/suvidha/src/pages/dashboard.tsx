import { useState } from "react";
import { Link, useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import { 
  FileWarning, 
  Zap, 
  FileText, 
  Search,
  BellRing,
  ChevronRight,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const timeHour = new Date().getHours();
  const greeting = timeHour < 12 ? "Good Morning" : timeHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar />
        
        <div className="px-5 pt-6 pb-4 bg-suvidha-navy rounded-b-3xl text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px]" />
          <h2 className="text-sm font-medium text-white/80">{greeting},</h2>
          <h1 className="text-2xl font-heading font-bold mb-6">Rohan Sharma</h1>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10">
              <div className="text-3xl font-bold text-suvidha-saffron mb-1">2</div>
              <div className="text-xs text-white/80 font-medium">Active Tasks</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10">
              <div className="text-3xl font-bold text-success mb-1">14</div>
              <div className="text-xs text-white/80 font-medium">Resolved</div>
            </div>
          </div>
        </div>

        {/* Alerts Ticker */}
        <div className="mx-5 mt-[-16px] relative z-10 bg-white rounded-xl shadow-md p-3 border border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-foreground whitespace-nowrap animate-marquee">
              Water supply interruption in Sector 4 from 2 PM to 5 PM today.
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <ActionCard 
              icon={FileWarning} 
              label="New Grievance" 
              color="bg-destructive/10 text-destructive" 
              onClick={() => setLocation("/grievance/new")}
            />
            <ActionCard 
              icon={Zap} 
              label="New Connection" 
              color="bg-suvidha-saffron/10 text-suvidha-saffron" 
              onClick={() => setLocation("/services/electricity")}
            />
            <ActionCard 
              icon={FileText} 
              label="Bill Dispute" 
              color="bg-suvidha-teal/10 text-suvidha-teal" 
              onClick={() => setLocation("/services/municipal")}
            />
            <ActionCard 
              icon={Search} 
              label="Track Request" 
              color="bg-suvidha-navy/10 text-suvidha-navy" 
              onClick={() => setLocation("/tickets")}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold text-foreground">Recent Activity</h3>
            <Link href="/tickets" className="text-sm font-semibold text-suvidha-navy">View All</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <Card className="p-4 rounded-2xl shadow-sm border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm mb-1">Streetlight repair pending</div>
                <div className="text-xs text-muted-foreground">ID: SVD-8892 • 2 days ago</div>
              </div>
              <div className="px-3 py-1 bg-suvidha-saffron/10 text-suvidha-saffron text-xs font-bold rounded-full">
                Assigned
              </div>
            </Card>
            <Card className="p-4 rounded-2xl shadow-sm border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm mb-1">Gas Subsidy Renewal</div>
                <div className="text-xs text-muted-foreground">ID: SVD-8100 • 5 days ago</div>
              </div>
              <div className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                Resolved
              </div>
            </Card>
          </div>
        </div>

        {/* FAB */}
        <button 
          onClick={() => setLocation("/grievance/new")}
          className="fixed bottom-24 right-5 w-14 h-14 bg-suvidha-saffron rounded-full shadow-[0_8px_16px_rgba(255,128,0,0.4)] flex items-center justify-center text-white z-40 hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </PageTransition>
  );
}

function ActionCard({ icon: Icon, label, color, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className="p-4 rounded-2xl shadow-sm border-border cursor-pointer hover:shadow-md transition-all active:scale-95"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color.split(' ')[0]}`}>
        <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
      </div>
      <div className="font-semibold text-sm leading-tight text-foreground">{label}</div>
    </Card>
  );
}