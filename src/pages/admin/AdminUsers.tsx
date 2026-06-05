import { useState } from "react";
import { Search, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const USERS = [
  { id: "CIT-001", name: "Rohan Sharma", mobile: "+91 98765 43210", dept: "Electricity", consumerId: "APCL-8842", lastLogin: "Jun 4, 2026", tickets: 6 },
  { id: "CIT-002", name: "Priya Sharma", mobile: "+91 87654 32109", dept: "Municipal", consumerId: "GMC-4412", lastLogin: "Jun 3, 2026", tickets: 3 },
  { id: "CIT-003", name: "Anand Kumar", mobile: "+91 76543 21098", dept: "Municipal", consumerId: "GMC-5599", lastLogin: "Jun 3, 2026", tickets: 1 },
  { id: "CIT-004", name: "Fatima Begum", mobile: "+91 65432 10987", dept: "Gas", consumerId: "AGD-2201", lastLogin: "Jun 2, 2026", tickets: 2 },
  { id: "CIT-005", name: "Rajesh Nair", mobile: "+91 54321 09876", dept: "Municipal", consumerId: "GMC-7734", lastLogin: "Jun 2, 2026", tickets: 4 },
  { id: "CIT-006", name: "Sunita Devi", mobile: "+91 43210 98765", dept: "Electricity", consumerId: "APCL-3301", lastLogin: "Jun 1, 2026", tickets: 5 },
  { id: "CIT-007", name: "Mohan Das", mobile: "+91 32109 87654", dept: "Gas", consumerId: "AGD-9910", lastLogin: "Jun 1, 2026", tickets: 2 },
  { id: "CIT-008", name: "Kavita Singh", mobile: "+91 21098 76543", dept: "Municipal", consumerId: "GMC-1123", lastLogin: "May 31, 2026", tickets: 1 },
  { id: "CIT-009", name: "Deepak Rao", mobile: "+91 10987 65432", dept: "Electricity", consumerId: "APCL-6678", lastLogin: "May 30, 2026", tickets: 3 },
  { id: "CIT-010", name: "Leela Prasad", mobile: "+91 09876 54321", dept: "Gas", consumerId: "AGD-4455", lastLogin: "May 29, 2026", tickets: 1 },
];

const DEPT_COLORS: Record<string, string> = {
  "Electricity": "bg-suvidha-saffron/10 text-suvidha-saffron",
  "Gas": "bg-destructive/10 text-destructive",
  "Municipal": "bg-suvidha-teal/10 text-suvidha-teal",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.mobile.includes(search) ||
    u.consumerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Registered Citizens</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} citizens found</p>
      </div>

      <Card className="p-4 rounded-2xl border-border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, mobile, or Consumer ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-navy/30"
            data-testid="input-user-search"
          />
        </div>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-suvidha-bg">
              <tr>
                {["Citizen","Consumer ID","Mobile","Department","Last Login","Tickets",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-suvidha-navy/10 flex items-center justify-center shrink-0">
                        <UserCircle className="w-5 h-5 text-suvidha-navy" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground whitespace-nowrap">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-suvidha-teal whitespace-nowrap">{u.consumerId}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.mobile}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${DEPT_COLORS[u.dept] || ""}`}>{u.dept}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.lastLogin}</td>
                  <td className="px-4 py-3 text-center font-bold text-suvidha-navy">{u.tickets}</td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 rounded-lg border border-suvidha-navy/30 text-suvidha-navy text-xs font-semibold hover:bg-suvidha-navy/5"
                      data-testid={`button-view-user-${u.id}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
