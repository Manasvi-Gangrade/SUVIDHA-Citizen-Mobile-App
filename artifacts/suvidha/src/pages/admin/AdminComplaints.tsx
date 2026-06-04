import { useState } from "react";
import { Search, ChevronDown, ChevronUp, CheckCircle, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ALL_COMPLAINTS = [
  { id: "SVD-9012", citizen: "Priya Sharma", mobile: "98765XXXXX", dept: "Electricity", category: "Billing Dispute", status: "In Progress", submitted: "Jun 3, 2026", desc: "Electricity bill is significantly higher than usual for the last two months without any increased usage.", officer: "Rajan Verma" },
  { id: "SVD-9011", citizen: "Anand Kumar", mobile: "87654XXXXX", dept: "Municipal", category: "Water Supply", status: "Submitted", submitted: "Jun 3, 2026", desc: "No water supply for the past 3 days in Block C, Sector 7.", officer: "—" },
  { id: "SVD-9010", citizen: "Fatima Begum", mobile: "76543XXXXX", dept: "Gas", category: "Leakage Report", status: "Assigned", submitted: "Jun 2, 2026", desc: "Faint smell of gas near the main pipeline. Urgent inspection needed.", officer: "Suresh Garg" },
  { id: "SVD-9009", citizen: "Rajesh Nair", mobile: "65432XXXXX", dept: "Municipal", category: "Sewage Overflow", status: "Resolved", submitted: "Jun 2, 2026", desc: "Sewage overflowing near the community park entrance.", officer: "Meena Srivastava" },
  { id: "SVD-9008", citizen: "Sunita Devi", mobile: "54321XXXXX", dept: "Electricity", category: "Power Outage", status: "Escalated", submitted: "Jun 1, 2026", desc: "No power in the entire ward since yesterday evening.", officer: "Anil Mishra" },
  { id: "SVD-9007", citizen: "Mohan Das", mobile: "43210XXXXX", dept: "Gas", category: "New Connection", status: "In Progress", submitted: "Jun 1, 2026", desc: "Applied for new domestic piped gas connection, awaiting site inspection.", officer: "Pradeep Jha" },
  { id: "SVD-9006", citizen: "Kavita Singh", mobile: "32109XXXXX", dept: "Municipal", category: "Streetlight Failure", status: "Submitted", submitted: "May 31, 2026", desc: "Three streetlights in lane 4 have been non-functional for a week.", officer: "—" },
  { id: "SVD-9005", citizen: "Deepak Rao", mobile: "21098XXXXX", dept: "Electricity", category: "Meter Malfunction", status: "Resolved", submitted: "May 30, 2026", desc: "Meter display is blank and not recording consumption.", officer: "Kiran Gupta" },
];

const STATUS_STYLES: Record<string, string> = {
  "Submitted":   "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Assigned":    "bg-orange-100 text-orange-700",
  "Resolved":    "bg-green-100 text-green-700",
  "Escalated":   "bg-red-100 text-red-700",
};

export default function AdminComplaints() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = ALL_COMPLAINTS.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.citizen.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || c.dept === deptFilter;
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const toggleSelect = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Complaints</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} complaints found</p>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-2xl border-border shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ID, name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-navy/30"
              data-testid="input-complaint-search"
            />
          </div>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-navy/30"
            data-testid="select-dept-filter"
          >
            {["All","Electricity","Gas","Municipal"].map(d => <option key={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-navy/30"
            data-testid="select-status-filter"
          >
            {["All","Submitted","In Progress","Assigned","Resolved","Escalated"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {selected.size > 0 && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1 text-xs font-semibold border border-border rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
            <button className="px-3 py-1 text-xs font-semibold bg-success/10 text-success border border-success/20 rounded-lg flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Mark Resolved
            </button>
            <button className="px-3 py-1 text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> Escalate
            </button>
          </div>
        )}
      </Card>

      {/* Complaints list */}
      <div className="space-y-3">
        {filtered.map(c => (
          <Card key={c.id} className="rounded-2xl border-border shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            >
              <input
                type="checkbox"
                checked={selected.has(c.id)}
                onChange={() => toggleSelect(c.id)}
                onClick={e => e.stopPropagation()}
                className="mt-1 w-4 h-4 rounded accent-suvidha-navy"
                data-testid={`checkbox-${c.id}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm text-suvidha-teal">{c.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                  <span className="text-xs text-muted-foreground">{c.dept}</span>
                </div>
                <div className="font-semibold text-sm text-foreground">{c.category}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.citizen} • {c.submitted}</div>
              </div>
              {expanded === c.id ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
            </div>

            {expanded === c.id && (
              <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-border space-y-3">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</span>
                  <p className="text-sm mt-1 text-foreground">{c.desc}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Officer</span>
                    <p className="text-sm font-semibold mt-1">{c.officer}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mobile</span>
                    <p className="text-sm font-semibold mt-1">{c.mobile}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button className={cn("px-3 py-1.5 rounded-lg text-xs font-bold bg-success/10 text-success border border-success/20 hover:bg-success/20", c.status === "Resolved" && "opacity-50 pointer-events-none")}>
                    Mark Resolved
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20">
                    Escalate
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-suvidha-navy/10 text-suvidha-navy border border-suvidha-navy/20 hover:bg-suvidha-navy/20">
                    Assign Officer
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
