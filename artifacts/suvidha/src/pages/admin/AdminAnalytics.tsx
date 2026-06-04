import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const monthlyData = [
  { month: "Jul", complaints: 210 },
  { month: "Aug", complaints: 245 },
  { month: "Sep", complaints: 198 },
  { month: "Oct", complaints: 312 },
  { month: "Nov", complaints: 267 },
  { month: "Dec", complaints: 289 },
  { month: "Jan", complaints: 334 },
  { month: "Feb", complaints: 310 },
  { month: "Mar", complaints: 356 },
  { month: "Apr", complaints: 298 },
  { month: "May", complaints: 362 },
  { month: "Jun", complaints: 184 },
];

const categoryPie = [
  { name: "Water Supply", value: 28 },
  { name: "Billing", value: 22 },
  { name: "Streetlight", value: 14 },
  { name: "Gas Leak", value: 10 },
  { name: "New Connection", value: 16 },
  { name: "Others", value: 10 },
];

const resolutionTime = [
  { dept: "Electricity", days: 1.8 },
  { dept: "Gas", days: 2.1 },
  { dept: "Municipal", days: 3.4 },
];

const PIE_COLORS = ["#162D5A", "#FF8000", "#389494", "#30A675", "#E62E2E", "#999999"];

const slaData = [
  { dept: "Electricity", breachRate: 12 },
  { dept: "Gas", breachRate: 8 },
  { dept: "Municipal", breachRate: 21 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Service performance and complaint trend analysis</p>
      </div>

      {/* SLA Breach Rate */}
      <div className="grid grid-cols-3 gap-4">
        {slaData.map(d => (
          <Card key={d.dept} className="p-5 rounded-2xl border-border shadow-sm text-center">
            <div className={`text-3xl font-heading font-bold mb-1 ${d.breachRate > 15 ? "text-destructive" : d.breachRate > 10 ? "text-suvidha-saffron" : "text-success"}`}>
              {d.breachRate}%
            </div>
            <div className="text-xs text-muted-foreground font-medium">SLA Breach Rate</div>
            <div className="text-sm font-semibold text-foreground mt-1">{d.dept}</div>
          </Card>
        ))}
      </div>

      {/* Monthly Volume */}
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <h3 className="font-heading font-bold text-base mb-4">Monthly Complaint Volume (Jul 2025 – Jun 2026)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="complaints" stroke="#162D5A" strokeWidth={2.5} dot={{ fill: "#162D5A", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie + Avg Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="font-heading font-bold text-base mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {categoryPie.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 rounded-2xl border-border shadow-sm">
          <h3 className="font-heading font-bold text-base mb-4">Avg. Resolution Time (days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={resolutionTime} barSize={50} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 5]} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="days" fill="#389494" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
