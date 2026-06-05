import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Shield, Upload, FileText, File, FileImage, Lock, Download, Eye, X, CheckCircle2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DOCUMENTS = [
  { id: "1", type: "Aadhaar Card",     number: "XXXX-XXXX-8921", icon: FileText,  date: "Added Oct 2023", expiry: "Lifetime",     status: "verified",  iconBg: "bg-blue-50",   iconColor: "text-blue-600"  },
  { id: "2", type: "Ration Card",      number: "XXXX-XXXX-4512", icon: File,      date: "Added Sep 2023", expiry: "Dec 2025",     status: "expiring",  iconBg: "bg-orange-50", iconColor: "text-orange-600"},
  { id: "3", type: "Electricity Bill", number: "BP No. 129033",  icon: FileImage, date: "Added Oct 2023", expiry: "Nov 2024",     status: "expired",   iconBg: "bg-red-50",    iconColor: "text-red-500"   },
  { id: "4", type: "PAN Card",         number: "AXXXX1234X",     icon: FileText,  date: "Added Aug 2023", expiry: "Lifetime",     status: "verified",  iconBg: "bg-purple-50", iconColor: "text-purple-600"},
];

const STATUS_CONFIG = {
  verified: { label: "Verified",  bg: "bg-emerald-50",  text: "text-emerald-700", icon: CheckCircle2 },
  expiring: { label: "Expiring",  bg: "bg-amber-50",    text: "text-amber-700",   icon: RefreshCw    },
  expired:  { label: "Expired",   bg: "bg-red-50",      text: "text-red-600",     icon: X            },
};

export default function Locker() {
  const [preview, setPreview] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setSynced(true); }, 2200);
  };

  const previewDoc = DOCUMENTS.find(d => d.id === preview);

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full pb-8">
        <TopAppBar title="Digital Locker" />

        {/* Hero */}
        <div className="bg-suvidha-navy px-4 pt-5 pb-7">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Secure Storage</p>
          <h2 className="text-white font-heading font-bold text-lg mb-1">Digital Locker</h2>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white/70 text-xs font-semibold">256-bit AES Encrypted · DigiLocker Linked</span>
          </div>
        </div>

        <div className="px-4 mt-[-14px] space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total",    value: "4", color: "text-suvidha-navy"  },
              { label: "Verified", value: "2", color: "text-emerald-600"   },
              { label: "Expiring", value: "1", color: "text-amber-600"     },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
                <div className={cn("text-xl font-heading font-bold", s.color)}>{s.value}</div>
                <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Documents grid */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Saved Documents</p>
            <div className="grid grid-cols-2 gap-3">
              {DOCUMENTS.map(doc => {
                const Icon = doc.icon;
                const st = STATUS_CONFIG[doc.status as keyof typeof STATUS_CONFIG];
                const StIcon = st.icon;
                return (
                  <motion.button
                    key={doc.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPreview(doc.id)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col text-left relative overflow-hidden group"
                    data-testid={`doc-card-${doc.id}`}
                  >
                    {/* Watermark icon */}
                    <div className="absolute -right-3 -bottom-3 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                      <Icon className="w-20 h-20" />
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", doc.iconBg)}>
                      <Icon className={cn("w-5 h-5", doc.iconColor)} />
                    </div>
                    <h3 className="font-semibold text-[13px] text-gray-800 leading-tight mb-1">{doc.type}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono mb-2">
                      <Lock className="w-2.5 h-2.5" />
                      {doc.number}
                    </div>
                    <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit", st.bg, st.text)}>
                      <StIcon className="w-2.5 h-2.5" />
                      {st.label}
                    </div>
                  </motion.button>
                );
              })}

              {/* Upload card */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center text-center min-h-[140px] hover:border-suvidha-navy hover:text-suvidha-navy transition-colors text-gray-400"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Upload New</span>
                <span className="text-[10px] mt-0.5 text-gray-300">PDF, JPG, PNG</span>
              </motion.button>
            </div>
          </div>

          {/* DigiLocker sync */}
          <motion.button
            onClick={handleSync}
            disabled={syncing}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full h-14 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm shadow-sm transition-all",
              synced
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : "bg-suvidha-navy text-white"
            )}
            data-testid="button-digilocker-sync"
          >
            {syncing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Syncing with DigiLocker...
              </>
            ) : synced ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                Sync Complete!
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Sync with DigiLocker
              </>
            )}
          </motion.button>
        </div>

        {/* Document preview sheet */}
        <AnimatePresence>
          {preview && previewDoc && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreview(null)}
                className="fixed inset-0 bg-black/40 z-40"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 34 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base">{previewDoc.type}</h3>
                  <button onClick={() => setPreview(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto", previewDoc.iconBg)}>
                    {(() => { const Icon = previewDoc.icon; return <Icon className={cn("w-8 h-8", previewDoc.iconColor)} />; })()}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">Document No.</span><span className="font-mono font-bold">{previewDoc.number}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">Added</span><span className="font-semibold">{previewDoc.date}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-medium">Expiry</span><span className="font-semibold">{previewDoc.expiry}</span></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Status</span>
                      {(() => {
                        const st = STATUS_CONFIG[previewDoc.status as keyof typeof STATUS_CONFIG];
                        const StIcon = st.icon;
                        return (
                          <span className={cn("flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full", st.bg, st.text)}>
                            <StIcon className="w-3 h-3" />{st.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="h-12 rounded-xl border-2 border-suvidha-navy text-suvidha-navy font-bold text-sm flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />View
                    </button>
                    <button className="h-12 rounded-xl bg-suvidha-navy text-white font-bold text-sm flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
