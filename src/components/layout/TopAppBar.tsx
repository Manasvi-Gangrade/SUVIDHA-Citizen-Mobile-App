import { Bell, User, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTTS, GoogleTranslateWidget } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface TopAppBarProps {
  title?: string;
  className?: string;
}

export default function TopAppBar({ title, className }: TopAppBarProps) {
  return null;
}

