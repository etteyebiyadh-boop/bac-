"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";

// ==========================================
// 3D FLOATING SPHERE - Hero centerpiece
// ==========================================
function FloatingSphere({ 
  position, 
  color, 
  size = 1,
  speed = 1 
}: { 
  position: [number, number, number]; 
  color: string;
  size?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.3;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <Sphere
        ref={meshRef}
        args={[size, 64, 64]}
        position={position}
      >
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

// ==========================================
// 3D SCENE - Hero background
// ==========================================
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.5} />
      
      <FloatingSphere 
        position={[0, 0, 0]} 
        color="#6366f1" 
        size={1.5}
        speed={1}
      />
      <FloatingSphere 
        position={[-3, 1, -2]} 
        color="#a855f7" 
        size={0.8}
        speed={0.8}
      />
      <FloatingSphere 
        position={[3, -1, -1]} 
        color="#f59e0b" 
        size={0.6}
        speed={1.2}
      />
      
      {/* Particle stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10 - 5
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={Math.random() * 0.5 + 0.2} 
          />
        </mesh>
      ))}
    </>
  );
}

// ==========================================
// PREMIUM HERO SECTION
// ==========================================
interface PremiumHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  show3D?: boolean;
}

export function PremiumHero({
  badge,
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  show3D = true
}: PremiumHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const springConfig = { stiffness: 100, damping: 30 };
  const ySpring = useSpring(y, springConfig);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale }}
    >
      {/* 3D Background */}
      {show3D && (
        <div className="absolute inset-0 -z-10">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ background: "transparent" }}
          >
            <Scene3D />
          </Canvas>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000205]/50 to-[#000205] pointer-events-none" />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y: ySpring }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-white/80">{badge}</span>
        </motion.div>
        
        {/* Title with character animation */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.03,
                delayChildren: 0.4
              }
            }
          }}
        >
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent"
              variants={{
                hidden: { opacity: 0, y: 50, rotateX: -90 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0,
                  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
                }
              }}
              style={{ 
                textShadow: "0 0 80px rgba(99,102,241,0.3)",
                transformStyle: "preserve-3d"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {subtitle}
        </motion.p>
        
        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href={ctaHref}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-full overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-indigo-500 to-pink-500"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.6 }}
              transition={{ duration: 0.3 }}
            />
            
            <span className="relative z-10 flex items-center gap-2">
              {ctaText}
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </motion.svg>
            </span>
          </motion.a>
          
          <motion.a
            href={secondaryCtaHref}
            className="px-8 py-4 text-white/80 font-semibold rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {secondaryCtaText}
          </motion.a>
        </motion.div>
        
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex items-center justify-center gap-8 md:gap-16 mt-20"
        >
          {[
            { value: "50K+", label: "Students" },
            { value: "17/20", label: "Avg Score" },
            { value: "98%", label: "Success Rate" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/60"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ==========================================
// PREMIUM FEATURE CARD - 3D tilt with icon
// ==========================================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

export function PremiumFeatureCard({ 
  icon, 
  title, 
  description, 
  gradient = "from-indigo-500/20 via-purple-500/20",
  delay = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ 
        y: -10, 
        rotateY: 5,
        rotateX: -5,
        transition: { duration: 0.3 }
      }}
      className="group relative"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
      
      <div className="relative h-full p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
        {/* Inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon container */}
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 text-2xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
        
        {/* Arrow indicator */}
        <motion.div
          className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PREMIUM SECTION TITLE
// ==========================================
interface SectionTitleProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function PremiumSectionTitle({ 
  eyebrow, 
  title, 
  subtitle,
  centered = true 
}: SectionTitleProps) {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-16`}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4"
      >
        {eyebrow}
      </motion.span>
      
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
        style={{ textShadow: "0 0 40px rgba(99,102,241,0.2)" }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/60"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// ==========================================
// PATHWAY CARD - Large cinematic card
// ==========================================
interface PathwayCardProps {
  title: string;
  description: string;
  image: string;
  color: string;
  delay?: number;
}

export function PathwayCard({ 
  title, 
  description, 
  image, 
  color,
  delay = 0 
}: PathwayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Background image */}
      <motion.div 
        className="absolute inset-0"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <Image 
          src={image} 
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </motion.div>
      
      {/* Color accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: color }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2 }}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
            style={{ background: `${color}30`, color }}
          >
            🎯
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/70 mb-4 max-w-md">{description}</p>
          
          <motion.div
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color }}
            whileHover={{ x: 5 }}
          >
            Explore Path
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
