import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onLoadComplete }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);
  const circleRef = useRef(null);
  const glowRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // Final exit animation
          gsap.to(loaderRef.current, {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
              if (onLoadComplete) onLoadComplete();
            },
          });
        },
      });

      // Animated glow orbs entrance
      tl.fromTo(
        '.glow-orb',
        { 
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 0.6,
          duration: 1.2,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)',
        }
      );

      // Continuous glow pulse
      gsap.to('.glow-orb', {
        scale: 1.3,
        opacity: 0.4,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.5,
          from: 'random'
        }
      });

      // Text letters entrance with 3D rotation
      tl.fromTo(
        textRef.current.children,
        { 
          opacity: 0, 
          y: 100, 
          rotateX: -90,
          scale: 0.5,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            each: 0.06,
            ease: 'power2.out'
          },
          ease: 'back.out(1.7)',
        },
        '-=0.6'
      );

      // Floating animation for letters
      gsap.to(textRef.current.children, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.1,
          from: 'random'
        }
      });

      // Progress bar container entrance
      tl.fromTo(
        progressBarRef.current,
        { 
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Progress fill animation with glow
      const progressTl = gsap.timeline();
      progressTl.to(progressRef.current, {
        scaleX: 1,
        duration: 2.8,
        ease: 'power1.inOut',
        onUpdate: function () {
          const prog = Math.round(this.progress() * 100);
          setProgress(prog);
          
          // Pulsing glow intensity based on progress
          gsap.to(glowRef.current, {
            opacity: 0.3 + (prog / 100) * 0.5,
            duration: 0.2
          });
        },
      });

      // Circle spinner
      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      // Percentage number animation
      tl.fromTo(
        '.progress-text',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.3'
      );

      // Pulse effect on percentage
      gsap.to('.progress-text', {
        scale: 1.1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Delay before exit
      tl.add(() => {}, '+=0.7');
    }, loaderRef);

    return () => ctx.revert();
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Animated Background Orbs - Responsive */}
      <div className="glow-orb absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-purple-600/30 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
      <div className="glow-orb absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-amber-500/30 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
      <div className="glow-orb absolute top-1/2 right-1/3 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-cyan-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]" />

      {/* Animated Text - Fully Responsive */}
      <div
        ref={textRef}
        className="flex flex-wrap justify-center gap-0.5 sm:gap-1 mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-white heading-text px-4"
        style={{ perspective: '1000px' }}
      >
        {'JGPNR.NG'.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block transition-colors duration-300 hover:text-amber-500 cursor-default"
            style={{ 
              transformOrigin: '50% 50% -50px',
              textShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Progress Bar Container - Responsive */}
      <div ref={progressBarRef} className="w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96 relative px-4">
        {/* Glow effect under progress bar */}
        <div 
          ref={glowRef}
          className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-amber-500/30 to-cyan-500/20 blur-xl rounded-full opacity-0"
        />
        
        {/* Background Bar */}
        <div className="relative h-0.5 sm:h-[2px] bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Progress Fill with gradient */}
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-purple-500 via-amber-500 to-cyan-500 origin-left relative"
            style={{ transform: 'scaleX(0)' }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Progress Percentage with Circle Spinner */}
        <div className="flex items-center justify-center mt-4 sm:mt-5 md:mt-6 gap-2 sm:gap-3">
          {/* Circular Spinner */}
          <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
            <svg
              ref={circleRef}
              className="w-full h-full"
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="80 50"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Percentage Text */}
          <div className="progress-text text-white/80 text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em]">
            {progress}%
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center mt-3 sm:mt-4 md:mt-5">
          <p className="text-[10px] sm:text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-light">
            Loading Experience
          </p>
        </div>
      </div>

      {/* Animated Dots Indicator */}
      <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-16 flex gap-1.5 sm:gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-bounce"
            style={{ 
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>

      {/* Film Grain Effect */}
      <div className="film-grain pointer-events-none" />

      {/* Scan line effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.02) 50%)',
          backgroundSize: '100% 4px',
          animation: 'scan 8s linear infinite'
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @media (max-width: 640px) {
          .heading-text {
            font-size: clamp(1.5rem, 8vw, 3rem);
          }
        }
      `}</style>
    </div>
  );
}