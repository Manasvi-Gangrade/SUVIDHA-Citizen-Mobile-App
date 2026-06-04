import { useState } from "react";
import { Link } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, Building2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TICKETS = [
  { id: "SVD-8892", title: "Streetlight repair pending", dept: "Municipal", date: "Oct 12, 2023", status: "Assigned", step: 3 },
  { id: "SVD-8845", title: "New Electricity Connection", dept: "Electricity", date: "Oct 10, 2023", status: "Under Review", step: 2 },
  { id: "SVD-8100", title: "Gas Subsidy Renewal", dept: "Piped Gas", date: "Oct 5, 2023", status: "Resolved", step: 4 },
];

export default function Tickets() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title="My Tickets" />
        
        <div className="p-5">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="px-4 py-2 bg-suvidha-navy text-white text-sm font-semibold rounded-full shrink-0">All Tickets</div>
            <div className="px-4 py-2 bg-white border border-border text-foreground text-sm font-semibold rounded-full shrink-0">Active (2)</div>
            <div className="px-4 py-2 bg-white border border-border text-foreground text-sm font-semibold rounded-full shrink-0">Resolved (14)</div>
          </div>

          <div className="flex flex-col gap-4">
            {TICKETS.map(ticket => (
              <Card 
                key={ticket.id} 
                className="overflow-hidden border-border shadow-sm rounded-2xl transition-all"
              >
                <div 
                  className="p-4 cursor-pointer active:bg-gray-50 flex items-start justify-between"
                  onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-suvidha-teal uppercase tracking-wider">{ticket.dept}</span>
                      <span className="text-xs text-muted-foreground">• {ticket.date}</span>
                    </div>
                    <h3 className="font-semibold text-[15px] text-foreground mb-2 leading-tight">{ticket.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        ticket.status === "Resolved" ? "bg-success" : 
                        ticket.status === "Assigned" ? "bg-suvidha-saffron" : "bg-suvidha-navy"
                      )} />
                      <span className="text-xs font-semibold">{ticket.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-md">{ticket.id}</span>
                    <ChevronRight className={cn("w-5 h-5 text-muted-foreground transition-transform", expanded === ticket.id ? "rotate-90" : "")} />
                  </div>
                </div>

                {expanded === ticket.id && (
                  <div className="px-4 pb-5 pt-2 bg-gray-50 border-t border-border">
                    <div className="relative pl-4 mt-2">
                      <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />
                      
                      <TimelineStep 
                        title="Submitted" 
                        date={ticket.date} 
                        active={ticket.step >= 1} 
                        completed={ticket.step > 1}
                      />
                      <TimelineStep 
                        title="Under Review" 
                        date="Oct 13, 2023" 
                        active={ticket.step >= 2} 
                        completed={ticket.step > 2}
                      />
                      <TimelineStep 
                        title="Assigned to Officer" 
                        desc="Ramesh Kumar (Ward 4)"
                        active={ticket.step >= 3} 
                        completed={ticket.step > 3}
                      />
                      <TimelineStep 
                        title="Resolved" 
                        active={ticket.step >= 4} 
                        completed={ticket.step > 4}
                        last
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function TimelineStep({ title, desc, date, active, completed, last }: any) {
  return (
    <div className={cn("relative pb-6", last ? "pb-2" : "")}>
      <div className="absolute -left-[20px] top-0.5 bg-gray-50 pb-1">
        {completed ? (
          <CheckCircle2 className="w-4 h-4 text-success fill-success/20" />
        ) : active ? (
          <div className="w-4 h-4 rounded-full border-2 border-suvidha-saffron bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-suvidha-saffron rounded-full" />
          </div>
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground/30" />
        )}
      </div>
      <div className={cn("ml-2", active ? "opacity-100" : "opacity-40")}>
        <div className="text-sm font-semibold">{title}</div>
        {(desc || date) && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {desc} {date && `• ${date}`}
          </div>
        )}
      </div>
    </div>
  );
}