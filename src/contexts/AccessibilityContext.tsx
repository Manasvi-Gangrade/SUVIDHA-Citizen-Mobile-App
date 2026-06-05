import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type AppTheme = "light" | "dark" | "high-contrast";

interface OfflineRequest {
  id: string;
  type: string;
  dept: string;
  title: string;
  description: string;
  timestamp: string;
}

interface AccessibilityContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  dyslexic: boolean;
  setDyslexic: (enabled: boolean) => void;
  privacyMode: boolean;
  setPrivacyMode: (enabled: boolean) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  consentAccepted: boolean;
  setConsentAccepted: (accepted: boolean) => void;
  offlineQueue: OfflineRequest[];
  addOfflineRequest: (request: Omit<OfflineRequest, "id" | "timestamp">) => string;
  syncOfflineQueue: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial settings
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem("suvidha_theme") as AppTheme) || "light";
  });
  const [dyslexic, setDyslexicState] = useState<boolean>(() => {
    return localStorage.getItem("suvidha_dyslexic") === "true";
  });
  const [privacyMode, setPrivacyModeState] = useState<boolean>(() => {
    return localStorage.getItem("suvidha_privacy_mode") === "true";
  });
  const [isOffline, setIsOfflineState] = useState<boolean>(() => {
    return localStorage.getItem("suvidha_is_offline") === "true";
  });
  const [consentAccepted, setConsentAcceptedState] = useState<boolean>(() => {
    return localStorage.getItem("suvidha_consent_accepted") === "true";
  });
  const [offlineQueue, setOfflineQueue] = useState<OfflineRequest[]>([]);

  // Theme Sync
  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem("suvidha_theme", t);
  };

  // Dyslexic Sync
  const setDyslexic = (enabled: boolean) => {
    setDyslexicState(enabled);
    localStorage.setItem("suvidha_dyslexic", String(enabled));
  };

  // Privacy Mode Sync
  const setPrivacyMode = (enabled: boolean) => {
    setPrivacyModeState(enabled);
    localStorage.setItem("suvidha_privacy_mode", String(enabled));
  };

  // Offline Mode Sync
  const setIsOffline = (offline: boolean) => {
    setIsOfflineState(offline);
    localStorage.setItem("suvidha_is_offline", String(offline));
    if (!offline) {
      // Trigger sync when back online
      setTimeout(() => syncOfflineQueue(), 500);
    } else {
      toast.info("Offline Simulation Mode Enabled", {
        description: "Requests will be queued locally until connection is restored."
      });
    }
  };

  // Consent Sync
  const setConsentAccepted = (accepted: boolean) => {
    setConsentAcceptedState(accepted);
    localStorage.setItem("suvidha_consent_accepted", String(accepted));
  };

  // Apply visual modifiers to the document element/body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply Theme classes
    root.classList.remove("dark", "high-contrast");
    body.classList.remove("dark", "high-contrast");
    if (theme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else if (theme === "high-contrast") {
      root.classList.add("high-contrast");
      body.classList.add("high-contrast");
    }

    // Apply Dyslexic class
    body.classList.remove("font-dyslexic");
    if (dyslexic) {
      body.classList.add("font-dyslexic");
    }

    // Apply Privacy Mode class
    body.classList.remove("privacy-mode");
    if (privacyMode) {
      body.classList.add("privacy-mode");
    }
  }, [theme, dyslexic, privacyMode]);

  // Load offline queue on mount
  useEffect(() => {
    const saved = localStorage.getItem("suvidha_offline_queue");
    if (saved) {
      try {
        setOfflineQueue(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Queue an offline request
  const addOfflineRequest = (req: Omit<OfflineRequest, "id" | "timestamp">) => {
    const id = `SVD-OFF-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    const newRequest: OfflineRequest = { ...req, id, timestamp };

    const updatedQueue = [...offlineQueue, newRequest];
    setOfflineQueue(updatedQueue);
    localStorage.setItem("suvidha_offline_queue", JSON.stringify(updatedQueue));

    // Save ticket locally for tracking
    const localTickets = JSON.parse(localStorage.getItem("suvidha_local_tickets") || "[]");
    const ticketRepresentation = {
      title: req.title,
      id,
      dept: req.dept,
      ago: "Just now (Offline)",
      status: "Submitted Offline",
      dot: "bg-orange-400",
      badge: "bg-orange-50 text-orange-700 border-orange-200"
    };
    localStorage.setItem("suvidha_local_tickets", JSON.stringify([ticketRepresentation, ...localTickets]));

    toast.warning("Request Queued Offline!", {
      description: `Your token is ${id}. It will sync automatically when online.`
    });

    return id;
  };

  // Sync offline queue to active tickets
  const syncOfflineQueue = () => {
    const saved = localStorage.getItem("suvidha_offline_queue");
    if (!saved) return;

    try {
      const queue: OfflineRequest[] = JSON.parse(saved);
      if (queue.length === 0) return;

      toast.success("Connection Restored!", {
        description: `Syncing ${queue.length} pending request(s) with cloud database...`
      });

      // Move requests from offline queue to synced local tickets
      const localTickets = JSON.parse(localStorage.getItem("suvidha_local_tickets") || "[]");
      const updatedTickets = localTickets.map((t: any) => {
        if (t.id.startsWith("SVD-OFF")) {
          // Change offline tag to standard synced ticket
          const newId = `SVD-${t.id.split("-").pop()}`;
          return {
            ...t,
            id: newId,
            ago: "Just now",
            status: "Submitted",
            dot: "bg-suvidha-navy/70",
            badge: "bg-suvidha-navy/10 text-suvidha-navy border-suvidha-navy/20"
          };
        }
        return t;
      });

      localStorage.setItem("suvidha_local_tickets", JSON.stringify(updatedTickets));
      localStorage.removeItem("suvidha_offline_queue");
      setOfflineQueue([]);

      // Dispatch event to notify ticket page to reload/refresh
      window.dispatchEvent(new Event("suvidha_tickets_synced"));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        setTheme,
        dyslexic,
        setDyslexic,
        privacyMode,
        setPrivacyMode,
        isOffline,
        setIsOffline,
        consentAccepted,
        setConsentAccepted,
        offlineQueue,
        addOfflineRequest,
        syncOfflineQueue,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within an AccessibilityProvider");
  return context;
};
