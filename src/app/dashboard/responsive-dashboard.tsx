"use client";

import { useEffect, useState } from "react";
import { MobileDashboard } from "./mobile-dashboard";

interface ResponsiveDashboardProps {
  children: React.ReactNode;
  mobileComponent: React.ReactNode;
}

export function ResponsiveDashboard({ children, mobileComponent }: ResponsiveDashboardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  return isMobile ? <>{mobileComponent}</> : <>{children}</>;
}
