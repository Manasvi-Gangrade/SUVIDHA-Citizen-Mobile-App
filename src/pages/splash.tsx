import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "Connecting to SUVIDHA services...",
  "Loading department data...",
  "Initializing secure session...",
  "Almost ready...",
];

export default function Splash() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Advance steps (extended duration)
    const stepTimers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setStepIndex(i), i * 1100 + 400)
    );
    // Animate progress bar (50ms interval, increments of 1 = 5000ms total)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 50);
    // Done state then navigate
    const doneTimer = setTimeout(() => setDone(true), 4600);
    const navTimer = setTimeout(() => {
      const user = localStorage.getItem("suvidha_user");
      if (user) {
        setLocation("/dashboard");
      } else {
        setLocation("/onboarding");
      }
    }, 5200);
    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(doneTimer);
      clearTimeout(navTimer);
    };
  }, [setLocation]);

  return (
    <div className="w-full h-full bg-suvidha-navy flex flex-col items-center justify-between relative overflow-hidden py-12">

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay pointer-events-none"
      >
        <source src="/splash-bg.mp4" type="video/mp4" />
      </video>

      {/* Background aurora blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-80 h-80 bg-suvidha-teal/20 rounded-full blur-[80px]"
          style={{ top: "-10%", left: "-15%" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-suvidha-saffron/15 rounded-full blur-[70px]"
          style={{ bottom: "5%", right: "-10%" }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-48 h-48 bg-white/5 rounded-full blur-[50px]"
          style={{ top: "40%", right: "10%" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Top spacer */}
      <div />

      {/* Center: Logo + branding */}
      <div className="flex flex-col items-center z-10">
        {/* Animated logo mark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mb-8"
        >
          {/* Outer ring pulse */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-suvidha-saffron/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
          {/* Emblem box */}
          <div className="relative w-24 h-24 bg-white rounded-2xl shadow-2xl border-b-4 border-suvidha-saffron flex items-center justify-center">
            {/* Ashoka Chakra SVG */}
            <motion.svg
              viewBox="0 0 64 64"
              className="w-14 h-14"
              animate={{ rotate: done ? 0 : [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="32" cy="32" r="24" fill="none" stroke="#162D5A" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="4" fill="#162D5A" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                const x1 = 32 + 4.5 * Math.cos(angle);
                const y1 = 32 + 4.5 * Math.sin(angle);
                const x2 = 32 + 22 * Math.cos(angle);
                const y2 = 32 + 22 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={i % 3 === 0 ? "#FF8000" : "#162D5A"}
                    strokeWidth={i % 3 === 0 ? "1.5" : "0.8"}
                  />
                );
              })}
            </motion.svg>
          </div>
        </motion.div>

        {/* Name reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-heading font-bold text-white tracking-widest"
          >
            SUVIDHA
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="text-suvidha-saffron font-semibold text-sm tracking-[0.2em] uppercase">
            Sarkar Aapke Dwar
          </p>
          <p className="text-white/40 text-xs tracking-widest uppercase">
            Government of Assam
          </p>
        </motion.div>

        {/* Animated step text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 h-5"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-white/50 text-xs text-center tracking-wide"
            >
              {done ? "Ready!" : LOADING_STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom: Progress bar + badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full px-10 z-10 flex flex-col items-center gap-4"
      >
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-suvidha-teal via-suvidha-saffron to-suvidha-saffron rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* India emblem row */}
        <div className="flex items-center gap-2 opacity-40">
          <div className="h-px w-8 bg-white/40" />
          <p className="text-white text-[10px] tracking-widest uppercase">Digital India</p>
          <div className="h-px w-8 bg-white/40" />
        </div>
      </motion.div>
    </div>
  );
}
