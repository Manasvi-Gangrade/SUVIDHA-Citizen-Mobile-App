import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/onboarding");
    }, 2500);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <PageTransition>
      <div className="w-full h-full min-h-screen bg-suvidha-navy flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-suvidha-teal/20 blur-[80px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center z-10"
        >
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6 border-b-4 border-suvidha-saffron">
            <Shield className="w-12 h-12 text-suvidha-navy" />
          </div>
          
          <h1 className="text-4xl font-heading font-bold text-white tracking-wide mb-2">
            SUVIDHA
          </h1>
          <p className="text-suvidha-saffron font-medium text-lg tracking-wider uppercase mb-12">
            Sarkar Aapke Dwar
          </p>

          <div className="flex items-center gap-2 mt-8">
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              className="w-2 h-2 rounded-full bg-suvidha-teal"
            />
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
              className="w-2 h-2 rounded-full bg-suvidha-teal"
            />
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
              className="w-2 h-2 rounded-full bg-suvidha-teal"
            />
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}