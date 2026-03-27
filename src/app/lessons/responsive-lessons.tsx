"use client";

import { useEffect, useState } from "react";
import { MobileLessons } from "./mobile-lessons";

interface ResponsiveLessonsProps {
  children: React.ReactNode;
  mobileComponent: React.ReactNode;
}

export function ResponsiveLessons({ children, mobileComponent }: ResponsiveLessonsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div style={{ padding: "20px" }}>
        <div className="card skeleton" style={{ height: "200px", borderRadius: "16px" }} />
      </div>
    );
  }

  return isMobile ? <>{mobileComponent}</> : <>{children}</>;
}
