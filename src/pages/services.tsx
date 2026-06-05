import { useLocation, useParams } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import {
  Zap, Flame, Building2, ChevronRight,
  Plus, CreditCard, Wrench, Search, User2, ArrowRightLeft,
  Droplets, Trash2, Lamp, AlertTriangle, FileText, Gauge
} from "lucide-react";

type ServiceItem = {
  label: string;
  icon: React.ElementType;
  route: string;
  iconBg: string;
  iconColor: string;
};

const DEPT_DATA: Record<string, {
  title: string;
  icon: React.ElementType;
  headerBg: string;
  headerText: string;
  headerSub: string;
  services: ServiceItem[];
}> = {
  electricity: {
    title: "Electricity Services",
    icon: Zap,
    headerBg: "bg-amber-50 border-b border-amber-100",
    headerText: "text-amber-800",
    headerSub: "text-amber-600/70",
    services: [
      { label: "New Connection",      icon: Plus,           route: "/service-form/new-connection?type=new-connection&dept=electricity",      iconBg: "bg-amber-50",   iconColor: "text-amber-600"  },
      { label: "Load Extension",      icon: ArrowRightLeft, route: "/service-form/load-extension?type=load-extension&dept=electricity",      iconBg: "bg-orange-50",  iconColor: "text-orange-600" },
      { label: "Meter Replacement",   icon: Gauge,          route: "/service-form/meter-replacement?type=meter-replacement&dept=electricity", iconBg: "bg-suvidha-navy/10", iconColor: "text-suvidha-navy" },
      { label: "Bill Dispute",        icon: CreditCard,     route: "/service-form/complaint?type=complaint&dept=electricity",                iconBg: "bg-red-50",     iconColor: "text-red-500"    },
      { label: "Report Power Outage", icon: AlertTriangle,  route: "/service-form/complaint?type=complaint&dept=electricity",                iconBg: "bg-yellow-50",  iconColor: "text-yellow-600" },
      { label: "Credential Mgmt",     icon: User2,          route: "/profile",                                                              iconBg: "bg-purple-50",  iconColor: "text-purple-600" },
      { label: "Track Request",       icon: Search,         route: "/track",                                                                iconBg: "bg-teal-50",    iconColor: "text-teal-600"   },
      { label: "History & Receipts",  icon: FileText,       route: "/track",                                                                iconBg: "bg-gray-100",   iconColor: "text-gray-500"   },
    ],
  },
  gas: {
    title: "Piped Gas Services",
    icon: Flame,
    headerBg: "bg-red-50 border-b border-red-100",
    headerText: "text-red-900",
    headerSub: "text-red-600/70",
    services: [
      { label: "New Gas Connection",  icon: Plus,           route: "/service-form/new-connection?type=new-connection&dept=gas",  iconBg: "bg-red-50",    iconColor: "text-red-500"    },
      { label: "Meter Replacement",   icon: Gauge,          route: "/service-form/meter-replacement?type=meter-replacement&dept=gas", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
      { label: "Report Gas Leakage",  icon: AlertTriangle,  route: "/service-form/complaint?type=complaint&dept=gas",           iconBg: "bg-yellow-50", iconColor: "text-yellow-700" },
      { label: "Register Complaint",  icon: Wrench,         route: "/service-form/complaint?type=complaint&dept=gas",           iconBg: "bg-suvidha-navy/10", iconColor: "text-suvidha-navy" },
      { label: "Track Request",       icon: Search,         route: "/track",                                                   iconBg: "bg-teal-50",   iconColor: "text-teal-600"   },
      { label: "Edit Credentials",    icon: User2,          route: "/profile",                                                 iconBg: "bg-purple-50", iconColor: "text-purple-600" },
      { label: "Receipts",            icon: FileText,       route: "/track",                                                   iconBg: "bg-gray-100",  iconColor: "text-gray-500"   },
    ],
  },
  municipal: {
    title: "Municipal Services",
    icon: Building2,
    headerBg: "bg-teal-50 border-b border-teal-100",
    headerText: "text-teal-900",
    headerSub: "text-teal-600/70",
    services: [
      { label: "New Water Connection", icon: Droplets,      route: "/service-form/water-connection?type=water-connection&dept=municipal", iconBg: "bg-suvidha-navy/10", iconColor: "text-suvidha-navy" },
      { label: "Register Grievance",   icon: AlertTriangle, route: "/grievance/new",                                                      iconBg: "bg-red-50",    iconColor: "text-red-500"    },
      { label: "Water Complaint",      icon: Droplets,      route: "/service-form/complaint?type=complaint&dept=municipal",               iconBg: "bg-cyan-50",   iconColor: "text-cyan-600"   },
      { label: "Sewage / Sanitation",  icon: Trash2,        route: "/service-form/complaint?type=complaint&dept=municipal",               iconBg: "bg-green-50",  iconColor: "text-green-700"  },
      { label: "Streetlight Repair",   icon: Lamp,          route: "/service-form/complaint?type=complaint&dept=municipal",               iconBg: "bg-yellow-50", iconColor: "text-yellow-600" },
      { label: "Property Tax",         icon: CreditCard,    route: "/service-form/complaint?type=complaint&dept=municipal",               iconBg: "bg-purple-50", iconColor: "text-purple-600" },
      { label: "Track Request",        icon: Search,        route: "/track",                                                              iconBg: "bg-teal-50",   iconColor: "text-teal-600"   },
      { label: "Update Profile",       icon: User2,         route: "/profile",                                                            iconBg: "bg-gray-100",  iconColor: "text-gray-500"   },
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
      <div className="flex flex-col bg-gray-50 pb-6 min-h-full">
        <TopAppBar title={data.title} />

        {/* Muted dept header — no bold gradient */}
        <div className={`px-5 pt-5 pb-5 ${data.headerBg}`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Icon className={`w-6 h-6 ${data.headerText}`} />
            </div>
            <div>
              <h2 className={`font-heading font-bold text-lg leading-tight ${data.headerText}`}>{data.title}</h2>
              <p className={`text-sm ${data.headerSub}`}>Select a service to proceed</p>
            </div>
          </div>
        </div>

        {/* Service list — grouped card */}
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {data.services.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <button
                  key={service.label}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  onClick={() => setLocation(service.route)}
                  data-testid={`card-service-${service.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${service.iconBg}`}>
                    <ServiceIcon className={`w-4.5 h-4.5 ${service.iconColor}`} />
                  </div>
                  <span className="flex-1 font-semibold text-sm text-gray-800">{service.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
