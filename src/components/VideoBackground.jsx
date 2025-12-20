// VideoBackground.jsx - Optimized with Performance Enhancements
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgVideo from "../assets/videos/background.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function VideoBackground() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const customCursorRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const cursor = customCursorRef.current;
    if (!video || !container) return;

    // Preload video poster for faster initial render
    const posterUrl = '/video-poster.jpg'; // Create a poster frame
    video.poster = posterUrl;

    /* ================================
       🎯 CUSTOM CURSOR - OPTIMIZED
    ================================= */
    const moveCursor = (e) => {
      // Use requestAnimationFrame for smoother cursor movement
      requestAnimationFrame(() => {
        if (cursor) {
          gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    // Throttle cursor movement for performance
    let ticking = false;
    const throttledMoveCursor = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          moveCursor(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", throttledMoveCursor, { passive: true });

    // Cursor interactions
    const textElements = container.querySelectorAll('.interactive-text, .word, h1, h2');
    textElements.forEach(el => {
      el.addEventListener("mouseenter", () => {
        gsap.to(cursor, {
          scale: 2.5,
          backgroundColor: "rgba(245, 158, 11, 0.5)",
          borderColor: "rgba(245, 158, 11, 0.8)",
          duration: 0.4,
          ease: "back.out(2)"
        });
      });
      
      el.addEventListener("mouseleave", () => {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.6)",
          duration: 0.4,
          ease: "power2.inOut"
        });
      });
    });

    const onLoadedMetadata = () => {
      setVideoLoaded(true);
      video.pause();
      video.currentTime = 0;

      /* ================================
         🎥 VIDEO CONTROLS - OPTIMIZED
      ================================= */
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Reduced for better performance
        onUpdate: (self) => {
          // Use requestAnimationFrame for smoother video scrubbing
          requestAnimationFrame(() => {
            const eased = gsap.parseEase("power1.inOut")(self.progress);
            video.currentTime = eased * video.duration;
          });
        },
      });

      // Simplified video scale animation
      gsap.fromTo(
        video,
        { scale: 1, filter: "blur(0px)" },
        {
          scale: 1.2, // Reduced from 1.35 for better performance
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0.25 },
        {
          opacity: 0.72,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "70% top",
            scrub: 1.5,
          },
        }
      );

      /* ================================
         🎬 SECTION ANIMATIONS - OPTIMIZED
      ================================= */
      
      // Section 1: Hero
      const section1Words = gsap.utils.toArray(".section-1-title .word");
      
      const heroTl = gsap.timeline();
      
      heroTl
        .from(video, {
          scale: 2,
          filter: "blur(20px) brightness(0.2)",
          duration: 2.5,
          ease: "power4.out",
        })
        .from(overlayRef.current, {
          opacity: 1,
          duration: 1.8,
          ease: "power2.out",
        }, "-=2")
        .from(section1Words, {
          opacity: 0,
          yPercent: 150,
          rotationX: -90,
          stagger: {
            each: 0.05,
            ease: "power2.out"
          },
          duration: 1.5,
          ease: "power4.out",
        }, "-=1")
        .from(".section-1-subtitle", {
          opacity: 0,
          y: 40,
          letterSpacing: "0.6em",
          duration: 1.2,
          ease: "power3.out",
        }, "-=0.6")
        .from(".scroll-indicator", {
          opacity: 0,
          y: -40,
          duration: 1,
          ease: "power2.out",
        }, "-=0.6");

      // Optimized word hover
      section1Words.forEach((word, i) => {
        let hoverTween = null;
        
        word.addEventListener("mouseenter", function() {
          if (hoverTween) hoverTween.kill();
          
          hoverTween = gsap.to(this, {
            y: -12,
            color: "#f59e0b",
            scale: 1.08,
            textShadow: "0 25px 50px rgba(245, 158, 11, 0.4)",
            duration: 0.4,
            ease: "power3.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          if (hoverTween) hoverTween.kill();
          
          hoverTween = gsap.to(this, {
            y: 0,
            color: "#ffffff",
            scale: 1,
            textShadow: "0 0 0 rgba(245, 158, 11, 0)",
            duration: 0.4,
            ease: "power2.inOut"
          });
        });
      });

      // Scroll indicator
      gsap.to(".scroll-indicator", {
        y: 15,
        opacity: 0.35,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".scroll-indicator", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: container,
          start: "8% top",
          end: "18% top",
          scrub: 2,
        },
      });

      // Section 1 exit
      gsap.to(".section-1-content", {
        opacity: 0,
        y: -150,
        scale: 0.90,
        filter: "blur(15px)",
        scrollTrigger: {
          trigger: ".section-1",
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: 2,
        },
      });

      // Section 2: Split Reveal
      const section2Words = gsap.utils.toArray(".section-2-title .word");
      
      gsap.from(section2Words, {
        opacity: 0,
        yPercent: 120,
        rotationY: -35,
        stagger: {
          each: 0.1,
          ease: "power2.inOut"
        },
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-2",
          start: "top 70%",
          end: "top 15%",
          scrub: 2,
        },
      });

      // Optimized magnetic hover for section 2
      section2Words.forEach(word => {
        let hoverTween = null;
        
        word.addEventListener("mousemove", function(e) {
          if (hoverTween) hoverTween.kill();
          
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          hoverTween = gsap.to(this, {
            x: x * 0.3,
            y: y * 0.3,
            rotationY: x * 0.25,
            rotationX: -y * 0.25,
            color: "#f59e0b",
            scale: 1.08,
            textShadow: "0 18px 40px rgba(0, 0, 0, 0.6)",
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          if (hoverTween) hoverTween.kill();
          
          hoverTween = gsap.to(this, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            color: "#ffffff",
            scale: 1,
            textShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
          });
        });
      });

      gsap.to(".section-2-content", {
        opacity: 0,
        x: -150,
        filter: "blur(12px)",
        scrollTrigger: {
          trigger: ".section-2",
          start: "bottom 75%",
          end: "bottom 25%",
          scrub: 2,
        },
      });

      // Remaining sections use similar optimizations...
      // (keeping code concise - apply same patterns to sections 3-5)

      // Section 3: Tension
      const section3Words = gsap.utils.toArray(".section-3-title .word");
      gsap.from(section3Words, {
        opacity: 0,
        scale: 0.4,
        rotation: (i) => gsap.utils.random(-40, 40),
        stagger: { each: 0.08, from: "random", ease: "power2.inOut" },
        duration: 1.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".section-3",
          start: "top 75%",
          end: "top 20%",
          scrub: 2,
        },
      });

      // Section 4: Liberation
      const section4Words = gsap.utils.toArray(".section-4-title .word");
      gsap.from(section4Words, {
        opacity: 0,
        y: 100,
        rotationZ: (i) => gsap.utils.random(-25, 25),
        stagger: { each: 0.12, from: "random", ease: "power2.inOut" },
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-4",
          start: "top 75%",
          end: "top 20%",
          scrub: 2,
        },
      });

      // Section 5: Grand Finale
      const section5Words = gsap.utils.toArray(".section-5-title .word");
      gsap.from(section5Words, {
        opacity: 0,
        scale: 0.6,
        y: 80,
        rotationX: 50,
        stagger: { each: 0.05, ease: "power2.inOut" },
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".section-5",
          start: "top 70%",
          end: "top 20%",
          scrub: 2,
        },
      });
    };

    const onVideoError = (e) => {
      console.error('Video failed to load:', e);
      setVideoError(true);
      // Fallback: show static background
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("error", onVideoError);

    return () => {
      window.removeEventListener("mousemove", throttledMoveCursor);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onVideoError);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Split text into words
  const splitIntoWords = (text) => {
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="word inline-block mr-2 md:mr-4 cursor-pointer interactive-text"
        style={{ 
          transformStyle: "preserve-3d",
          display: "inline-block",
          willChange: "transform"
        }}
      >
        {word}
      </span>
    ));
  };

  return (
    <>
      {/* 🎯 CUSTOM CURSOR */}
      <div
        ref={customCursorRef}
        className="fixed w-5 h-5 rounded-full pointer-events-none z-[100] mix-blend-difference border-2 hidden md:block"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.6)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 🎥 FIXED VIDEO BACKGROUND */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden">
        {!videoError ? (
          <video
            ref={videoRef}
            src={bgVideo}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover will-change-transform"
            style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black" />
        )}
        
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/70"
        />
        
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.88) 100%)",
          }}
        />
      </div>

      {/* 📜 NARRATIVE SECTIONS */}
      <div ref={containerRef} className="relative z-10" style={{ cursor: "none" }}>
        
        {/* SECTION 1: HERO */}
        <section className="section-1 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="section-1-content max-w-7xl">
            <h1 className="section-1-title text-[11vw] md:text-[9vw] lg:text-[8vw] font-extralight tracking-tighter leading-[0.88] text-white uppercase mb-8"
                style={{ perspective: "1200px" }}>
              {splitIntoWords("Born from the struggles of an African child")}
            </h1>
            <p className="section-1-subtitle text-xs md:text-sm tracking-[0.4em] uppercase text-white/50 font-light">
              From the Streets · JGPNR.NG
            </p>
          </div>
          
          <div className="scroll-indicator fixed bottom-10 left-6 md:left-12 flex flex-col gap-2 text-white/50">
            <span className="text-[10px] tracking-[0.35em] uppercase font-light">Scroll</span>
            <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </section>

        {/* SECTION 2: CHOICE */}
        <section className="section-2 min-h-screen flex items-center px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="section-2-content max-w-6xl">
            <h2 className="section-2-title text-[10vw] md:text-[8vw] lg:text-[7vw] font-extralight tracking-tighter leading-[0.9] text-white uppercase mb-6"
                style={{ perspective: "1200px" }}>
              {splitIntoWords("Born into the race by choice")}
            </h2>
            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/40 max-w-md font-light">
              The journey begins before words are spoken
            </p>
          </div>
        </section>

        {/* SECTION 3: STRUGGLE */}
        <section className="section-3 min-h-screen flex items-center justify-end px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="section-3-content max-w-6xl text-right">
            <h2 className="section-3-title text-[9.5vw] md:text-[7.5vw] lg:text-[6.5vw] font-extralight tracking-tighter leading-[0.92] text-white uppercase mb-6"
                style={{ perspective: "1200px" }}>
              {splitIntoWords("Raised by struggles driven by survival")}
            </h2>
            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/40 font-light">
              Every scar, a testament
            </p>
          </div>
        </section>

        {/* SECTION 4: VOICE */}
        <section className="section-4 min-h-screen flex items-center px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="section-4-content max-w-5xl">
            <h2 className="section-4-title text-[9vw] md:text-[7vw] lg:text-[6vw] font-extralight tracking-tighter leading-[0.95] text-white uppercase mb-6"
                style={{ perspective: "1200px" }}>
              {splitIntoWords("Creativity became the voice")}
            </h2>
            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/40 max-w-sm font-light">
              Where words failed, art spoke
            </p>
          </div>
        </section>

        {/* SECTION 5: FREEDOM */}
        <section className="section-5 min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="section-5-content max-w-7xl text-center">
            <h2 className="section-5-title text-[8.5vw] md:text-[6.5vw] lg:text-[5.5vw] font-extralight tracking-tighter leading-[0.88] text-white uppercase mb-10"
                style={{ perspective: "1200px" }}>
              {splitIntoWords("Fashion became the language Art became the freedom")}
            </h2>
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/50 font-light">
              Empowering Young Creative Minds
            </p>
          </div>
        </section>
      </div>
    </>
  );
}