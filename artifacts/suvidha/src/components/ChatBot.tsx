import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

const QUICK_SUGGESTIONS = [
  "Track my complaint",
  "New electricity connection",
  "Water supply issue",
];

const BOT_REPLIES: Record<string, string> = {
  "track my complaint": "Please share your Ticket ID (e.g. SVD-8892) or registered mobile number and I'll fetch the latest status for you. You can also tap 'Tickets' in the menu.",
  "new electricity connection": "For a new electricity connection you'll need: Proof of Address, ID proof, and a site plan. Your Consumer Account details will also be required. Go to Electricity Services → New Connection to begin.",
  "water supply issue": "I've noted your concern about water supply. To file a formal grievance, tap the '+' button or go to Municipal Services → Register Grievance. I'll pre-fill the Water Supply category for you.",
  "default": "I can help you with electricity, gas, or municipal services. What do you need help with today? You can also use the department menus or Quick Actions on the home screen.",
};

const getReply = (text: string): string => {
  const lower = text.toLowerCase().trim();
  for (const key of Object.keys(BOT_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return BOT_REPLIES[key];
  }
  return BOT_REPLIES["default"];
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: "Namaste! I am SUVIDHA Assistant. How can I help you with government services today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: idRef.current++, from: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(text);
      setMessages(prev => [...prev, { id: idRef.current++, from: "bot", text: reply }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-[110px] right-4 w-12 h-12 bg-suvidha-teal rounded-full shadow-[0_6px_16px_rgba(56,148,148,0.45)] flex items-center justify-center text-white z-40 hover:scale-105 transition-transform"
            aria-label="Open SUVIDHA Assistant"
            data-testid="button-open-chatbot"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-[78%] bg-white rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.12)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-suvidha-navy text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-heading font-bold text-sm">SUVIDHA Assistant</div>
                  <div className="text-[10px] text-white/70">Always available to help</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
                data-testid="button-close-chatbot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-suvidha-bg">
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex", msg.from === "user" ? "justify-end" : "justify-start")}>
                  {msg.from === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-suvidha-teal flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                    msg.from === "user"
                      ? "bg-suvidha-navy text-white rounded-tr-sm"
                      : "bg-white text-foreground shadow-sm border border-border rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-suvidha-teal flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white shadow-sm border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    {[0, 0.2, 0.4].map(d => (
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
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap bg-suvidha-bg shrink-0">
                {QUICK_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 bg-white border border-suvidha-teal/40 text-suvidha-teal text-xs font-semibold rounded-full hover:bg-suvidha-teal/10 transition-colors"
                    data-testid={`button-suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 bg-white border-t border-border flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-suvidha-teal/30"
                data-testid="input-chat-message"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-10 h-10 bg-suvidha-teal disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors"
                aria-label="Send message"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
