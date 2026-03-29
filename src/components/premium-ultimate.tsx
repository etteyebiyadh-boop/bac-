"use client";

import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, ReactNode, useCallback, useRef } from "react";

// ==========================================
// ULTIMATE PREMIUM EFFECTS - FINAL BOOST
// $10M+ Platform Quality
// ==========================================

// ==========================================
// TEXT SCRAMBLE EFFECT (Cyberpunk Style)
// ==========================================

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TextScramble({ text, className = "", delay = 0, duration = 2000 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text.split("").map(() => " ").join(""));
  const [started, setStarted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }
    
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay, prefersReducedMotion, text]);
  
  useEffect(() => {
    if (!started || prefersReducedMotion) return;
    
    let iteration = 0;
    const totalIterations = text.length * 3;
    const interval = duration / totalIterations;
    
    const timer = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      
      iteration++;
      
      if (iteration >= totalIterations) {
        clearInterval(timer);
        setDisplayText(text);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [started, text, duration, prefersReducedMotion]);
  
  return <span className={`font-mono ${className}`}>{displayText}</span>;
}

// ==========================================
// SPOTLIGHT FOLLOW EFFECT
// ==========================================

interface SpotlightProps {
  color?: string;
  size?: number;
  className?: string;
}

export function Spotlight({ color = "rgba(99, 102, 241, 0.15)", size = 400, className = "" }: SpotlightProps) {
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, size, isMobile, prefersReducedMotion]);
  
  if (isMobile || prefersReducedMotion) return null;
  
  return (
    <motion.div
      className={`fixed pointer-events-none z-[1] rounded-full ${className}`}
      style={{
        x,
        y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

// ==========================================
// MORPHING BLOB BACKGROUND
// ==========================================

interface MorphingBlobProps {
  colors?: string[];
  className?: string;
}

export function MorphingBlob({ 
  colors = ["#6366f1", "#a855f7", "#ec4899"],
  className = "" 
}: MorphingBlobProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: color,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={prefersReducedMotion ? {} : {
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            borderRadius: ["50%", "40% 60% 70% 30%", "50%"],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes morph {
          0%, 100% { border-radius: 50%; }
          25% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// ANIMATED GRADIENT TEXT
// ==========================================

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export function AnimatedGradientText({ 
  children, 
  className = "",
  colors = ["#6366f1", "#a855f7", "#ec4899", "#6366f1"],
  speed = 3
}: AnimatedGradientTextProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
  
  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
      }}
      animate={prefersReducedMotion ? {} : {
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

// ==========================================
// SMOOTH SCROLL PROVIDER
// ==========================================

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const targetScrollY = useRef(0);
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    let rafId: number;
    
    const handleScroll = () => {
      targetScrollY.current = window.scrollY;
    };
    
    const animate = () => {
      setScrollY(prev => {
        const diff = targetScrollY.current - prev;
        return prev + diff * 0.1;
      });
      rafId = requestAnimationFrame(animate);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);
  
  if (prefersReducedMotion) return <>{children}</>;
  
  return (
    <div style={{ transform: `translateY(${-scrollY * 0.02}px)` }}>
      {children}
    </div>
  );
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

export function Typewriter({ 
  text, 
  className = "", 
  speed = 50,
  delay = 0,
  cursor = true 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(cursor);
  const [started, setStarted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }
    
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay, prefersReducedMotion, text]);
  
  useEffect(() => {
    if (!started || prefersReducedMotion) return;
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (cursor) {
          setTimeout(() => {
            setShowCursor(false);
          }, 1000);
        }
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [started, text, speed, cursor, prefersReducedMotion]);
  
  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
}

// ==========================================
// FLOATING ELEMENTS
// ==========================================

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export function FloatingElements({ count = 5, className = "" }: FloatingElementsProps) {
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();
  
  if (isMobile || prefersReducedMotion) return null;
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500/30" />
        </motion.div>
      ))}
    </div>
  );
}

// ==========================================
// GLOW BORDER EFFECT
// ==========================================

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
  intensity?: number;
}

export function GlowBorder({ 
  children, 
  className = "", 
  color = "#6366f1",
  intensity = 0.5 
}: GlowBorderProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`relative rounded-2xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? `0 0 ${20 * intensity}px ${color}, 0 0 ${40 * intensity}px ${color}40, inset 0 0 ${20 * intensity}px ${color}20`
          : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl -z-10 overflow-hidden"
        animate={isHovered ? {
          background: [
            `linear-gradient(0deg, ${color}00, ${color}40, ${color}00)`,
            `linear-gradient(90deg, ${color}00, ${color}40, ${color}00)`,
            `linear-gradient(180deg, ${color}00, ${color}40, ${color}00)`,
            `linear-gradient(270deg, ${color}00, ${color}40, ${color}00)`,
            `linear-gradient(360deg, ${color}00, ${color}40, ${color}00)`,
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{
          background: isHovered ? undefined : `linear-gradient(0deg, ${color}00, ${color}20, ${color}00)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ==========================================
// REVEAL MASK
// ==========================================

interface RevealMaskProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function RevealMask({ 
  children, 
  className = "",
  direction = "up",
  delay = 0
}: RevealMaskProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  const directions = {
    up: { clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"] },
    down: { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"] },
    left: { clipPath: ["inset(0 100% 0 0)", "inset(0 0 0 0)"] },
    right: { clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0)"] },
  };
  
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? {} : directions[direction]}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// PULSE RING
// ==========================================

interface PulseRingProps {
  className?: string;
  color?: string;
  size?: number;
  count?: number;
}

export function PulseRing({ 
  className = "", 
  color = "#6366f1",
  size = 100,
  count = 3
}: PulseRingProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.5 + i * 0.3],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
      <div 
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    </div>
  );
}

// ==========================================
// DEVICE CAPABILITIES HOOK
// ==========================================

function useDeviceCapabilities() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const check = () => {
      const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
      const lowPower = 'connection' in navigator && (navigator as any).connection?.saveData === true;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(mobile);
      setIsLowPower(lowPower);
      setPrefersReducedMotion(reducedMotion);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return { isMobile, isLowPower, prefersReducedMotion };
}

// Export
export { useDeviceCapabilities };
