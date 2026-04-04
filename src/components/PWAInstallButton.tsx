"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, CheckCircle2 } from "lucide-react";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
       setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
      setIsInstalled(true);
    }
  };

  if (!isVisible && !isInstalled) return null;

  return (
    <div className="card-vibrant hover-scale" style={{ 
      padding: "24px", 
      background: "rgba(255,255,255,0.02)", 
      border: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      cursor: "pointer"
    }} onClick={isInstalled ? undefined : handleInstall}>
      <div style={{
         padding: "12px",
         background: isInstalled ? "rgba(34, 197, 94, 0.1)" : "rgba(99, 102, 241, 0.1)",
         borderRadius: "12px",
         color: isInstalled ? "#22c55e" : "var(--primary)"
      }}>
         {isInstalled ? <CheckCircle2 size={24} /> : <Smartphone size={24} className="pulse" />}
      </div>
      <div className="stack" style={{ gap: "4px" }}>
        <h4 style={{ fontWeight: 800, fontSize: "14px" }}>
           {isInstalled ? "BAC EXCELLENCE ON MOBILE" : "DOWNLOAD BAC EXCELLENCE"}
        </h4>
        <p className="muted" style={{ fontSize: "12px" }}>
           {isInstalled ? "App successfully installed." : "Unlock the full-screen experience on your phone."}
        </p>
      </div>
      {!isInstalled && (
         <div style={{ marginLeft: "auto", opacity: 0.6 }}>
            <Download size={18} />
         </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
         .pulse { animation: pulseAnim 2s infinite; }
         @keyframes pulseAnim {
           0% { transform: scale(1); opacity: 1; }
           50% { transform: scale(1.1); opacity: 0.8; }
           100% { transform: scale(1); opacity: 1; }
         }
      `}} />
    </div>
  );
}
