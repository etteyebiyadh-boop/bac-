"use client";

import { CSSProperties } from "react";

interface VideoPlayerProps {
  url: string;
  title?: string;
  style?: CSSProperties;
}

export function VideoPlayer({ url, title, style }: VideoPlayerProps) {
  if (!url) return null;

  // Simple logic to convert watch URLs to embed URLs
  let embedUrl = url;
  
  if (url.includes("youtube.com/watch?v=")) {
    embedUrl = url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be/")) {
    embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
  } else if (url.includes("tiktok.com/")) {
    // Basic TikTok embed logic
    const videoId = url.split("/video/")[1]?.split("?")[0];
    if (videoId) {
      embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    }
  }

  return (
    <div 
      className="card stack" 
      style={{ 
        padding: "0", 
        overflow: "hidden", 
        background: "black", 
        aspectRatio: "16/9", 
        border: "1px solid var(--primary)",
        boxShadow: "0 0 40px rgba(99, 102, 241, 0.2)",
        ...style 
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title={title || "Video Tutorial"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: "none" }}
      />
    </div>
  );
}
