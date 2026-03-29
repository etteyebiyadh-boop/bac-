"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ReactNode, useCallback } from "react";

// ==========================================
// PERFORMANCE-OPTIMIZED PREMIUM COMPONENTS
// Vercel Free Tier Compatible
// ==========================================

// Hook to detect mobile/low-power devices
function useDeviceCapabilities() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  
  useEffect(() => {
    const check = () => {
      const mobile = window.matchMedia('(pointer: coarse)').matches || 
                     window.innerWidth < 768;
      const lowPower = 'connection' in navigator && 
                       (navigator as any).connection?.saveData === true;
      setIsMobile(mobile);
      setIsLowPower(lowPower);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return { isMobile, isLowPower };
}

// ==========================================
// LIGHTWEIGHT CSS 3D HERO (NO THREE.JS)
// ==========================================

interface LightweightHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function LightweightHero({
  badge,
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: LightweightHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* CSS-Only Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-30 bg-gradient-radial from-indigo-500/40 to-transparent -top-[10%] -left-[10%] animate-float-slow" />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 bg-gradient-radial from-purple-500/40 to-transparent -bottom-[5%] -right-[5%] animate-float-slow-reverse" />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-25 bg-gradient-radial from-amber-500/40 to-transparent top-[40%] right-[20%] animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-white/80">{badge}</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1]">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={ctaHref}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10">{ctaText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          
          {secondaryCtaText && (
            <a
              href={secondaryCtaHref}
              className="px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:bg-white/5 transition-colors"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2 animate-bounce-slow">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}

// ==========================================
// LIGHTWEIGHT TILT CARD (CSS ONLY, NO HEAVY JS)
// ==========================================

interface LightweightTiltCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export function LightweightTiltCard({ 
  children, 
  className = "",
  gradient = "from-indigo-500/20 via-purple-500/10 to-pink-500/5"
}: LightweightTiltCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={`relative p-[1px] rounded-3xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={prefersReducedMotion ? {} : {
        y: isHovered ? -8 : 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.3))' 
          : 'rgba(255,255,255,0.08)',
      }}
    >
      <div 
        className={`relative p-8 rounded-3xl bg-[#0a0a12]/80 backdrop-blur-xl h-full`}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 rounded-3xl`} />
        
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
          }}
        />
        
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
}

// ==========================================
// OPTIMIZED SCROLL REVEAL (DISABLED ON MOBILE)
// ==========================================

interface OptimizedScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function OptimizedScrollReveal({ 
  children, 
  className = "",
  delay = 0,
  direction = "up"
}: OptimizedScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile } = useDeviceCapabilities();
  
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };
  
  // Skip animation on mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.7, 
        delay,
        ease: [0.23, 1, 0.32, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// MOBILE-OPTIMIZED PARTICLES (CSS ONLY)
// ==========================================

interface OptimizedParticlesProps {
  count?: number;
}

export function OptimizedParticles({ count = 15 }: OptimizedParticlesProps) {
  const { isMobile, isLowPower } = useDeviceCapabilities();
  const prefersReducedMotion = useReducedMotion();
  
  // Disable on mobile, low power, or reduced motion
  if (isMobile || isLowPower || prefersReducedMotion) {
    return null;
  }
  
  // Limit particles for performance
  const safeCount = Math.min(count, 20);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: safeCount }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `float-particle ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float-particle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// PERFORMANCE-OPTIMIZED STAGGER
// ==========================================

interface OptimizedStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function OptimizedStagger({ 
  children, 
  className = "",
  staggerDelay = 0.05 
}: OptimizedStaggerProps) {
  const { isMobile } = useDeviceCapabilities();
  const prefersReducedMotion = useReducedMotion();
  
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: { staggerChildren: staggerDelay }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function OptimizedStaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { isMobile } = useDeviceCapabilities();
  const prefersReducedMotion = useReducedMotion();
  
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// LIGHTWEIGHT PREMIUM BUTTON
// ==========================================

interface PremiumButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function PremiumButton({ 
  children, 
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  href
}: PremiumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-full overflow-hidden transition-all duration-300";
  
  const variants = {
    primary: "bg-white text-black hover:shadow-lg hover:shadow-white/20",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ 
            x: isHovered ? "0%" : "-100%", 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );
  
  const props = {
    className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick,
  };
  
  if (href) {
    return <a href={href} {...props}>{content}</a>;
  }
  
  return <button {...props}>{content}</button>;
}

// ==========================================
// LIGHTWEIGHT FEATURE CARD
// ==========================================

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
}

export function LightweightFeatureCard({ 
  icon, 
  title, 
  description,
  gradient = "from-indigo-500/20 via-purple-500/10 to-transparent"
}: FeatureCardProps) {
  return (
    <LightweightTiltCard gradient={gradient}>
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4">
          <div className="text-indigo-400">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </LightweightTiltCard>
  );
}

// ==========================================
// OPTIMIZED SECTION TITLE
// ==========================================

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function OptimizedSectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <OptimizedScrollReveal>
        <span className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {eyebrow}
        </span>
      </OptimizedScrollReveal>
      
      <OptimizedScrollReveal delay={0.1}>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          {title}
        </h2>
      </OptimizedScrollReveal>
      
      {subtitle && (
        <OptimizedScrollReveal delay={0.2}>
          <p className="text-lg text-white/60">{subtitle}</p>
        </OptimizedScrollReveal>
      )}
    </div>
  );
}

// ==========================================
// LIGHTWEIGHT STAT CARD
// ==========================================

interface StatCardProps {
  value: string;
  label: string;
  icon: ReactNode;
}

export function LightweightStatCard({ value, label, icon }: StatCardProps) {
  return (
    <motion.div
      className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-center mb-3 text-indigo-400">{icon}</div>
      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-white/50 mt-1">{label}</div>
    </motion.div>
  );
}

// Export all components
export { useDeviceCapabilities };
