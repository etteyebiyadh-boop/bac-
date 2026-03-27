"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardIcon, LessonsIcon, WriteIcon, ExamsIcon, ProfileIcon } from "./icons";

interface MobileBottomNavProps {
  session: any;
  translations: any;
  lang: string;
}

export function MobileBottomNav({ session, translations: t, lang }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up (thumb-friendly)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      
      // Hide when scrolling down, show when scrolling up
      if (scrollDiff > 10 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (scrollDiff < -10 || currentScrollY < 100) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { href: "/dashboard", icon: DashboardIcon, label: t.nav_dashboard || "Dashboard" },
    { href: "/lessons", icon: LessonsIcon, label: t.nav_library || "Library" },
    { href: "/write", icon: WriteIcon, label: t.nav_writing || "Write" },
    { href: "/exams", icon: ExamsIcon, label: t.nav_exams || "Exams" },
    { href: "/profile", icon: ProfileIcon, label: "Profile" },
  ];

  // Don't show bottom nav on desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <nav 
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "8px 16px calc(8px + env(safe-area-inset-bottom))",
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        maxWidth: "500px",
        margin: "0 auto",
      }}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-item micro-bounce"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "8px 12px",
                borderRadius: "16px",
                textDecoration: "none",
                minWidth: "60px",
                minHeight: "56px",
                transition: "all 0.2s ease",
                background: isActive ? "rgba(99, 102, 241, 0.2)" : "transparent",
                color: isActive ? "#6366f1" : "rgba(255, 255, 255, 0.6)",
              }}
            >
              <IconComponent 
                className="w-6 h-6" 
                style={{ 
                  filter: isActive ? "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))" : "none",
                  transition: "all 0.2s ease",
                }} 
              />
              <span style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "inherit",
                transition: "all 0.2s ease",
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  position: "absolute",
                  bottom: "4px",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#6366f1",
                  boxShadow: "0 0 8px #6366f1",
                }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
