import { useLocation, useParams } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import { Zap, Flame, Building2, ChevronRight, FileText, PenTool, Activity } from "lucide-react";

export default function Services() {
  const { dept } = useParams();
  const [, setLocation] = useLocation();

  const deptData = {
    electricity: {
      title: "Electricity Services",
      icon: Zap,
      color: "text-suvidha-saffron",
      bg: "bg-suvidha-saffron/10",
      services: [
        "New Connection",
        "Load Enhancement",
        "Meter Replacement",
        "Name Change",
        "Bill Dispute",
        "Report Power Outage"
      ]
    },
    gas: {
      title: "Piped Gas Services",
      icon: Flame,
      color: "text-destructive",
      bg: "bg-destructive/10",
      services: [
        "New Connection",
        "Meter Reading Submission",
        "Report Leakage",
        "Surrender Connection"
      ]
    },
    municipal: {
      title: "Municipal Services",
      icon: Building2,
      color: "text-suvidha-teal",
      bg: "bg-suvidha-teal/10",
      services: [
        "Property Tax Payment",
        "Trade License",
        "Birth/Death Certificate",
        "Water Connection",
        "Sanitation Complaint"
      ]
    }
  };

  const data = deptData[dept as keyof typeof deptData] || deptData.electricity;
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
            {data.services.map((service, index) => (
              <Card 
                key={index}
                className="p-4 rounded-xl border-border shadow-sm flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => setLocation(`/grievance/new`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {index % 3 === 0 ? <FileText className="w-4 h-4 text-suvidha-navy" /> : 
                     index % 3 === 1 ? <Activity className="w-4 h-4 text-suvidha-navy" /> :
                     <PenTool className="w-4 h-4 text-suvidha-navy" />}
                  </div>
                  <span className="font-semibold text-sm">{service}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}