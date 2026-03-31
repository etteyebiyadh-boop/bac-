"use client";

import { useEffect, useCallback } from "react";

// Anti-screenshot and content protection utilities
// NOTE: These are deterrents only - complete prevention is impossible on web platforms

export function useContentProtection() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Block common screenshot shortcuts
    const blockedKeys = [
      { key: "PrintScreen" },
      { key: "F12" }, // Dev tools
      { ctrl: true, shift: true, key: "i" }, // Dev tools
      { ctrl: true, shift: true, key: "j" }, // Dev tools
      { ctrl: true, shift: true, key: "c" }, // Dev tools
      { ctrl: true, key: "u" }, // View source
      { ctrl: true, key: "s" }, // Save page
      { ctrl: true, key: "p" }, // Print
    ];

    for (const combo of blockedKeys) {
      const ctrlMatch = combo.ctrl ? e.ctrlKey : true;
      const shiftMatch = combo.shift ? e.shiftKey : true;
      const keyMatch = e.key.toLowerCase() === combo.key?.toLowerCase();
      
      if (ctrlMatch && shiftMatch && keyMatch) {
        e.preventDefault();
        e.stopPropagation();
        showWarning();
        return false;
      }
    }
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    showWarning();
  }, []);

  const handleCopy = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    showWarning();
  }, []);

  const handleBlur = useCallback(() => {
    // When window loses focus, potentially due to screenshot tool
    document.body.classList.add("content-blurred");
    setTimeout(() => {
      document.body.classList.remove("content-blurred");
    }, 500);
  }, []);

  const showWarning = () => {
    // Remove existing warning if present
    const existing = document.querySelector(".content-warning-overlay");
    if (existing) existing.remove();

    const warning = document.createElement("div");
    warning.innerHTML = `
      <div class="content-warning-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: system-ui;
      ">
        <div style="
          background: #1a1a2e;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          max-width: 400px;
          border: 2px solid #e94560;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
          <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
          <h2 style="color: #e94560; margin-bottom: 16px; font-size: 24px;">Content Protected</h2>
          <p style="color: #fff; margin-bottom: 24px; line-height: 1.6;">
            Screenshots, screen recording, and content copying are prohibited.<br><br>
            This content is exclusively for authorized users.<br>
            <span style="color: #f59e0b; font-size: 12px;">Violations will result in account suspension.</span>
          </p>
          <button id="close-warning" style="
            background: #e94560;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          ">I Understand</button>
        </div>
      </div>
    `;
    document.body.appendChild(warning);

    // Add click handler
    const closeBtn = warning.querySelector("#close-warning");
    closeBtn?.addEventListener("click", () => warning.remove());
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      warning.remove();
    }, 5000);
  };

  useEffect(() => {
    // Add CSS protections
    const style = document.createElement("style");
    style.id = "content-protection-css";
    style.textContent = `
      /* Prevent text selection */
      .protected-content {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      /* Allow selection in input fields */
      .protected-content input, 
      .protected-content textarea, 
      .protected-content [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Disable drag on images */
      .protected-content img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
      }
      
      /* Blur effect when window loses focus */
      .content-blurred {
        filter: blur(20px) !important;
        transition: filter 0.2s ease;
      }
      
      /* Hide content when printing */
      @media print {
        .protected-content { 
          display: none !important; 
        }
        body::before {
          content: "Printing is disabled on this platform";
          display: block;
          text-align: center;
          padding: 50px;
          font-size: 24px;
          font-family: system-ui;
        }
      }
      
      /* Watermark overlay styling */
      .user-watermark {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
      }
      
      .user-watermark-text {
        font-size: 20px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.08);
        text-transform: uppercase;
        letter-spacing: 3px;
        white-space: nowrap;
        transform: rotate(-30deg);
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    // Add protected-content class to body
    document.body.classList.add("protected-content");

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCopy, true);
    window.addEventListener("blur", handleBlur);

    // Detect dev tools opening
    let devToolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if ((widthThreshold || heightThreshold) && !devToolsOpen) {
        devToolsOpen = true;
        showWarning();
      }
    };
    
    window.addEventListener("resize", detectDevTools);
    const interval = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCopy, true);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", detectDevTools);
      clearInterval(interval);
      
      const existingStyle = document.getElementById("content-protection-css");
      if (existingStyle) existingStyle.remove();
      
      document.body.classList.remove("protected-content");
    };
  }, [handleKeyDown, handleContextMenu, handleCopy, handleBlur]);
}

// Component to add watermark with user info
export function UserWatermark({ userId, userName }: { userId: string; userName?: string }) {
  const watermarkText = `${userName || "USER"} - ${userId.slice(0, 8)} - CONFIDENTIAL`;
  
  // Generate multiple watermarks across the screen
  const watermarks = [];
  const rows = 6;
  const cols = 4;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      watermarks.push(
        <div
          key={`${row}-${col}`}
          className="user-watermark-text"
          style={{
            position: "absolute",
            top: `${(row * 100) / rows + 10}%`,
            left: `${(col * 100) / cols}%`,
            transform: "rotate(-30deg)",
          }}
        >
          {watermarkText}
        </div>
      );
    }
  }

  return (
    <div className="user-watermark">
      {watermarks}
    </div>
  );
}
