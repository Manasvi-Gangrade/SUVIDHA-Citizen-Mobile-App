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
  color: string;
  bg: string;
};

const DEPT_DATA: Record<string, {
  title: string;
  icon: React.ElementType;
  grad: string;
  services: ServiceItem[];
}> = {
  electricity: {
    title: "Electricity Services",
    icon: Zap,
    grad: "from-amber-400 to-orange-500",
    services: [
      { label: "New Connection",      icon: Plus,           route: "/service-form/new-connection?type=new-connection&dept=electricity",   color: "text-amber-600",  bg: "bg-amber-50"  },
      { label: "Load Extension",      icon: ArrowRightLeft, route: "/service-form/load-extension?type=load-extension&dept=electricity",   color: "text-orange-600", bg: "bg-orange-50" },
      { label: "Meter Replacement",   icon: Gauge,          route: "/service-form/meter-replacement?type=meter-replacement&dept=electricity", color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Bill Dispute",        icon: CreditCard,     route: "/service-form/complaint?type=complaint&dept=electricity",             color: "text-red-500",    bg: "bg-red-50"    },
      { label: "Report Power Outage", icon: AlertTriangle,  route: "/service-form/complaint?type=complaint&dept=electricity",             color: "text-yellow-600", bg: "bg-yellow-50" },
      { label: "Credential Mgmt",     icon: User2,          route: "/profile",                                                           color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Track Request",       icon: Search,         route: "/track",                                                             color: "text-teal-600",   bg: "bg-teal-50"   },
      { label: "History & Receipts",  icon: FileText,       route: "/tickets",                                                           color: "text-gray-600",   bg: "bg-gray-100"  },
    ],
  },
  gas: {
    title: "Piped Gas Services",
    icon: Flame,
    grad: "from-red-500 to-orange-500",
    services: [
      { label: "New Gas Connection",  icon: Plus,          route: "/service-form/new-connection?type=new-connection&dept=gas",  color: "text-red-600",    bg: "bg-red-50"    },
      { label: "Meter Replacement",   icon: Gauge,         route: "/service-form/meter-replacement?type=meter-replacement&dept=gas", color: "text-orange-600", bg: "bg-orange-50" },
      { label: "Report Gas Leakage",  icon: AlertTriangle, route: "/service-form/complaint?type=complaint&dept=gas",           color: "text-yellow-700", bg: "bg-yellow-50" },
      { label: "Register Complaint",  icon: Wrench,        route: "/service-form/complaint?type=complaint&dept=gas",           color: "text-blue-600",   bg: "bg-blue-50"   },
      { label: "Track Request",       icon: Search,        route: "/track",                                                   color: "text-teal-600",   bg: "bg-teal-50"   },
      { label: "Edit Credentials",    icon: User2,         route: "/profile",                                                 color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Receipts",            icon: FileText,      route: "/tickets",                                                 color: "text-gray-600",   bg: "bg-gray-100"  },
    ],
  },
  municipal: {
    title: "Municipal Services",
    icon: Building2,
    grad: "from-teal-500 to-cyan-600",
    services: [
      { label: "New Water Connection", icon: Droplets,     route: "/service-form/water-connection?type=water-connection&dept=municipal", color: "text-blue-600",   bg: "bg-blue-50"   },
      { label: "Register Grievance",   icon: AlertTriangle,route: "/grievance/new",                                                      color: "text-red-500",    bg: "bg-red-50"    },
      { label: "Water Complaint",      icon: Droplets,     route: "/service-form/complaint?type=complaint&dept=municipal",               color: "text-cyan-600",   bg: "bg-cyan-50"   },
      { label: "Sewage / Sanitation",  icon: Trash2,       route: "/service-form/complaint?type=complaint&dept=municipal",               color: "text-green-700",  bg: "bg-green-50"  },
      { label: "Streetlight Repair",   icon: Lamp,         route: "/service-form/complaint?type=complaint&dept=municipal",               color: "text-yellow-600", bg: "bg-yellow-50" },
      { label: "Property Tax",         icon: CreditCard,   route: "/service-form/complaint?type=complaint&dept=municipal",               color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Track Request",        icon: Search,       route: "/track",                                                              color: "text-teal-600",   bg: "bg-teal-50"   },
      { label: "Update Profile",       icon: User2,        route: "/profile",                                                            color: "text-gray-600",   bg: "bg-gray-100"  },
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

        {/* Dept hero banner */}
        <div className={`bg-gradient-to-r ${data.grad} px-5 pt-5 pb-6 relative overflow-hidden`}>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-[30px]" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-white">{data.title}</h2>
              <p className="text-white/70 text-sm">Select a service to proceed</p>
            </div>
          </div>
        </div>

        {/* Service list */}
        <div className="p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {data.services.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <button
                  key={service.label}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  onClick={() => setLocation(service.route)}
                  data-testid={`card-service-${service.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${service.bg}`}>
                    <ServiceIcon className={`w-4.5 h-4.5 ${service.color}`} />
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
