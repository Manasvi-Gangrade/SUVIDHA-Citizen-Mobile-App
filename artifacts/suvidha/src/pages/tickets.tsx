import { useState } from "react";
import { Link } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { CheckCircle2, Circle, Clock, ChevronDown, Zap, Flame, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_TICKETS = [
  { id: "SVD-8892", title: "Streetlight repair pending",  dept: "Municipal",   deptColor: "text-teal-600",    deptBg: "bg-teal-50",  icon: Building2, date: "Oct 12, 2023", status: "Assigned",     step: 3, active: true  },
  { id: "SVD-8845", title: "New Electricity Connection",  dept: "Electricity", deptColor: "text-amber-600",   deptBg: "bg-amber-50", icon: Zap,       date: "Oct 10, 2023", status: "Under Review", step: 2, active: true  },
  { id: "SVD-8100", title: "Gas Subsidy Renewal",         dept: "Piped Gas",   deptColor: "text-red-500",     deptBg: "bg-red-50",   icon: Flame,     date: "Oct 5, 2023",  status: "Resolved",     step: 4, active: false },
];

const STATUS_STYLE: Record<string, string> = {
  "Resolved":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Assigned":     "bg-amber-50 text-amber-700 border-amber-200",
  "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
};

const TABS = [
  { key: "all",      label: "All",      count: 3  },
  { key: "active",   label: "Active",   count: 2  },
  { key: "resolved", label: "Resolved", count: 1  },
];

export default function Tickets() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState("all");

  const filtered = ALL_TICKETS.filter(t => {
    if (tab === "active")   return t.active;
    if (tab === "resolved") return !t.active;
    return true;
  });

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 pb-6 min-h-full">
        <TopAppBar title="My Tickets" />

        {/* Tab bar */}
        <div className="bg-white border-b border-gray-100 px-4 pt-3 pb-0 shrink-0">
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all border-b-2",
                  tab === t.key
                    ? "text-suvidha-navy border-suvidha-navy bg-suvidha-navy/5"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                )}
                data-testid={`tab-tickets-${t.key}`}
              >
                {t.label}
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  tab === t.key ? "bg-suvidha-navy text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket cards */}
        <div className="p-4 flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-12">No tickets found.</div>
          )}

          {filtered.map(ticket => {
            const DeptIcon = ticket.icon;
            const isOpen = expanded === ticket.id;
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  className="w-full text-left p-4 active:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : ticket.id)}
                  data-testid={`ticket-card-${ticket.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ticket.deptBg}`}>
                      <DeptIcon className={`w-5 h-5 ${ticket.deptColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${ticket.deptColor}`}>
                          {ticket.dept}
                        </span>
                        <span className="text-[10px] text-gray-400">• {ticket.date}</span>
                      </div>
                      <p className="font-semibold text-sm text-gray-800 leading-snug">{ticket.title}</p>
                      <p className="font-mono text-[10px] text-gray-400 mt-1">{ticket.id}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[ticket.status] ?? ""}`}>
                        {ticket.status}
                      </span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-gray-400 transition-transform",
                        isOpen ? "rotate-180" : ""
                      )} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-1 border-t border-gray-100 bg-gray-50">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2">Timeline</p>
                    <div className="relative pl-5">
                      <div className="absolute left-[7px] top-1 bottom-2 w-px bg-gray-200" />
                      <TimelineStep title="Submitted"           date={ticket.date}   active={ticket.step >= 1} done={ticket.step > 1} />
                      <TimelineStep title="Under Review"        date="Oct 13, 2023"  active={ticket.step >= 2} done={ticket.step > 2} />
                      <TimelineStep title="Assigned to Officer" desc="Ramesh Kumar (Ward 4)" active={ticket.step >= 3} done={ticket.step > 3} />
                      <TimelineStep title="Resolved"                                 active={ticket.step >= 4} done={ticket.step > 4} last />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}

function TimelineStep({ title, desc, date, active, done, last }: {
  title: string; desc?: string; date?: string;
  active?: boolean; done?: boolean; last?: boolean;
}) {
  return (
    <div className={cn("relative pb-5", last ? "pb-0" : "")}>
      <div className="absolute -left-5 top-0 z-10">
        {done ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
        ) : active ? (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-suvidha-saffron bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-suvidha-saffron rounded-full" />
          </div>
        ) : (
          <Circle className="w-3.5 h-3.5 text-gray-300" />
        )}
      </div>
      <div className={cn("pl-1", active ? "opacity-100" : "opacity-40")}>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {(desc || date) && (
          <p className="text-xs text-gray-400 mt-0.5">{desc}{desc && date ? " • " : ""}{date}</p>
        )}
      </div>
    </div>
  );
}
