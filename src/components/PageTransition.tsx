import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full h-full min-h-[100dvh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}