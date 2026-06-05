import { useLocation } from "wouter";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, Monitor, ChevronRight, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const deptData = [
  { dept: "Electricity", complaints: 120 },
  { dept: "Gas", complaints: 85 },
  { dept: "Municipal", complaints: 157 },
];

const weeklyData = [
  { day: "Mon", resolved: 38 },
  { day: "Tue", resolved: 52 },
  { day: "Wed", resolved: 44 },
  { day: "Thu", resolved: 61 },
  { day: "Fri", resolved: 48 },
  { day: "Sat", resolved: 35 },
  { day: "Sun", resolved: 34 },
];

const recentComplaints = [
  { id: "SVD-9012", citizen: "Priya Sharma", dept: "Electricity", category: "Billing Dispute", status: "In Progress", submitted: "Jun 3, 2026" },
  { id: "SVD-9011", citizen: "Anand Kumar", dept: "Municipal", category: "Water Supply", status: "Submitted", submitted: "Jun 3, 2026" },
  { id: "SVD-9010", citizen: "Fatima Begum", dept: "Gas", category: "Leakage Report", status: "Assigned", submitted: "Jun 2, 2026" },
  { id: "SVD-9009", citizen: "Rajesh Nair", dept: "Municipal", category: "Sewage Overflow", status: "Resolved", submitted: "Jun 2, 2026" },
  { id: "SVD-9008", citizen: "Sunita Devi", dept: "Electricity", category: "Power Outage", status: "Escalated", submitted: "Jun 1, 2026" },
  { id: "SVD-9007", citizen: "Mohan Das", dept: "Gas", category: "New Connection", status: "In Progress", submitted: "Jun 1, 2026" },
];

const initialAlerts = [
  { id: 1, text: "Ward 5: Water supply disruption from 2 PM–5 PM today", active: true },
  { id: 2, text: "Sector 12: Scheduled power outage on Jun 6 for maintenance", active: true },
  { id: 3, text: "Gas pipeline inspection in Zone 3 – Jun 7", active: true },
];

const STATUS_STYLES: Record<string, string> = {
  "Submitted":   "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Assigned":    "bg-orange-100 text-orange-700",
  "Resolved":    "bg-green-100 text-green-700",
  "Escalated":   "bg-red-100 text-red-700",
};

export default function AdminOverview() {
  const [, setLocation] = useLocation();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlertText, setNewAlertText] = useState("");

  const resolveAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const addAlert = () => {
    if (!newAlertText.trim()) return;
    setAlerts([...alerts, { id: Date.now(), text: newAlertText.trim(), active: true }]);
    setNewAlertText("");
    setShowAddAlert(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Today is Jun 4, 2026 — Welcome back, Administrator</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={AlertTriangle} label="Complaints Today" value="47" color="text-suvidha-saffron" bg="bg-suvidha-saffron/10" />
        <KPICard icon={CheckCircle2} label="Resolved This Week" value="312" color="text-success" bg="bg-success/10" />
        <KPICard icon={Clock} label="Avg. Resolution" value="2.4 days" color="text-suvidha-teal" bg="bg-suvidha-teal/10" />
        <KPICard icon={Monitor} label="Active Kiosks" value="8/10" color="text-suvidha-navy" bg="bg-suvidha-navy/10" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="font-heading font-bold text-base mb-4 text-foreground">Complaints by Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E8" />
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="complaints" fill="#162D5A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="font-heading font-bold text-base mb-4 text-foreground">Weekly Resolution Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E8" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="resolved" stroke="#FF8000" strokeWidth={2.5} dot={{ fill: "#FF8000", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-heading font-bold text-base">Recent Complaints</h3>
          <button
            onClick={() => setLocation("/admin/complaints")}
            className="text-sm font-semibold text-suvidha-navy flex items-center gap-1 hover:underline"
            data-testid="link-view-all-complaints"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-suvidha-bg">
              <tr>
                {["Ticket ID","Citizen","Department","Category","Status","Submitted",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((c, i) => (
                <tr key={c.id} className={`border-t border-border hover:bg-gray-50 ${i % 2 === 0 ? "" : ""}`}>
                  <td className="px-4 py-3 font-mono font-bold text-suvidha-teal whitespace-nowrap">{c.id}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{c.citizen}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.dept}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[c.status] || ""}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.submitted}</td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 rounded-lg border border-suvidha-navy/30 text-suvidha-navy text-xs font-semibold hover:bg-suvidha-navy/5"
                      data-testid={`button-view-complaint-${c.id}`}
                      onClick={() => setLocation("/admin/complaints")}
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

      {/* Civic Alerts */}
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-base">Active Civic Alerts</h3>
          <button
            onClick={() => setShowAddAlert(!showAddAlert)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-suvidha-saffron text-white rounded-lg text-xs font-bold hover:bg-suvidha-saffron/90"
            data-testid="button-add-alert"
          >
            <Plus className="w-3.5 h-3.5" /> Add Alert
          </button>
        </div>

        {showAddAlert && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newAlertText}
              onChange={(e) => setNewAlertText(e.target.value)}
              placeholder="Enter alert message..."
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-navy/30"
              data-testid="input-new-alert"
            />
            <button
              onClick={addAlert}
              className="px-4 py-2 bg-suvidha-navy text-white rounded-lg text-sm font-semibold hover:bg-suvidha-navy/90"
            >
              Publish
            </button>
          </div>
        )}

        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-start justify-between gap-3 p-3 bg-suvidha-saffron/5 border border-suvidha-saffron/20 rounded-xl">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-suvidha-saffron mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-foreground">{alert.text}</span>
              </div>
              <button
                onClick={() => resolveAlert(alert.id)}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label="Dismiss alert"
                data-testid={`button-dismiss-alert-${alert.id}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string }) {
  return (
    <Card className="p-5 rounded-2xl border-border shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-heading font-bold text-foreground mb-0.5">{value}</div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
    </Card>
  );
}
