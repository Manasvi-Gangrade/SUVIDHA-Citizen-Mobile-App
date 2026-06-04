import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Upload, FileText, File, FileImage, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCUMENTS = [
  { id: "1", type: "Aadhaar Card", number: "XXXX-XXXX-8921", icon: FileText, date: "Added Oct 2023" },
  { id: "2", type: "Ration Card", number: "XXXX-XXXX-4512", icon: File, date: "Added Sep 2023" },
  { id: "3", type: "Electricity Bill", number: "BP No. 129033", icon: FileImage, date: "Added Oct 2023" },
];

export default function Locker() {
  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-suvidha-bg pb-24">
        <TopAppBar title="Digital Locker" />
        
        <div className="p-5">
          <div className="bg-success/10 border border-success/20 rounded-xl p-3 flex items-center justify-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm font-semibold text-success">256-bit Encrypted Government Vault</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-foreground">Saved Documents</h2>
            <span className="text-sm font-semibold text-muted-foreground">3 Items</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {DOCUMENTS.map(doc => {
              const Icon = doc.icon;
              return (
                <Card key={doc.id} className="p-4 border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden group hover:border-suvidha-teal transition-all">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-24 h-24" />
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-suvidha-teal/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-suvidha-teal" />
                  </div>
                  
                  <h3 className="font-semibold text-sm leading-tight mb-1 relative z-10">{doc.type}</h3>
                  <div className="text-xs font-mono text-muted-foreground relative z-10 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {doc.number}
                  </div>
                </Card>
              );
            })}

            <button className="p-4 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground hover:text-suvidha-navy hover:border-suvidha-navy transition-colors bg-white/50 active:bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Upload New</span>
            </button>
          </div>
          
          <Button className="w-full h-14 bg-suvidha-navy hover:bg-suvidha-navy/90 text-white rounded-xl shadow-md">
            Sync with DigiLocker
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}