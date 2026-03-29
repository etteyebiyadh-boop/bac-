"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, ReactNode, useCallback, useRef } from "react";

// ==========================================
// ULTIMATE PREMIUM MICRO-INTERACTIONS
// $1M+ Platform Effects
// ==========================================

// Hook to detect capabilities
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

// ==========================================
// CUSTOM CURSOR WITH GLOW TRAIL
// ==========================================

interface CustomCursorProps {
  color?: string;
  size?: number;
  trailLength?: number;
}

export function CustomCursor({ color = "#6366f1", size = 20, trailLength = 8 }: CustomCursorProps) {
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      setTrail(prev => {
        const newTrail = [{ x: e.clientX, y: e.clientY }, ...prev].slice(0, trailLength);
        return newTrail;
      });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Track hoverable elements
    const hoverables = document.querySelectorAll('a, button, [data-hoverable]');
    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);
    
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });
    
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [cursorX, cursorY, isMobile, prefersReducedMotion, trailLength]);
  
  if (isMobile || prefersReducedMotion) return null;
  
  return (
    <>
      {/* Trail dots */}
      {trail.map((point, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none z-[9998] rounded-full"
          style={{
            x: point.x - size / 2,
            y: point.y - size / 2,
            width: size * (1 - i / trailLength) * 0.5,
            height: size * (1 - i / trailLength) * 0.5,
            backgroundColor: color,
            opacity: (1 - i / trailLength) * 0.3,
            filter: `blur(${(i / trailLength) * 4}px)`,
          }}
        />
      ))}
      
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? size * 2.5 : size,
          height: isHovering ? size * 2.5 : size,
          backgroundColor: isClicking ? "#fff" : color,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isHovering
              ? `0 0 30px ${color}, 0 0 60px ${color}`
              : `0 0 20px ${color}, 0 0 40px ${color}`,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}

// ==========================================
// MAGNETIC BUTTON WITH ELASTIC PHYSICS
// ==========================================

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  href?: string;
  strength?: number; // Magnetic pull strength
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  onClick,
  href,
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => setIsHovered(true);
  
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-full overflow-hidden";
  
  const variants = {
    primary: "bg-white text-black",
    secondary: "bg-white/10 text-white border border-white/20",
    ghost: "text-white/70 hover:text-white",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  const content = (
    <>
      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-200%" }}
        animate={{ x: isHovered ? "200%" : "-200%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Elastic bounce background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1.1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </>
  );
  
  const props = {
    ref: ref as any,
    className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    onClick,
    style: {
      x: xSpring,
      y: ySpring,
    },
  };
  
  if (href) {
    return (
      <motion.a href={href} {...props} whileTap={{ scale: 0.95 }}>
        {content}
      </motion.a>
    );
  }
  
  return (
    <motion.button {...props} whileTap={{ scale: 0.95 }}>
      {content}
    </motion.button>
  );
}

// ==========================================
// PREMIUM LOADING SKELETON
// ==========================================

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

export function PremiumSkeleton({
  variant = "text",
  width,
  height,
  className = "",
  lines = 1,
}: SkeletonProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  const shimmer = prefersReducedMotion ? {} : {
    background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)",
    backgroundSize: "200% 100%",
  };
  
  const baseClasses = "relative overflow-hidden rounded-lg bg-white/5";
  
  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl p-6",
  };
  
  if (variant === "card") {
    return (
      <div className={`${baseClasses} ${variants[variant]} ${className}`} style={{ width, height }}>
        <motion.div
          className="absolute inset-0"
          style={shimmer}
          animate={prefersReducedMotion ? {} : {
            backgroundPosition: ["200% 0", "-200% 0"],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <div className="space-y-3">
          <div className="h-8 w-1/3 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-2/3 bg-white/10 rounded" />
        </div>
      </div>
    );
  }
  
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={{ width: i === lines - 1 ? "70%" : width, height }}
          >
            <motion.div
              className="absolute inset-0"
              style={shimmer}
              animate={prefersReducedMotion ? {} : {
                backgroundPosition: ["200% 0", "-200% 0"],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} style={{ width, height }}>
      <motion.div
        className="absolute inset-0"
        style={shimmer}
        animate={prefersReducedMotion ? {} : {
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ==========================================
// PAGE TRANSITION WRAPPER
// ==========================================

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// CONFETTI / CELEBRATION EFFECT
// ==========================================

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  shape: "circle" | "square" | "triangle";
}

interface ConfettiProps {
  trigger: boolean;
  origin?: { x: number; y: number };
  count?: number;
  onComplete?: () => void;
}

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

export function Confetti({ trigger, origin = { x: 0.5, y: 0.5 }, count = 50, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  useEffect(() => {
    if (!trigger || prefersReducedMotion) return;
    
    const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 300 + 200),
      rotation: Math.random() * 720 - 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as any,
    }));
    
    setPieces(newPieces);
    
    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [trigger, count, onComplete, prefersReducedMotion]);
  
  if (prefersReducedMotion || pieces.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${origin.x * 100}%`,
            top: `${origin.y * 100}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "square" ? "2px" : "0",
            clipPath: piece.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: piece.x,
            y: piece.y + 400,
            rotate: piece.rotation,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

// ==========================================
// FILM GRAIN NOISE OVERLAY
// ==========================================

export function FilmGrain() {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  if (prefersReducedMotion) return null;
  
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9990] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        animation: "grain 0.5s steps(10) infinite",
      }}
    />
  );
}

// ==========================================
// ULTRA 3D TILT CARD
// ==========================================

interface UltraTiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  scale?: number;
  maxTilt?: number;
}

export function UltraTiltCard({
  children,
  className = "",
  glareEnabled = true,
  scale = 1.02,
  maxTilt = 15,
}: UltraTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile || prefersReducedMotion) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
    
    setTransform({ rotateX, rotateY });
    
    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };
  
  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };
  
  const handleMouseEnter = () => setIsHovered(true);
  
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: isHovered ? scale : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
      
      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.15 : 0,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
          }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}

// ==========================================
// SPARKLE TEXT (Animated letters)
// ==========================================

interface SparkleTextProps {
  text: string;
  className?: string;
  sparkles?: boolean;
}

export function SparkleText({ text, className = "", sparkles = true }: SparkleTextProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  return (
    <span className={`relative inline-block ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      
      {sparkles && !prefersReducedMotion && (
        <motion.span
          className="absolute -top-2 -right-4 text-lg"
          animate={{
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          ✨
        </motion.span>
      )}
    </span>
  );
}

// ==========================================
// BREATHING ANIMATION WRAPPER
// ==========================================

interface BreathingProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function Breathing({ children, className = "", intensity = 1 }: BreathingProps) {
  const { prefersReducedMotion } = useDeviceCapabilities();
  
  return (
    <motion.div
      className={className}
      animate={prefersReducedMotion ? {} : {
        scale: [1, 1 + 0.01 * intensity, 1],
        opacity: [1, 0.95, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// RIPPLE BUTTON EFFECT
// ==========================================

interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RippleButton({ children, className = "", onClick }: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples((prev) => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    
    onClick?.();
  };
  
  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Export all
export { useDeviceCapabilities };
