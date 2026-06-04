import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageSquare, PhoneCall, Zap, Flame, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  const [search, setSearch] = useState("");

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title="Help & FAQ" />
        
        <div className="p-5">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 rounded-xl border-border bg-white text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="bg-white border border-border p-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active:bg-gray-50 text-suvidha-navy font-semibold text-sm">
              <PhoneCall className="w-4 h-4" />
              1912 Helpline
            </button>
            <button className="bg-[#25D366] text-white p-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(37,211,102,0.3)] active:scale-95 transition-transform font-semibold text-sm">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </button>
          </div>

          <h2 className="text-lg font-heading font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          
          <Card className="bg-white rounded-xl shadow-sm border-border overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border">
                <AccordionTrigger className="px-4 py-4 text-left font-semibold text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-suvidha-saffron" />
                    How to apply for a new electricity connection?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm">
                  You can apply for a new connection from the Dashboard &gt; New Connection. Keep your Aadhaar and Property Tax receipt ready for upload. Processing typically takes 7-10 working days.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-border">
                <AccordionTrigger className="px-4 py-4 text-left font-semibold text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-destructive" />
                    My gas subsidy is not credited. What should I do?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm">
                  Please verify your bank account linkage in the Profile section. If correctly linked, you can raise a Grievance ticket from the dashboard with your consumer number.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-none">
                <AccordionTrigger className="px-4 py-4 text-left font-semibold text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-suvidha-teal" />
                    How to report uncollected garbage?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm">
                  Use the "New Grievance" button on the dashboard. Select "Municipal", then "Sanitation". You can also upload a photo of the uncollected garbage for faster resolution.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}