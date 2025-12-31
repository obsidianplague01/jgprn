import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import bgVideo from "../assets/videos/background.mp4";
import Footer from "../components/Footer";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function LandingPage() {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const heroTextRef = useRef(null);
  const buttonRef = useRef(null);
  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);
  const glow3Ref = useRef(null);
  const neonLightRef = useRef(null);
  const playIconRef = useRef(null);
  const clickFlashRef = useRef(null);
  const neonAnimationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tl = gsap.timeline();

    // 🎥 Cinematic entrance
    tl.from(video, {
      scale: 1.5,
      filter: "blur(20px)",
      duration: 2.6,
      ease: "power3.out",
    })
      .from(
        overlayRef.current,
        {
          opacity: 1,
          duration: 2,
          ease: "power2.out",
        },
        "-=2"
      )
      .from(
        heroTextRef.current,
        {
          opacity: 0,
          y: 80,
          duration: 1.6,
          ease: "power3.out",
        },
        "-=1.4"
      )
      .from(
        buttonRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
          duration: 1.2,
          ease: "back.out(1.5)",
        },
        "-=0.8"
      );

    gsap.to(glow1Ref.current, {
      opacity: 0.4,
      scale: 1.3,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(glow2Ref.current, {
      opacity: 0.5,
      scale: 1.2,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5,
    });

    gsap.to(glow3Ref.current, {
      opacity: 0.6,
      scale: 1.15,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    gsap.to(".btn-bg", {
      backgroundPosition: "200% 50%",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const neonRect = neonLightRef.current?.querySelector('rect');
    if (neonRect) {
      
      neonAnimationRef.current = gsap.fromTo(neonRect,
        { strokeDashoffset: 1000 }, 
        { 
          strokeDashoffset: 0, 
          duration: 6,
          repeat: -1,
          ease: "none",
        }
      );
    }

   
    const playIconTimeline = gsap.timeline({ repeat: -1 });
    
    playIconTimeline
      .fromTo(playIconRef.current, 
        { opacity: 0.5, rotation: 0, scale: 1 },
        { opacity: 1, rotation: 360, scale: 1.3, duration: 2, ease: "power2.inOut" }
      )
      .to(playIconRef.current, {
        scale: 1.4,
        duration: 0.6,
        yoyo: true,
        repeat: 4,
        ease: "sine.inOut"
      })
      .to(playIconRef.current, {
        opacity: 0.5,
        scale: 1,
        rotation: 720,
        duration: 1.5,
        ease: "power2.inOut"
      });

    
    const headingSpans = document.querySelectorAll('.heading-letter');
    headingSpans.forEach((span, i) => {
      gsap.to(span, {
        y: -5,
        duration: 2 + (i * 0.1),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
      });
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const moveX = (clientX - centerX) / 150;
      const moveY = (clientY - centerY) / 150;

      gsap.to(heroTextRef.current, {
        x: moveX,
        y: moveY,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (neonAnimationRef.current) {
        neonAnimationRef.current.kill();
      }
    };
  }, []);

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      y: -15,
      scale: 1.08,
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.to([glow1Ref.current, glow2Ref.current, glow3Ref.current], {
      opacity: 0.9,
      scale: "+=0.2",
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(playIconRef.current, {
      opacity: 1,
      scale: 1.6,
      rotation: "+=30",
      x: 5,
      duration: 0.5,
      ease: "back.out(2)",
    });

    gsap.to(".btn-bg", {
      backgroundPosition: "100% 50%",
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.inOut",
    });

    gsap.to(glow1Ref.current, { opacity: 0.4, scale: 1.3, duration: 0.5 });
    gsap.to(glow2Ref.current, { opacity: 0.5, scale: 1.2, duration: 0.5 });
    gsap.to(glow3Ref.current, { opacity: 0.6, scale: 1.15, duration: 0.5 });

    gsap.to(playIconRef.current, {
      x: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    gsap.to(".btn-bg", {
      backgroundPosition: "0% 50%",
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleClick = () => {
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    gsap.to(playIconRef.current, {
      scale: 0.8,
      rotation: "+=180",
      duration: 0.3,
      ease: "power2.in",
    });

    gsap.fromTo(
      clickFlashRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1.5, duration: 0.6, ease: "power2.out" }
    );

    gsap.to(clickFlashRef.current, {
      opacity: 0,
      delay: 0.2,
      duration: 0.4,
      onComplete: () => navigate("/playstation"),
    });
  };

  return (
    <>
      <Navbar theme="light" cartCount={0} />

      <section className="relative w-full h-screen">
      
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/65"
        />

        <div className="absolute inset-0 flex items-center z-10 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
          <div
            ref={heroTextRef}
            className="max-w-7xl w-full"
          >
            <h1 className="heading-text text-white leading-[0.9] sm:leading-[0.92] md:leading-[0.95] font-bold tracking-[0.08em] sm:tracking-widest md:tracking-[0.12em] mb-4 sm:mb-6 md:mb-8">
              <span className="block text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw]">
                <span className="heading-letter inline-block">J</span>
                <span className="heading-letter inline-block">U</span>
                <span className="heading-letter inline-block">S</span>
                <span className="heading-letter inline-block">T</span>
                <span className="heading-letter inline-block">G</span>
                <span className="heading-letter inline-block">O</span>
                <span className="heading-letter inline-block">T</span>
              </span>
              <span className="block text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw]">
                <span className="text-cyan-400 heading-letter inline-block">P</span>
                <span className="text-cyan-400 heading-letter inline-block">L</span>
                <span className="text-cyan-400 heading-letter inline-block">A</span>
                <span className="text-cyan-400 heading-letter inline-block">Y</span>
                <span className="text-cyan-400 heading-letter inline-block">F</span>
                <span className="text-cyan-400 heading-letter inline-block">U</span>
                <span className="text-cyan-400 heading-letter inline-block">L</span>
                <span className="text-purple-400 heading-letter inline-block">N</span>
                <span className="text-cyan-400 heading-letter inline-block">R</span>
                <span className="text-cyan-400 heading-letter inline-block">I</span>
                <span className="text-cyan-400 heading-letter inline-block">C</span>
                <span className="text-cyan-400 heading-letter inline-block">H</span>
                <span className="text-purple-400 heading-letter inline-block">.</span>
                <span className="text-purple-400 heading-letter inline-block">N</span>
                <span className="text-purple-400 heading-letter inline-block">G</span>
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-white mb-8 sm:mb-10 md:mb-14 lg:mb-16">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:text-purple-400 transition-colors duration-300 cursor-default">C</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:text-purple-400 transition-colors duration-300 cursor-default">O</span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-purple-400 hover:text-cyan-400 transition-colors duration-300 cursor-default">N</span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors duration-300 cursor-default">T</span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium hover:text-purple-400 transition-colors duration-300 cursor-default">R</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:text-purple-400 transition-colors duration-300 cursor-default">3</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold hover:text-purple-400 transition-colors duration-300 cursor-default">'S</span>

              {/* Nigeria Flag */}
              <span
                className="inline-block w-5 h-3 sm:w-6 sm:h-4 md:w-7 md:h-5 bg-contain bg-no-repeat ml-1 sm:ml-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 24%22%3E%3Cpath fill=%22%23008753%22 d=%22M0 0h12v24H0z%22/%3E%3Cpath fill=%22%23FFFFFF%22 d=%22M12 0h12v24H12z%22/%3E%3Cpath fill=%22%23008753%22 d=%22M24 0h12v24H24z%22/%3E%3C/svg%3E')",
                }}
              />
            </div>

            <div
              ref={buttonRef}
              className="inline-block cursor-pointer relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
            
              <div
                ref={glow1Ref}
                className="absolute -inset-8 rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)",
                }}
              />
              
              <div
                ref={glow2Ref}
                className="absolute -inset-6 rounded-full opacity-40 blur-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(219, 39, 119, 0.5) 0%, rgba(219, 39, 119, 0.3) 50%, transparent 100%)",
                }}
              />
              
              <div
                ref={glow3Ref}
                className="absolute -inset-4 rounded-full opacity-50 blur-xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0.4) 50%, transparent 100%)",
                }}
              />

              <svg 
                ref={neonLightRef}
                className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none"
                style={{ overflow: 'visible' }}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                    <stop offset="25%" stopColor="#ec4899" stopOpacity="1" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                    <stop offset="75%" stopColor="#8b5cf6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                  </linearGradient>
                  
                  <filter id="borderGlow">
                    <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <rect
                  x="4"
                  y="4"
                  width="calc(100% - 8px)"
                  height="calc(100% - 8px)"
                  rx="50%"
                  ry="50%"
                  fill="none"
                  stroke="url(#borderGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="200 800"
                  pathLength="1000"
                  filter="url(#borderGlow)"
                  style={{
                    opacity: 1,
                  }}
                />
              </svg>

              
              <div
                ref={clickFlashRef}
                className="absolute inset-0 rounded-full bg-white opacity-0 pointer-events-none z-20"
              />
              
              <button className="relative overflow-hidden rounded-full group transition-all duration-300 px-8 sm:px-10 md:px-12 lg:px-14 py-3 sm:py-3.5 md:py-4 shadow-2xl border-2 border-white/10">
                
                <span className="btn-bg absolute inset-0 bg-size[200%_200%] bg-linear-to-r from-purple-600 via-indigo-600 to-fuchsia-600 transition-all duration-700" />

                <span className="absolute inset-0 bg-linear-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 blur-xl" />

                <span className="relative z-10 flex items-center gap-2 sm:gap-2.5 md:gap-3 text-white font-semibold tracking-widest uppercase text-xs sm:text-sm md:text-base">
                  <PlayIcon 
                    ref={playIconRef}
                    className="play-icon w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 drop-shadow-lg" 
                  />
                  PlayStation
                </span>

                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        </div>
      </section>

      <Footer />
    </>
  );
}