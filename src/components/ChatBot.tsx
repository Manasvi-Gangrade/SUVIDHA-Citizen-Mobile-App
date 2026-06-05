import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Bot, Zap, FileText, MapPin, Phone, HelpCircle, Building2, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
  chips?: { label: string; icon: React.ElementType; action: string }[];
}

const QUICK_SUGGESTIONS = [
  { label: "Track complaint",      icon: MapPin,     action: "track my complaint"           },
  { label: "New connection",       icon: Zap,        action: "new electricity connection"   },
  { label: "Water supply issue",   icon: Building2,  action: "water supply issue"           },
  { label: "Gas emergency",        icon: Flame,      action: "gas leakage emergency"        },
];

const BOT_RESPONSES: { match: string[]; reply: string; chips?: { label: string; icon: React.ElementType; action: string }[] }[] = [
  {
    match: ["track", "complaint", "ticket", "status", "svd"],
    reply: "Share your Ticket ID (e.g. SVD-8892) or your registered mobile number. I'll pull the latest status right away!",
    chips: [{ label: "Go to Track page", icon: MapPin, action: "goto:/track" }],
  },
  {
    match: ["new electricity", "electricity connection", "power connection"],
    reply: "For a new electricity connection you'll need:\n• Aadhaar Card\n• Property Tax receipt\n• Site plan\n\nProcessing takes 7–10 working days.",
    chips: [{ label: "Apply Now", icon: Zap, action: "goto:/services/electricity" }],
  },
  {
    match: ["water", "water supply", "water issue", "pipeline"],
    reply: "For water supply complaints, file a grievance under Municipal → Water Complaint. You can also call 1912 for urgent issues.",
    chips: [{ label: "File Grievance", icon: FileText, action: "goto:/grievance/new" }, { label: "Municipal Services", icon: Building2, action: "goto:/services/municipal" }],
  },
  {
    match: ["gas leakage", "gas emergency", "gas leak"],
    reply: "⚠️ Gas emergency! Please:\n1. Open all windows immediately\n2. Do NOT switch on any electrical appliance\n3. Call 1912 now!\n\nA field officer will reach you within 1 hour.",
    chips: [{ label: "Call 1912", icon: Phone, action: "tel:1912" }],
  },
  {
    match: ["gas subsidy", "subsidy", "lpg"],
    reply: "Check your bank account linkage in Profile. If correctly linked, raise a Grievance under Piped Gas with your consumer number.",
    chips: [{ label: "My Profile", icon: FileText, action: "goto:/profile" }],
  },
  {
    match: ["streetlight", "street light", "light repair"],
    reply: "To report a streetlight issue, file a grievance under Municipal → Streetlight Repair. Add the pole number if possible for faster resolution.",
    chips: [{ label: "File Grievance", icon: FileText, action: "goto:/grievance/new" }],
  },
  {
    match: ["bill", "billing", "overcharge", "dispute"],
    reply: "To raise a bill dispute, go to Electricity Services → Bill Dispute. Attach a photo of your meter reading. Finance team resolves within 5 working days.",
    chips: [{ label: "Electricity Services", icon: Zap, action: "goto:/services/electricity" }],
  },
  {
    match: ["help", "faq", "how to", "guide"],
    reply: "Our Help & FAQ section has step-by-step guides for all services. You can also call 1912 (24×7) for live support.",
    chips: [{ label: "View FAQs", icon: HelpCircle, action: "goto:/faq" }],
  },
];

const getReply = (text: string) => {
  const lower = text.toLowerCase().trim();
  for (const r of BOT_RESPONSES) {
    if (r.match.some(k => lower.includes(k))) return r;
  }
  return { reply: "I can help with electricity, gas, municipal services, complaints, and more! What do you need help with?", chips: undefined };
};

export default function ChatBot() {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: "Namaste! 🙏 I'm the SUVIDHA Assistant. How can I help you with government services today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: idRef.current++, from: "user", text }]);
    setInput("");
    setTyping(true);
    const { reply, chips } = getReply(text);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: idRef.current++, from: "bot", text: reply, chips }]);
      setTyping(false);
    }, 950);
  };

  const handleChip = (action: string) => {
    if (action.startsWith("goto:")) {
      setOpen(false);
      setTimeout(() => setLocation(action.replace("goto:", "")), 200);
    } else if (action.startsWith("tel:")) {
      window.open(action);
    } else {
      sendMessage(action);
    }
  };

  const showSuggestions = messages.length <= 1 && !typing;

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setOpen(true)}
            className="fixed z-40 flex items-center justify-center rounded-full
                       bg-suvidha-teal shadow-[0_6px_20px_rgba(56,148,148,0.45)]
                       text-white hover:scale-105 active:scale-95 transition-transform"
            style={{ bottom: 88, right: 12, width: 50, height: 50 }}
            aria-label="Open SUVIDHA Assistant"
            data-testid="button-open-chatbot"
          >
            <MessageCircle className="w-5 h-5" />
            {/* Notification dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-suvidha-saffron rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden rounded-t-3xl bg-white"
              style={{ height: "80%" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-suvidha-navy text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-suvidha-navy" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm">SUVIDHA Assistant</div>
                    <div className="text-[10px] text-white/60">Powered by AI · Assam Govt.</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close chat"
                  data-testid="button-close-chatbot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={cn("flex gap-2", msg.from === "user" ? "justify-end" : "justify-start")}>
                    {msg.from === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-suvidha-teal flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 max-w-[80%]">
                      <div className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                        msg.from === "user"
                          ? "bg-suvidha-navy text-white rounded-tr-sm"
                          : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {msg.chips.map(chip => {
                            const ChipIcon = chip.icon;
                            return (
                              <button
                                key={chip.label}
                                onClick={() => handleChip(chip.action)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-suvidha-navy/10 text-suvidha-navy
                                           text-xs font-bold rounded-full hover:bg-suvidha-navy/20 transition-colors border border-suvidha-navy/20"
                              >
                                <ChipIcon className="w-3 h-3" />
                                {chip.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-suvidha-teal flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                      {[0, 0.18, 0.36].map(d => (
                        <motion.div
                          key={d}
                          className="w-1.5 h-1.5 bg-suvidha-teal rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {showSuggestions && (
                <div className="px-3 pt-2.5 pb-1.5 flex gap-2 flex-wrap bg-gray-50 border-t border-gray-100 shrink-0">
                  {QUICK_SUGGESTIONS.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.label}
                        onClick={() => sendMessage(s.action)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-suvidha-teal/30
                                   text-suvidha-teal text-xs font-semibold rounded-full shadow-sm hover:bg-suvidha-teal/10 transition-colors"
                        data-testid={`suggestion-${s.label.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Input */}
              <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-suvidha-teal/30 bg-gray-50 text-gray-800"
                  data-testid="input-chat-message"
                />
                <motion.button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-suvidha-teal disabled:bg-gray-200 text-white
                             rounded-xl flex items-center justify-center transition-colors shrink-0"
                  aria-label="Send message"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
