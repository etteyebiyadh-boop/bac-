"use client";

import { useContentProtection, UserWatermark } from "@/lib/content-protection";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  fullName: string | null;
  isPremium: boolean;
};

export function ContentProtectionProvider({ children }: { children: React.ReactNode }) {
  // Enable content protection for all users
  useContentProtection();
  
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Fetch current user from API
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);
  
  // Get user info for watermarking
  const userId = user?.id || "anonymous";
  const userName = user?.fullName || user?.email || undefined;
  const isAdmin = user?.email === "anis@bacexcellence.com"; // Simple admin check
  
  // Don't show watermark for admin users (they own the content)
  const showWatermark = !isAdmin && userId !== "anonymous";

  return (
    <>
      {showWatermark && <UserWatermark userId={userId} userName={userName} />}
      {children}
    </>
  );
}
