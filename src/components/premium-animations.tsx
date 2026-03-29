"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

// ==========================================
// 3D TILT CARD - Premium hover interaction
// ==========================================
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export function TiltCard({ children, className = "", glowColor = "#6366f1", intensity = 15 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}20 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ==========================================
// PREMIUM BUTTON - Magnetic hover effect
// ==========================================
interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function PremiumButton({ 
  children, 
  variant = "primary", 
  size = "md",
  onClick,
  href,
  className = ""
}: PremiumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = "relative overflow-hidden font-bold transition-all duration-300 ease-out";
  
  const sizeClasses = {
    sm: "px-6 py-3 text-sm rounded-full",
    md: "px-8 py-4 text-base rounded-full",
    lg: "px-12 py-5 text-lg rounded-2xl"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary: "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20",
    outline: "bg-transparent text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/5"
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={buttonRef as any}
      href={href}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Glow ring */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={isHovered ? { 
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.6), inset 0 0 20px rgba(255,255,255,0.1)" 
          } : { 
            boxShadow: "0 0 0px rgba(99, 102, 241, 0)" 
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </Component>
  );
}

// ==========================================
// ANIMATED COUNTER - Premium number animation
// ==========================================
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2,
  className = ""
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = { value: 0 };
    const target = value;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setDisplayValue(Math.round(target * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

// ==========================================
// SCROLL REVEAL - Premium entrance animations
// ==========================================
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({ 
  children, 
  direction = "up", 
  delay = 0,
  duration = 0.8,
  className = "",
  once = true
}: ScrollRevealProps) {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction],
        filter: "blur(10px)"
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        filter: "blur(0px)"
      }}
      viewport={{ once, margin: "-100px" }}
      transition={{ 
        duration, 
        delay,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// STAGGER CONTAINER - Animated list reveal
// ==========================================
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = "" 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// FLOATING ELEMENTS - Ambient motion
// ==========================================
interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  amplitude = 20,
  duration = 6,
  delay = 0,
  className = ""
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// TEXT REVEAL - Character by character
// ==========================================
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
}

export function TextReveal({ 
  text, 
  className = "",
  delay = 0,
  charDelay = 0.03
}: TextRevealProps) {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: charDelay,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.3, ease: "easeOut" }
            }
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ==========================================
// PARALLAX WRAPPER - Scroll-based depth
// ==========================================
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ 
  children, 
  speed = 0.5,
  className = "" 
}: ParallaxProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ==========================================
// SPARKLE EFFECT - Premium micro-interaction
// ==========================================
interface SparkleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SparkleButton({ children, onClick, className = "" }: SparkleButtonProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newSparkle = { id: idRef.current++, x, y };
    setSparkles(prev => [...prev, newSparkle]);
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
    
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-visible ${className}`}
    >
      {children}
      {sparkles.map(sparkle => (
        <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
      ))}
    </motion.button>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ 
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        x: [0, (Math.random() - 0.5) * 60],
        y: [0, (Math.random() - 0.5) * 60]
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
          d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
          fill="url(#sparkle-gradient)"
        />
        <defs>
          <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// ==========================================
// PREMIUM CARD - 3D hover with gradient border
// ==========================================
interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function PremiumCard({ 
  children, 
  className = "",
  gradient = "from-indigo-500/20 via-purple-500/20 to-pink-500/20"
}: PremiumCardProps) {
  return (
    <TiltCard className={className}>
      <div className={`relative rounded-3xl bg-gradient-to-br ${gradient} p-[1px]`}>
        <div className="relative rounded-3xl bg-[#0a0a12]/90 backdrop-blur-xl p-6 overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ==========================================
// LOADING SKELETON - Premium shimmer
// ==========================================
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function PremiumSkeleton({ className = "", width = "100%", height = "20px" }: SkeletonProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-white/5 ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
}

// ==========================================
// HOVER SCALE IMAGE - Premium media
// ==========================================
interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function HoverImage({ 
  src, 
  alt, 
  className = "",
  containerClassName = ""
}: HoverImageProps) {
  return (
    <motion.div 
      className={`overflow-hidden rounded-2xl ${containerClassName}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      />
    </motion.div>
  );
}

// ==========================================
// PROGRESS RING - Animated SVG
// ==========================================
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className = "",
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// BLURRY GRADIENT ORBS - Ambient background
// ==========================================
export function AmbientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
          top: "-20%",
          left: "-10%"
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          bottom: "-10%",
          right: "-5%"
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "40%",
          left: "60%"
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}

// ==========================================
// PARTICLE FIELD - Interactive background
// ==========================================

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleField({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
