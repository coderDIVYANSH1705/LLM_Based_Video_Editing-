'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// TypeScript interfaces
export interface FunLoadingAnimationProps {
  messages?: string[];
  rotationInterval?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  theme?: 'cosmic' | 'gradient' | 'minimal' | 'neon' | 'glass' | 'retro' | 'holographic' | 'quantum';
  showParticles?: boolean;
}

const DEFAULT_MESSAGES: string[] = [
  "🤖 AI is thinking...",
  "🍳 Cooking magic...", 
  "🚀 Almost there...",
  "🔢 Crunching numbers...",
  "☕ Brewing insights...",
  "💪 Working hard...",
  "✨ Making magic happen...",
  "🧠 Processing brilliance...",
  "🔧 Assembling wisdom...",
  "⚡ Supercharging...",
  "🎨 Crafting perfection...",
  "🌟 Polishing results..."
];

/**
 * Enhanced Fun Loading Animation Component
 * 
 * Features:
 * - 8 stunning visual themes (added holographic & quantum)
 * - Advanced 3D-like particle effects
 * - Smooth morphing animations
 * - Dynamic color transitions
 * - Glassmorphism & neumorphism effects
 * - Performance-optimized animations
 */
export const FunLoadingAnimation: React.FC<FunLoadingAnimationProps> = ({
  messages = DEFAULT_MESSAGES,
  rotationInterval = 2000,
  size = 'md',
  className = '',
  theme = 'holographic',
  showParticles = true,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; delay: number; speed: number; size: number}>>([]);

  const validMessages = useMemo(() => 
    messages && messages.length > 0 ? messages : DEFAULT_MESSAGES,
    [messages]
  );

  // Enhanced particle generation
  useEffect(() => {
    if (showParticles && (theme === 'cosmic' || theme === 'neon' || theme === 'holographic' || theme === 'quantum')) {
      const particleCount = theme === 'holographic' ? 40 : theme === 'quantum' ? 50 : 30;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        speed: 2 + Math.random() * 3,
        size: 1 + Math.random() * 2.5,
      }));
      setParticles(newParticles);
    }
  }, [showParticles, theme]);

  const rotateMessage = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % validMessages.length
      );
      setIsFading(false);
    }, 400);
  }, [validMessages.length]);

  useEffect(() => {
    const interval = setInterval(rotateMessage, rotationInterval);
    return () => clearInterval(interval);
  }, [rotationInterval, rotateMessage]);

  const sizeClasses = useMemo(() => ({
    sm: { container: 'w-40 h-40', spinner: 'w-16 h-16', text: 'text-xs', orbit: 'w-24 h-24', inner: 'w-12 h-12' },
    md: { container: 'w-56 h-56', spinner: 'w-24 h-24', text: 'text-sm', orbit: 'w-36 h-36', inner: 'w-20 h-20' },
    lg: { container: 'w-72 h-72', spinner: 'w-32 h-32', text: 'text-base', orbit: 'w-48 h-48', inner: 'w-28 h-28' },
  }), []);

  const currentSize = sizeClasses[size];

  // Enhanced theme configurations
  const themes = {
    holographic: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Animated holographic background */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                 style={{ 
                   animation: 'holo-shift 8s ease-in-out infinite',
                   backgroundSize: '400% 400%'
                 }} />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/20 via-pink-500/20 to-yellow-500/20"
                 style={{ 
                   animation: 'holo-shift 10s ease-in-out infinite reverse',
                   backgroundSize: '400% 400%',
                   animationDelay: '2s'
                 }} />
          </div>

          {/* Holographic scan lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{
                 backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                 animation: 'scan-lines 8s linear infinite'
               }} />

          {/* Enhanced particles with rainbow glow */}
          {showParticles && particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: `hsl(${particle.id * 30 % 360}, 100%, 70%)`,
                boxShadow: `0 0 ${particle.size * 4}px hsl(${particle.id * 30 % 360}, 100%, 70%)`,
                animation: `float-particle ${particle.speed}s ease-in-out infinite, color-shift ${particle.speed * 2}s linear infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
          
          {/* Multi-layer holographic spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Outer prismatic ring */}
              <div className="absolute -inset-2 rounded-full"
                   style={{ 
                     background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #7b68ee, #ff1493, #ff0080)',
                     animation: 'spin 6s linear infinite',
                     filter: 'blur(4px)',
                     opacity: 0.7
                   }} />
              
              {/* Main holographic ring */}
              <div className="absolute inset-0 rounded-full"
                   style={{ 
                     background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4)',
                     animation: 'spin 4s linear infinite',
                   }}>
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900" />
              </div>
              
              {/* Rotating energy rings */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border-2"
                  style={{ 
                    inset: `${8 + i * 6}px`,
                    borderColor: `hsl(${i * 120}, 100%, 60%)`,
                    animation: `spin ${2 + i * 0.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                    boxShadow: `0 0 15px hsl(${i * 120}, 100%, 60%), inset 0 0 15px hsl(${i * 120}, 100%, 60%)`,
                    opacity: 0.6,
                  }}
                />
              ))}
              
              {/* Pulsing core with rainbow gradient */}
              <div className="absolute inset-8 rounded-full"
                   style={{ 
                     background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(139,92,246,0.8) 50%, rgba(236,72,153,0.6) 100%)',
                     animation: 'pulse-glow 2s ease-in-out infinite',
                     boxShadow: '0 0 40px rgba(139,92,246,0.8), 0 0 60px rgba(236,72,153,0.6), inset 0 0 30px rgba(255,255,255,0.5)'
                   }} />
              
              {/* Orbiting holo-dots */}
              <div className={`absolute inset-0 ${currentSize.orbit} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
                {[0, 90, 180, 270].map((deg, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      background: `radial-gradient(circle, hsl(${i * 90}, 100%, 70%), transparent)`,
                      boxShadow: `0 0 15px hsl(${i * 90}, 100%, 70%)`,
                      animation: `orbit 3s linear infinite`,
                      animationDelay: `${i * -0.75}s`,
                      filter: 'brightness(1.5)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Holographic text with prismatic effect */}
        <div className="absolute bottom-6 left-0 right-0 text-center px-4">
          <div className={`${currentSize.text} font-black uppercase transition-all duration-500 ${isFading ? 'opacity-0 translate-y-3 scale-95 blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
               style={{ 
                 background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4)',
                 backgroundSize: '200% auto',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text',
                 animation: 'gradient-flow 3s linear infinite',
                 textShadow: '0 0 30px rgba(139,92,246,0.5)',
                 letterSpacing: '0.15em',
                 fontWeight: 900
               }}>
            {validMessages[currentMessageIndex]}
          </div>
        </div>
      </div>
    ),

    quantum: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-black rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/20">
          {/* Quantum field background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black"
                 style={{ animation: 'pulse 4s ease-in-out infinite' }} />
            
            {/* Energy grid */}
            <div className="absolute inset-0 opacity-30"
                 style={{
                   backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
                   backgroundSize: '20px 20px',
                   animation: 'grid-pulse 3s ease-in-out infinite'
                 }} />
          </div>

          {/* Quantum particles with trails */}
          {showParticles && particles.map(particle => (
            <React.Fragment key={particle.id}>
              <div
                className="absolute rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  background: particle.id % 3 === 0 ? '#0ff' : particle.id % 3 === 1 ? '#f0f' : '#ff0',
                  boxShadow: `0 0 10px ${particle.id % 3 === 0 ? '#0ff' : particle.id % 3 === 1 ? '#f0f' : '#ff0'}`,
                  animation: `quantum-float ${particle.speed}s ease-in-out infinite, quantum-glow 1s ease-in-out infinite`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
              {/* Particle trail */}
              <div
                className="absolute rounded-full blur-sm"
                style={{
                  width: `${particle.size * 2}px`,
                  height: `${particle.size * 2}px`,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  background: particle.id % 3 === 0 ? '#0ff' : particle.id % 3 === 1 ? '#f0f' : '#ff0',
                  opacity: 0.3,
                  animation: `quantum-float ${particle.speed}s ease-in-out infinite`,
                  animationDelay: `${particle.delay + 0.1}s`,
                }}
              />
            </React.Fragment>
          ))}
          
          {/* Quantum spinner with entanglement effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Outer quantum field */}
              <div className="absolute -inset-6 rounded-full border border-cyan-500/30"
                   style={{ 
                     animation: 'quantum-pulse 4s ease-in-out infinite',
                     boxShadow: '0 0 40px #0ff'
                   }} />
              
              {/* Multiple entangled rings */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border-[3px]"
                  style={{ 
                    borderColor: i % 2 === 0 ? '#0ff' : '#f0f',
                    transform: `rotate(${i * 30}deg) scale(${1 - i * 0.1})`,
                    animation: `spin ${3 - i * 0.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                    boxShadow: `0 0 20px ${i % 2 === 0 ? '#0ff' : '#f0f'}, inset 0 0 20px ${i % 2 === 0 ? '#0ff' : '#f0f'}`,
                    opacity: 0.7,
                  }}
                />
              ))}
              
              {/* Quantum core with superposition effect */}
              <div className="absolute inset-8 rounded-full"
                   style={{ 
                     background: 'radial-gradient(circle, #fff 0%, #0ff 30%, #f0f 60%, #000 100%)',
                     animation: 'quantum-core 2s ease-in-out infinite',
                     boxShadow: '0 0 60px #0ff, 0 0 80px #f0f, inset 0 0 40px rgba(255,255,255,0.8)'
                   }} />
              
              {/* Orbiting quantum bits */}
              <div className={`absolute inset-0 ${currentSize.orbit} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${i % 2 === 0 ? '#0ff' : '#f0f'}, transparent)`,
                      boxShadow: `0 0 15px ${i % 2 === 0 ? '#0ff' : '#f0f'}`,
                      animation: `orbit 2.5s linear infinite`,
                      animationDelay: `${i * -0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Quantum text with flickering effect */}
          <div className="absolute bottom-6 left-0 right-0 text-center px-4">
            <div className={`${currentSize.text} font-black text-cyan-400 uppercase tracking-[0.3em] transition-all duration-500 ${isFading ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
                 style={{ 
                   textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #f0f',
                   fontWeight: 900,
                   animation: 'quantum-flicker 0.5s ease-in-out infinite'
                 }}>
              {validMessages[currentMessageIndex]}
            </div>
          </div>
        </div>
      </div>
    ),

    cosmic: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Enhanced cosmic nebula */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/40 to-transparent"
                 style={{ animation: 'nebula-drift 6s ease-in-out infinite' }} />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-purple-500/40 to-transparent"
                 style={{ animation: 'nebula-drift 7s ease-in-out infinite', animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-pink-500/30 to-transparent rounded-full blur-3xl"
                 style={{ animation: 'pulse 5s ease-in-out infinite' }} />
          </div>

          {/* Enhanced star particles */}
          {showParticles && particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: 0.4 + Math.random() * 0.6,
                boxShadow: `0 0 ${particle.size * 3}px rgba(255,255,255,0.8)`,
                animation: `twinkle-enhanced ${particle.speed}s ease-in-out infinite, float-gentle ${particle.speed * 2}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
          
          {/* Enhanced spinning system */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Outer cosmic ring with gradient */}
              <div className="absolute -inset-3 rounded-full"
                   style={{ 
                     background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #06b6d4)',
                     animation: 'spin 5s linear infinite',
                     filter: 'blur(6px)',
                     opacity: 0.6
                   }} />
              
              <div className="absolute inset-0 rounded-full"
                   style={{ 
                     background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                     animation: 'spin 4s linear infinite',
                   }}>
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />
              </div>
              
              {/* Mid energy ring */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                   style={{ 
                     animation: 'pulse-bright 2s ease-in-out infinite',
                     boxShadow: '0 0 25px rgba(139, 92, 246, 0.8), inset 0 0 25px rgba(139, 92, 246, 0.4)'
                   }} />
              
              {/* Bright core */}
              <div className="absolute inset-7 rounded-full bg-gradient-to-br from-white via-cyan-200 to-purple-300"
                   style={{ 
                     boxShadow: '0 0 50px rgba(255,255,255,1), 0 0 70px rgba(139, 92, 246, 0.7), inset 0 0 30px rgba(255,255,255,0.6)',
                     animation: 'pulse-bright 1.5s ease-in-out infinite'
                   }} />
              
              {/* Enhanced orbiting planets */}
              <div className={`absolute inset-0 ${currentSize.orbit} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
                {[0, 120, 240].map((deg, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${i === 0 ? '#06b6d4' : i === 1 ? '#8b5cf6' : '#ec4899'}, transparent)`,
                      boxShadow: `0 0 15px ${i === 0 ? '#06b6d4' : i === 1 ? '#8b5cf6' : '#ec4899'}`,
                      animation: `orbit 4s linear infinite`,
                      animationDelay: `${i * -1.33}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced cosmic message */}
        <div className="absolute bottom-6 left-0 right-0 text-center px-4">
          <div className={`${currentSize.text} font-bold text-white transition-all duration-500 ${isFading ? 'opacity-0 translate-y-3 scale-95 blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
               style={{ 
                 textShadow: '0 0 25px rgba(255,255,255,1), 0 2px 6px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.6)',
                 letterSpacing: '0.08em',
                 fontWeight: 700
               }}>
            {validMessages[currentMessageIndex]}
          </div>
        </div>
      </div>
    ),

    gradient: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
          {/* Enhanced animated gradient blobs */}
          <div className="absolute inset-0">
            <div className="absolute w-3/4 h-3/4 bg-gradient-to-br from-yellow-400/70 to-orange-500/50 rounded-full blur-3xl"
                 style={{ 
                   top: '10%', 
                   left: '10%',
                   animation: 'blob-enhanced 8s ease-in-out infinite'
                 }} />
            <div className="absolute w-2/3 h-2/3 bg-gradient-to-bl from-pink-400/70 to-purple-500/50 rounded-full blur-3xl"
                 style={{ 
                   top: '20%', 
                   right: '5%',
                   animation: 'blob-enhanced 7s ease-in-out infinite',
                   animationDelay: '2s'
                 }} />
            <div className="absolute w-1/2 h-1/2 bg-gradient-to-tr from-purple-400/70 to-blue-500/50 rounded-full blur-3xl"
                 style={{ 
                   bottom: '15%', 
                   left: '20%',
                   animation: 'blob-enhanced 9s ease-in-out infinite',
                   animationDelay: '4s'
                 }} />
          </div>
          
          {/* Enhanced multi-layer spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Outer glow */}
              <div className="absolute -inset-4 rounded-full border-4 border-white/30"
                   style={{ 
                     animation: 'spin 6s linear infinite',
                     filter: 'blur(2px)'
                   }} />
              
              {/* Multi-layered spinning rings */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full"
                  style={{
                    animation: `spin ${2 + i * 0.4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                    transform: `rotate(${i * 45}deg) scale(${1 - i * 0.04})`,
                    border: '5px solid transparent',
                    borderTopColor: `rgba(255,255,255,${0.9 - i * 0.15})`,
                    borderRightColor: `rgba(255,255,255,${0.5 - i * 0.1})`,
                    boxShadow: `0 0 ${20 - i * 3}px rgba(255,255,255,${0.4 - i * 0.08})`,
                  }}
                />
              ))}
              
              {/* Enhanced glowing center */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-white via-yellow-100 to-orange-200"
                   style={{ 
                     animation: 'pulse-bright 1.5s ease-in-out infinite',
                     boxShadow: '0 0 40px rgba(255,255,255,1), inset 0 0 25px rgba(255,255,255,0.6)'
                   }} />
            </div>
          </div>
          
          {/* Enhanced message */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <div className={`${currentSize.text} font-black text-white uppercase tracking-wider transition-all duration-500 ${isFading ? 'opacity-0 scale-90 blur-md' : 'opacity-100 scale-100 blur-0'}`}
                 style={{ 
                   textShadow: '3px 3px 8px rgba(0,0,0,0.5), 0 0 25px rgba(255,255,255,0.4)',
                   letterSpacing: '0.12em',
                   fontWeight: 900
                 }}>
              {validMessages[currentMessageIndex]}
            </div>
          </div>
        </div>
      </div>
    ),

    minimal: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl overflow-hidden border-2 border-stone-200 shadow-xl">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-50"
               style={{ animation: 'pulse 3s ease-in-out infinite', opacity: 0.6 }} />
          
          {/* Refined spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Enhanced SVG spinner */}
              <svg className="w-full h-full" viewBox="0 0 100 100" style={{ animation: 'spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#78716c"
                  strokeWidth="4"
                  strokeDasharray="90 200"
                  strokeLinecap="round"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth="4"
                  strokeDasharray="60 200"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 2px rgba(28, 25, 23, 0.3))' }}
                />
              </svg>
              
              {/* Pulsing center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-stone-800 rounded-full"
                     style={{ 
                       animation: 'pulse-gentle 2s ease-in-out infinite',
                       boxShadow: '0 0 10px rgba(28, 25, 23, 0.5)'
                     }} />
              </div>
            </div>
          </div>
          
          {/* Elegant message */}
          <div className="absolute bottom-10 left-0 right-0 text-center px-6">
            <div className={`${currentSize.text} text-stone-800 transition-all duration-700 ${isFading ? 'opacity-0 blur-lg translate-y-2' : 'opacity-100 blur-0 translate-y-0'}`}
                 style={{ 
                   fontFamily: 'Georgia, serif', 
                   letterSpacing: '0.1em',
                   fontWeight: 500
                 }}>
              {validMessages[currentMessageIndex]}
            </div>
          </div>
        </div>
      </div>
    ),

    neon: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-black rounded-3xl overflow-hidden shadow-2xl">
          {/* Enhanced animated grid */}
          <div className="absolute inset-0 opacity-40"
               style={{
                 backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
                 backgroundSize: '24px 24px',
                 animation: 'grid-pulse 4s ease-in-out infinite'
               }} />
          
          {/* Enhanced glowing particles */}
          {showParticles && particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: particle.id % 2 === 0 ? '#0ff' : '#f0f',
                boxShadow: `0 0 ${particle.size * 5}px ${particle.id % 2 === 0 ? '#0ff' : '#f0f'}`,
                animation: `twinkle-neon ${particle.speed}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
          
          {/* Enhanced neon spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Outer glow ring */}
              <div className="absolute -inset-6 rounded-full border-2 border-cyan-500/30"
                   style={{ 
                     animation: 'spin 8s linear infinite',
                     boxShadow: '0 0 40px #0ff'
                   }} />
              
              {/* Main neon rings */}
              <div className="absolute inset-0 rounded-full border-[6px] border-transparent"
                   style={{ 
                     borderTopColor: '#0ff',
                     borderRightColor: '#0ff',
                     animation: 'spin 2s linear infinite',
                     boxShadow: '0 0 30px #0ff, inset 0 0 30px #0ff',
                     filter: 'brightness(1.3)'
                   }} />
              <div className="absolute inset-4 rounded-full border-[6px] border-transparent"
                   style={{ 
                     borderTopColor: '#f0f',
                     borderLeftColor: '#f0f',
                     animation: 'spin 1.5s linear infinite reverse',
                     boxShadow: '0 0 30px #f0f, inset 0 0 30px #f0f',
                     filter: 'brightness(1.3)'
                   }} />
              
              {/* Pulsing core with enhanced glow */}
              <div className="absolute inset-9 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-400"
                   style={{ 
                     animation: 'pulse-neon 1s ease-in-out infinite',
                     boxShadow: '0 0 60px #0ff, 0 0 80px #f0f, inset 0 0 40px rgba(255,255,255,0.6)'
                   }} />
            </div>
          </div>
          
          {/* Enhanced neon text */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <div className={`${currentSize.text} font-black text-cyan-400 uppercase tracking-[0.3em] transition-all duration-500 ${isFading ? 'opacity-0 translate-y-4 scale-95 blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
                 style={{ 
                   textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 50px #0ff',
                   fontWeight: 900
                 }}>
              {validMessages[currentMessageIndex]}
            </div>
          </div>
        </div>
      </div>
    ),

    glass: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl overflow-hidden shadow-2xl">
          {/* Enhanced glassmorphism layers */}
          <div className="absolute inset-4 rounded-2xl backdrop-blur-3xl bg-white/50 border-2 border-white/70 shadow-xl"
               style={{ 
                 boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.6)'
               }}>
            {/* Enhanced floating gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-28 h-28 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-2xl"
                   style={{ 
                     top: '15%', 
                     left: '10%',
                     animation: 'float-smooth 8s ease-in-out infinite'
                   }} />
              <div className="absolute w-24 h-24 bg-gradient-to-br from-pink-400/40 to-orange-400/40 rounded-full blur-2xl"
                   style={{ 
                     bottom: '20%', 
                     right: '15%',
                     animation: 'float-smooth 7s ease-in-out infinite',
                     animationDelay: '2s'
                   }} />
              <div className="absolute w-20 h-20 bg-gradient-to-br from-purple-400/40 to-cyan-400/40 rounded-full blur-2xl"
                   style={{ 
                     top: '50%', 
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     animation: 'pulse 4s ease-in-out infinite'
                   }} />
            </div>
            
            {/* Enhanced glass spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${currentSize.spinner} relative`}>
                {/* Outer glass ring */}
                <div className="absolute inset-0 rounded-full backdrop-blur-lg bg-white/60 border-2 border-white/80 shadow-2xl"
                     style={{ 
                       animation: 'spin 4s linear infinite',
                       boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 2px 10px rgba(255,255,255,0.7)'
                     }}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-white/20" />
                </div>
                
                {/* Inner glass layer */}
                <div className="absolute inset-5 rounded-full backdrop-blur-md bg-gradient-to-br from-blue-200/60 via-purple-200/60 to-pink-200/60 border border-white/60"
                     style={{ 
                       animation: 'pulse-gentle 2s ease-in-out infinite',
                       boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.5)'
                     }} />
                
                {/* Core */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white to-blue-100"
                     style={{ 
                       animation: 'pulse-gentle 1.5s ease-in-out infinite',
                       boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
                     }} />
              </div>
            </div>
            
            {/* Enhanced frosted text */}
            <div className="absolute bottom-8 left-0 right-0 text-center px-4">
              <div className={`${currentSize.text} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-500 ${isFading ? 'opacity-0 scale-90 blur-md' : 'opacity-100 scale-100 blur-0'}`}
                   style={{ 
                     letterSpacing: '0.08em',
                     fontWeight: 700
                   }}>
                {validMessages[currentMessageIndex]}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    retro: (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="absolute inset-0 bg-amber-50 rounded-lg overflow-hidden border-[6px] border-amber-900 shadow-xl"
             style={{ boxShadow: '10px 10px 0 rgba(120, 53, 15, 0.5), 15px 15px 0 rgba(120, 53, 15, 0.25)' }}>
          {/* Enhanced retro patterns */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, #78350f 0, #78350f 12px, transparent 12px, transparent 24px)',
               }} />
          <div className="absolute inset-0 opacity-15"
               style={{
                 backgroundImage: 'repeating-linear-gradient(-45deg, #78350f 0, #78350f 12px, transparent 12px, transparent 24px)',
               }} />
          
          {/* Enhanced retro spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.spinner} relative`}>
              {/* Vintage rotating squares */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-[6px] border-amber-700"
                  style={{
                    animation: `spinSquare ${5 + i}s ease-in-out infinite`,
                    transform: `rotate(${i * 15}deg) scale(${1 - i * 0.12})`,
                    borderRadius: '25%',
                    boxShadow: i === 0 ? '0 5px 15px rgba(120, 53, 15, 0.4)' : 'none'
                  }}
                />
              ))}
              
              {/* Enhanced center dot with retro glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-amber-900 rounded-full"
                       style={{ 
                         animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                         boxShadow: '0 0 20px rgba(120, 53, 15, 0.7)'
                       }} />
                  <div className="absolute inset-0 w-8 h-8 bg-amber-800 rounded-full"
                       style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced retro text */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <div className={`${currentSize.text} font-bold text-amber-900 uppercase transition-all duration-500 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                 style={{ 
                   fontFamily: 'Courier New, monospace', 
                   letterSpacing: '0.3em',
                   textShadow: '3px 3px 0 rgba(120, 53, 15, 0.3)',
                   fontWeight: 700
                 }}>
              {validMessages[currentMessageIndex]}
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div role="status" aria-live="polite" aria-label="Loading content">
      {themes[theme]}
      <span className="sr-only">
        Loading: {validMessages[currentMessageIndex]}
      </span>

      <style jsx>{`
        @keyframes holo-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes scan-lines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -15px); }
          50% { transform: translate(-5px, -25px); }
          75% { transform: translate(-15px, -10px); }
        }

        @keyframes color-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
        }

        @keyframes gradient-flow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes quantum-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -20px) scale(1.2); }
          66% { transform: translate(-15px, -10px) scale(0.8); }
        }

        @keyframes quantum-glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes quantum-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.1; }
        }

        @keyframes quantum-core {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
        }

        @keyframes quantum-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }

        @keyframes nebula-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }

        @keyframes twinkle-enhanced {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-bright {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        @keyframes blob-enhanced {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -40px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-30px, 30px) scale(0.9) rotate(240deg); }
        }

        @keyframes grid-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.2; }
        }

        @keyframes twinkle-neon {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes pulse-neon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes float-smooth {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(25px, -25px); }
        }

        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes spinSquare {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(100%) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100%) rotate(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FunLoadingAnimation;