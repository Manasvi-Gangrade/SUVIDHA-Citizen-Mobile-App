import { useLocation, useParams } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import {
  Zap, Flame, Building2, ChevronRight,
  Plus, CreditCard, Wrench, Search, User2, ArrowRightLeft,
  Droplets, Trash2, Lamp, AlertTriangle, FileText, Gauge
} from "lucide-react";

type ServiceItem = {
  label: string;
  icon: React.ElementType;
  route: string;
};

const DEPT_DATA: Record<string, {
  title: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  services: ServiceItem[];
}> = {
  electricity: {
    title: "Electricity Services",
    icon: Zap,
    color: "text-suvidha-saffron",
    bg: "bg-suvidha-saffron/10",
    services: [
      { label: "New Connection", icon: Plus, route: "/service-form/new-connection?type=new-connection&dept=electricity" },
      { label: "Load Extension", icon: ArrowRightLeft, route: "/service-form/load-extension?type=load-extension&dept=electricity" },
      { label: "Meter Replacement", icon: Gauge, route: "/service-form/meter-replacement?type=meter-replacement&dept=electricity" },
      { label: "Bill Dispute", icon: CreditCard, route: "/service-form/complaint?type=complaint&dept=electricity" },
      { label: "Report Power Outage", icon: AlertTriangle, route: "/service-form/complaint?type=complaint&dept=electricity" },
      { label: "Credential Management", icon: User2, route: "/profile" },
      { label: "Track Request", icon: Search, route: "/track" },
      { label: "Receipts & History", icon: FileText, route: "/tickets" },
    ],
  },
  gas: {
    title: "Piped Gas Services",
    icon: Flame,
    color: "text-destructive",
    bg: "bg-destructive/10",
    services: [
      { label: "New Gas Connection", icon: Plus, route: "/service-form/new-connection?type=new-connection&dept=gas" },
      { label: "Meter Replacement", icon: Gauge, route: "/service-form/meter-replacement?type=meter-replacement&dept=gas" },
      { label: "Report Gas Leakage", icon: AlertTriangle, route: "/service-form/complaint?type=complaint&dept=gas" },
      { label: "Register Complaint", icon: Wrench, route: "/service-form/complaint?type=complaint&dept=gas" },
      { label: "Track Request", icon: Search, route: "/track" },
      { label: "Edit Credentials", icon: User2, route: "/profile" },
      { label: "Receipts", icon: FileText, route: "/tickets" },
    ],
  },
  municipal: {
    title: "Municipal Services",
    icon: Building2,
    color: "text-suvidha-teal",
    bg: "bg-suvidha-teal/10",
    services: [
      { label: "New Water Connection", icon: Droplets, route: "/service-form/water-connection?type=water-connection&dept=municipal" },
      { label: "Register Grievance", icon: AlertTriangle, route: "/grievance/new" },
      { label: "Water Supply Complaint", icon: Droplets, route: "/service-form/complaint?type=complaint&dept=municipal" },
      { label: "Sewage / Sanitation", icon: Trash2, route: "/service-form/complaint?type=complaint&dept=municipal" },
      { label: "Streetlight Repair", icon: Lamp, route: "/service-form/complaint?type=complaint&dept=municipal" },
      { label: "Property Tax", icon: CreditCard, route: "/service-form/complaint?type=complaint&dept=municipal" },
      { label: "Track Request", icon: Search, route: "/track" },
      { label: "Update Profile", icon: User2, route: "/profile" },
    ],
  },
};

export default function Services() {
  const { dept } = useParams();
  const [, setLocation] = useLocation();

  const data = DEPT_DATA[dept as keyof typeof DEPT_DATA] || DEPT_DATA.electricity;
  const Icon = data.icon;

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title={data.title} />

        <div className="p-5">
          <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-border">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.bg}`}>
              <Icon className={`w-6 h-6 ${data.color}`} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">{data.title}</h2>
              <p className="text-xs text-muted-foreground">Select a service to proceed</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {data.services.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <Card
                  key={service.label}
                  className="p-4 rounded-xl border-border shadow-sm flex items-center justify-between cursor-pointer active:bg-gray-50 hover:shadow-md transition-all"
                  onClick={() => setLocation(service.route)}
                  data-testid={`card-service-${service.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${data.bg}`}>
                      <ServiceIcon className={`w-4 h-4 ${data.color}`} />
                    </div>
                    <span className="font-semibold text-sm">{service.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
