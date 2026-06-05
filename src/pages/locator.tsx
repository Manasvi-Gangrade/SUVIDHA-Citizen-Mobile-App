import { useState } from "react";
import { useLocation } from "wouter";
import PageTransition from "@/components/PageTransition";
import TopAppBar from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import {
  MapPin, Clock, ArrowRight, Navigation,
  Star, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Kiosk {
  id: string;
  name: string;
  location: string;
  distance: string;
  queueStatus: "Low" | "Moderate" | "High";
  peopleWaiting: number;
  openUntil: string;
  lat: number; // relative SVG coordinates
  lng: number;
  rating: number;
  amenities: string[];
}

const MOCK_KIOSKS: Kiosk[] = [
  {
    id: "K-12",
    name: "Dispur Ward Center Kiosk",
    location: "Opposite Secretariat Gate, Dispur",
    distance: "0.8 km",
    queueStatus: "Low",
    peopleWaiting: 2,
    openUntil: "6:00 PM",
    lat: 140,
    lng: 160,
    rating: 4.8,
    amenities: ["🖨️ Printer", "💳 Cash & Card", "🗣️ Voice Helper"]
  },
  {
    id: "K-04",
    name: "Paltan Bazaar Municipal Kiosk",
    location: "Railway Station Complex, Platform 1 Entrance",
    distance: "1.5 km",
    queueStatus: "High",
    peopleWaiting: 14,
    openUntil: "8:00 PM",
    lat: 90,
    lng: 220,
    rating: 4.2,
    amenities: ["🖨️ Printer", "💳 Card Only"]
  },
  {
    id: "K-08",
    name: "Ganeshguri Civic Hub",
    location: "Under Ganeshguri Flyover Market Complex",
    distance: "2.3 km",
    queueStatus: "Moderate",
    peopleWaiting: 7,
    openUntil: "5:30 PM",
    lat: 190,
    lng: 110,
    rating: 4.5,
    amenities: ["🖨️ Printer", "🗣️ Voice Helper", "🪪 Aadhaar Scanner"]
  },
  {
    id: "K-19",
    name: "Silpukhuri Citizen Desk",
    location: "Guwahati Municipal Office, Ward 10",
    distance: "3.1 km",
    queueStatus: "Low",
    peopleWaiting: 1,
    openUntil: "5:00 PM",
    lat: 70,
    lng: 80,
    rating: 4.9,
    amenities: ["💳 Cash & Card", "🪪 Aadhaar Scanner"]
  }
];

export default function KioskLocator() {
  const [, setLocation] = useLocation();
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk>(MOCK_KIOSKS[0]);
  const [filter, setFilter] = useState<"all" | "near" | "low">("all");
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredKiosks = MOCK_KIOSKS.filter(k => {
    if (filter === "near") return parseFloat(k.distance) < 2.0;
    if (filter === "low") return k.queueStatus === "Low";
    return true;
  });

  const getStatusColor = (status: Kiosk["queueStatus"]) => {
    if (status === "Low") return "bg-emerald-500 border-emerald-200 text-emerald-700";
    if (status === "Moderate") return "bg-amber-500 border-amber-200 text-amber-700";
    return "bg-rose-500 border-rose-200 text-rose-700";
  };

  const handleBookToken = (kiosk: Kiosk) => {
    toast.success(`Booking token at ${kiosk.name}...`);
    // Pre-populate logic could go to localStorage
    setTimeout(() => {
      setLocation("/queue");
    }, 800);
  };

  return (
    <PageTransition>
      <div className="flex flex-col bg-gray-50 min-h-full pb-8">
        <TopAppBar title="Live Kiosk Locator" />

        {/* Filter Toolbar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 shrink-0 flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide transition-all border shrink-0",
              filter === "all"
                ? "bg-suvidha-navy text-white border-suvidha-navy shadow-xs"
                : "bg-gray-50 text-gray-500 border-gray-100"
            )}
          >
            Show All ({MOCK_KIOSKS.length})
          </button>
          <button
            onClick={() => setFilter("near")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide transition-all border shrink-0",
              filter === "near"
                ? "bg-suvidha-navy text-white border-suvidha-navy shadow-xs"
                : "bg-gray-50 text-gray-500 border-gray-100"
            )}
          >
            Near Me (&lt; 2km)
          </button>
          <button
            onClick={() => setFilter("low")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide transition-all border shrink-0",
              filter === "low"
                ? "bg-suvidha-navy text-white border-suvidha-navy shadow-xs"
                : "bg-gray-50 text-gray-500 border-gray-100"
            )}
          >
            Low Queue Only
          </button>
        </div>

        {/* Live Vector Map View */}
        <div className="relative w-full h-[260px] bg-[#eef2f5] overflow-hidden border-b border-gray-200 select-none shrink-0">
          
          {/* Compass layout background grid */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-15 pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-slate-400 border-dashed" />
            ))}
          </div>

          {/* SVG Map Path Drawing simulating city roads */}
          <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none opacity-40">
            {/* Main roads */}
            <line x1="0" y1="120" x2="430" y2="120" stroke="white" strokeWidth="16" />
            <line x1="150" y1="0" x2="150" y2="260" stroke="white" strokeWidth="12" />
            <line x1="300" y1="0" x2="300" y2="260" stroke="white" strokeWidth="12" />
            <path d="M 0,200 Q 200,100 430,220" fill="none" stroke="white" strokeWidth="14" />
            
            {/* Secondary roads dashed */}
            <line x1="0" y1="120" x2="430" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="150" y1="0" x2="150" y2="260" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="300" y1="0" x2="300" y2="260" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

          {/* Pulsing User Current Location Pin */}
          <div className="absolute left-[150px] top-[120px] -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-suvidha-navy/20 animate-ping opacity-75" />
            <div className="relative w-4 h-4 rounded-full bg-suvidha-navy border-2 border-white flex items-center justify-center shadow-md">
              <Compass className="w-2.5 h-2.5 text-white animate-spin-slow" />
            </div>
          </div>

          {/* Render Kiosk Markers */}
          {filteredKiosks.map(k => {
            const active = selectedKiosk.id === k.id;
            const status = k.queueStatus;
            const markerBg = status === "Low" ? "bg-emerald-500" : status === "Moderate" ? "bg-amber-500" : "bg-rose-500";
            
            return (
              <button
                key={k.id}
                onClick={() => setSelectedKiosk(k)}
                style={{ left: k.lat, top: k.lng }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-0.5",
                  "transition-all duration-350 active:scale-90"
                )}
              >
                {/* Info preview tooltip on top if active */}
                {active && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-suvidha-navy text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm whitespace-nowrap mb-0.5 border border-white/10"
                  >
                    {k.distance} · {k.peopleWaiting} waiting
                  </motion.div>
                )}

                {/* Marker Pin */}
                <div className={cn(
                  "relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200",
                  active
                    ? "bg-suvidha-navy border-white scale-110 z-30"
                    : `${markerBg} border-white/60`
                )}>
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  
                  {/* Glowing border if active */}
                  {active && (
                    <span className="absolute inset-[-4px] border-2 border-suvidha-navy rounded-full animate-pulse pointer-events-none" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Map Controls */}
          <div className="absolute right-3.5 bottom-3.5 flex flex-col gap-1.5 z-30">
            <button
              onClick={() => toast.info("Zoom In Simulated")}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 shadow-sm active:bg-gray-50"
            >
              +
            </button>
            <button
              onClick={() => toast.info("Zoom Out Simulated")}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 shadow-sm active:bg-gray-50"
            >
              −
            </button>
          </div>

        </div>

        {/* Selected Kiosk Detail Card Drawer */}
        <div className="px-4.5 pt-4.5 space-y-4 flex-1">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedKiosk.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
            >
              {/* Header Details */}
              <div className="p-4.5 border-b border-gray-100 space-y-3">
                
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">{selectedKiosk.id} · SUVIDHA KIOSK</span>
                    <h3 className="font-heading font-black text-gray-800 text-[15px]">{selectedKiosk.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-lg border border-yellow-100 shrink-0">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-black">{selectedKiosk.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-suvidha-saffron shrink-0" />
                  <span className="truncate">{selectedKiosk.location}</span>
                </div>

              </div>

              {/* Status details columns */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 py-3.5 bg-gray-50/50 text-center">
                
                <div>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase block">Distance</span>
                  <span className="text-sm font-black text-suvidha-navy block mt-0.5">{selectedKiosk.distance}</span>
                </div>

                <div>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase block">Queue Load</span>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span className={cn("w-2 h-2 rounded-full", getStatusColor(selectedKiosk.queueStatus).split(" ")[0])} />
                    <span className={cn("text-xs font-black", getStatusColor(selectedKiosk.queueStatus).split(" ")[2])}>
                      {selectedKiosk.queueStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase block">People Waiting</span>
                  <span className="text-sm font-black text-gray-800 block mt-0.5">{selectedKiosk.peopleWaiting}</span>
                </div>

              </div>

              {/* Amenities, timing & button actions */}
              <div className="p-4.5 space-y-4">
                
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Open till {selectedKiosk.openUntil}</span>
                  </div>
                  <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">🟢 Active Online</span>
                </div>

                {/* Available services list */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest block">Machine Amenities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedKiosk.amenities.map(a => (
                      <span key={a} className="px-2.5 py-1 bg-white border border-gray-200/80 text-[10px] text-gray-600 font-bold rounded-lg shadow-2xs">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  
                  <Button
                    onClick={() => {
                      toast.success(`Navigating to ${selectedKiosk.name} in external maps...`);
                      window.open(`https://maps.google.com/?q=${selectedKiosk.name}`);
                    }}
                    className="h-11 text-xs rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.97] transition-transform font-bold"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-1.5 text-suvidha-saffron" />
                    Directions
                  </Button>

                  <Button
                    onClick={() => handleBookToken(selectedKiosk)}
                    className="h-11 text-xs rounded-xl bg-suvidha-navy hover:bg-suvidha-navy/95 text-white active:scale-[0.97] transition-transform font-bold"
                  >
                    Book Queue Token
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>

                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </PageTransition>
  );
}
