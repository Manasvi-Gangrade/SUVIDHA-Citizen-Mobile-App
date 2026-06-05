import { useState, useMemo } from "react";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Search, PhoneCall, MessageSquare, Zap, Flame, Building2, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all",         label: "All",        icon: HelpCircle  },
  { key: "electricity", label: "Electricity", icon: Zap         },
  { key: "gas",         label: "Gas",         icon: Flame       },
  { key: "municipal",   label: "Municipal",   icon: Building2   },
];

const FAQS = [
  { cat: "electricity", icon: Zap,       iconColor: "text-amber-500", q: "How to apply for a new electricity connection?",           a: "Apply from Dashboard → Electricity Services → New Connection. Keep your Aadhaar and Property Tax receipt ready. Processing takes 7–10 working days after document verification." },
  { cat: "electricity", icon: Zap,       iconColor: "text-amber-500", q: "How do I report a power outage in my area?",               a: "Go to Electricity Services → Report Power Outage, or call 1912. You can track the resolution status from My Tickets." },
  { cat: "electricity", icon: Zap,       iconColor: "text-amber-500", q: "My electricity bill seems too high. What can I do?",       a: "Raise a Bill Dispute under Electricity Services. Attach a photo of your meter reading. The finance team will recalculate within 5 working days." },
  { cat: "electricity", icon: Zap,       iconColor: "text-amber-500", q: "How long does a meter replacement take?",                  a: "Meter replacement requests are typically resolved within 3–5 working days. Track progress via My Tickets using your Ticket ID." },
  { cat: "gas",         icon: Flame,     iconColor: "text-red-500",   q: "My gas subsidy is not credited. What should I do?",        a: "Verify your bank account linkage in Profile. If correctly linked, raise a Grievance ticket with your consumer number. Resolution usually takes 3–7 working days." },
  { cat: "gas",         icon: Flame,     iconColor: "text-red-500",   q: "How do I report a gas leakage?",                          a: "Call 1912 immediately for emergencies. You can also file a report via Gas Services → Report Gas Leakage. An officer will visit within 24 hours." },
  { cat: "gas",         icon: Flame,     iconColor: "text-red-500",   q: "How to apply for a new piped gas connection?",             a: "Go to Gas Services → New Gas Connection. You'll need your property documents and Aadhaar. The pipeline survey happens within 7 days of application." },
  { cat: "municipal",   icon: Building2, iconColor: "text-teal-600",  q: "How to report uncollected garbage?",                       a: "Use New Grievance → Municipal → Sanitation. Upload a photo for faster resolution. Garbage collection issues are typically addressed within 24–48 hours." },
  { cat: "municipal",   icon: Building2, iconColor: "text-teal-600",  q: "How can I apply for a new water connection?",              a: "Go to Municipal Services → New Water Connection. Bring proof of property ownership and a recent electricity bill. Processing takes 10–15 working days." },
  { cat: "municipal",   icon: Building2, iconColor: "text-teal-600",  q: "How do I report a pothole or road damage?",                a: "File a grievance under Municipal → Roads & Traffic. Attach a photo of the location. Resolution target is 7 working days for major roads." },
  { cat: "municipal",   icon: Building2, iconColor: "text-teal-600",  q: "How to pay property tax online?",                          a: "Go to Municipal Services → Property Tax. Enter your Property ID to view and pay your tax bill securely using UPI or net banking." },
];

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      const matchCat = cat === "all" || f.cat === cat;
      const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [cat, search]);

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full pb-8">
        <TopAppBar title="Help & FAQ" />

        {/* Hero search */}
        <div className="bg-suvidha-navy px-4 pt-5 pb-7">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Support Centre</p>
          <h2 className="text-white font-heading font-bold text-lg mb-4">How can we help?</h2>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search FAQs..."
              value={search}
              onChange={e => { setSearch(e.target.value); setOpen(null); }}
              className="w-full h-12 pl-10 pr-4 bg-white rounded-xl text-sm font-medium text-gray-800
                         placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-suvidha-saffron/50 shadow-sm"
            />
          </div>
        </div>

        <div className="px-4 mt-[-14px] space-y-4">
          {/* Contact buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:1912"
              className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex items-center justify-center gap-2.5
                         font-semibold text-sm text-suvidha-navy active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 bg-suvidha-navy/10 rounded-xl flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4 text-suvidha-navy" />
              </div>
              1912 Helpline
            </a>
            <button
              className="bg-[#25D366] text-white p-4 rounded-2xl flex items-center justify-center gap-2.5
                         font-semibold text-sm shadow-[0_4px_14px_rgba(37,211,102,0.3)] active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              WhatsApp
            </button>
          </div>

          {/* Category tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 grid grid-cols-4 gap-1">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              const active = cat === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => { setCat(c.key); setOpen(null); }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all",
                    active ? "bg-suvidha-navy text-white" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* FAQ accordion */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              {filtered.length} Question{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
                  No results for "{search}"
                </div>
              )}
              {filtered.map((faq, idx) => {
                const Icon = faq.icon;
                const isOpen = open === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpen(isOpen ? null : idx)}
                      className="w-full text-left px-4 py-4 flex items-start gap-3 active:bg-gray-50 transition-colors"
                    >
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        faq.cat === "electricity" ? "bg-amber-50" :
                        faq.cat === "gas" ? "bg-red-50" : "bg-teal-50"
                      )}>
                        <Icon className={cn("w-4 h-4", faq.iconColor)} />
                      </div>
                      <p className="flex-1 font-semibold text-sm text-gray-800 leading-snug">{faq.q}</p>
                      <ChevronDown className={cn("w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50">
                            <p className="text-sm text-gray-600 leading-relaxed pt-3">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
