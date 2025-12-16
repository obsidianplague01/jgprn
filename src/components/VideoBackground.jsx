import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgVideo from "../assets/videos/background.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function VideoBackground() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const customCursorRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const cursor = customCursorRef.current;
    if (!video || !container) return;

    /* ================================
       🎯 CUSTOM CURSOR
    ================================= */
    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", moveCursor);

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
      video.pause();
      video.currentTime = 0;

      /* ================================
         🎥 VIDEO CONTROLS - ULTRA SMOOTH
      ================================= */
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 2, // Increased for smoother feel
        onUpdate: (self) => {
          const eased = gsap.parseEase("power1.inOut")(self.progress);
          video.currentTime = eased * video.duration;
        },
      });

      gsap.fromTo(
        video,
        { scale: 1, filter: "blur(0px)" },
        {
          scale: 1.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
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
            scrub: 2,
          },
        }
      );

      /* ================================
         🎬 SECTION 1: HERO ENTRANCE
      ================================= */
      const section1Words = gsap.utils.toArray(".section-1-title .word");
      
      const heroTl = gsap.timeline();
      
      heroTl
        .from(video, {
          scale: 2.2,
          filter: "blur(25px) brightness(0.2)",
          duration: 2.8,
          ease: "power4.out",
        })
        .from(overlayRef.current, {
          opacity: 1,
          duration: 2,
          ease: "power2.out",
        }, "-=2.3")
        .from(section1Words, {
          opacity: 0,
          yPercent: 150,
          rotationX: -90,
          stagger: {
            each: 0.05,
            ease: "power2.out"
          },
          duration: 1.8,
          ease: "power4.out",
        }, "-=1.2")
        .from(".section-1-subtitle", {
          opacity: 0,
          y: 40,
          letterSpacing: "0.6em",
          duration: 1.5,
          ease: "power3.out",
        }, "-=0.8")
        .from(".scroll-indicator", {
          opacity: 0,
          y: -40,
          duration: 1.2,
          ease: "power2.out",
        }, "-=0.8");

      // Enhanced word hover with smooth transitions
      section1Words.forEach((word, i) => {
        word.addEventListener("mouseenter", function(e) {
          gsap.to(this, {
            y: -12,
            color: "#f59e0b",
            scale: 1.08,
            textShadow: "0 25px 50px rgba(245, 158, 11, 0.4)",
            duration: 0.6,
            ease: "power3.out"
          });
          
          // Smooth ripple to neighbors
          gsap.to(section1Words, {
            y: (index) => {
              const distance = Math.abs(index - i);
              return distance <= 2 ? -5 / (distance + 1) : 0;
            },
            duration: 0.6,
            ease: "power2.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          gsap.to(this, {
            y: 0,
            color: "#ffffff",
            scale: 1,
            textShadow: "0 0 0 rgba(245, 158, 11, 0)",
            duration: 0.6,
            ease: "power2.inOut"
          });
          
          gsap.to(section1Words, {
            y: 0,
            duration: 0.6,
            ease: "power2.inOut"
          });
        });
      });

      // Smooth scroll indicator
      gsap.to(".scroll-indicator", {
        y: 15,
        opacity: 0.35,
        duration: 2.2,
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

      // Smooth section 1 exit
      gsap.to(".section-1-content", {
        opacity: 0,
        y: -150,
        scale: 0.90,
        filter: "blur(15px)",
        scrollTrigger: {
          trigger: ".section-1",
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: 2.5,
        },
      });

      /* ================================
         ✨ SECTION 2: SMOOTH SPLIT REVEAL
      ================================= */
      const section2Words = gsap.utils.toArray(".section-2-title .word");
      
      gsap.from(section2Words, {
        opacity: 0,
        yPercent: 120,
        rotationY: -35,
        stagger: {
          each: 0.12,
          ease: "power2.inOut"
        },
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-2",
          start: "top 70%",
          end: "top 15%",
          scrub: 2.5,
        },
      });

      // Buttery smooth magnetic hover
      section2Words.forEach(word => {
        word.addEventListener("mousemove", function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(this, {
            x: x * 0.35,
            y: y * 0.35,
            rotationY: x * 0.3,
            rotationX: -y * 0.3,
            color: "#f59e0b",
            scale: 1.1,
            textShadow: "0 18px 40px rgba(0, 0, 0, 0.6)",
            duration: 0.5,
            ease: "power2.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          gsap.to(this, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            color: "#ffffff",
            scale: 1,
            textShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.8,
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
          scrub: 2.5,
        },
      });

      /* ================================
         🔥 SECTION 3: SMOOTH TENSION
      ================================= */
      const section3Words = gsap.utils.toArray(".section-3-title .word");
      
      gsap.from(section3Words, {
        opacity: 0,
        scale: 0.4,
        rotation: (i) => gsap.utils.random(-40, 40),
        stagger: {
          each: 0.08,
          from: "random",
          ease: "power2.inOut"
        },
        duration: 1.5,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".section-3",
          start: "top 75%",
          end: "top 20%",
          scrub: 2.5,
        },
      });

      // Smooth glitch hover
      section3Words.forEach((word, i) => {
        word.addEventListener("mouseenter", function() {
          const glitchTl = gsap.timeline();
          
          glitchTl
            .to(this, {
              x: gsap.utils.random(-6, 6),
              skewX: gsap.utils.random(-8, 8),
              duration: 0.06,
              repeat: 3,
              yoyo: true,
            })
            .to(this, {
              x: 0,
              skewX: 0,
              scale: 1.18,
              color: "#ef4444",
              textShadow: "0 0 25px rgba(239, 68, 68, 0.9)",
              duration: 0.3,
              ease: "power2.out"
            });
          
          gsap.to(section3Words, {
            y: (index) => {
              const distance = Math.abs(index - i);
              return distance <= 1 ? -8 : 0;
            },
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          gsap.to(this, {
            scale: 1,
            color: "#ffffff",
            textShadow: "0 0 0 rgba(239, 68, 68, 0)",
            duration: 0.5,
            ease: "power2.inOut"
          });
          
          gsap.to(section3Words, {
            y: 0,
            duration: 0.5,
            ease: "power2.inOut"
          });
        });
      });

      // Smooth parallax
      gsap.fromTo(".section-3-content", {
        x: -100,
      }, {
        x: 100,
        scrollTrigger: {
          trigger: ".section-3",
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(".section-3-content", {
        opacity: 0,
        y: -120,
        filter: "blur(15px)",
        scrollTrigger: {
          trigger: ".section-3",
          start: "bottom 75%",
          end: "bottom 25%",
          scrub: 2.5,
        },
      });

      /* ================================
         💚 SECTION 4: SMOOTH LIBERATION
      ================================= */
      const section4Words = gsap.utils.toArray(".section-4-title .word");
      
      gsap.from(section4Words, {
        opacity: 0,
        y: 100,
        rotationZ: (i) => gsap.utils.random(-25, 25),
        stagger: {
          each: 0.15,
          from: "random",
          ease: "power2.inOut"
        },
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-4",
          start: "top 75%",
          end: "top 20%",
          scrub: 2.5,
        },
      });

      // Ultra smooth floating hover
      section4Words.forEach(word => {
        word.addEventListener("mouseenter", function() {
          gsap.to(this, {
            y: -18,
            color: "#10b981",
            scale: 1.12,
            textShadow: "0 25px 50px rgba(16, 185, 129, 0.5)",
            duration: 0.8,
            ease: "power3.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          gsap.to(this, {
            y: 0,
            color: "#ffffff",
            scale: 1,
            textShadow: "0 0 0 rgba(16, 185, 129, 0)",
            duration: 0.8,
            ease: "power3.inOut"
          });
        });
      });

      gsap.to(".section-4-content", {
        opacity: 0,
        scale: 0.85,
        filter: "blur(12px)",
        scrollTrigger: {
          trigger: ".section-4",
          start: "bottom 75%",
          end: "bottom 30%",
          scrub: 2.5,
        },
      });

      /* ================================
         👑 SECTION 5: GRAND FINALE (SMOOTH)
      ================================= */
      const section5Words = gsap.utils.toArray(".section-5-title .word");
      
      gsap.from(section5Words, {
        opacity: 0,
        scale: 0.6,
        y: 80,
        rotationX: 50,
        stagger: {
          each: 0.05,
          ease: "power2.inOut"
        },
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".section-5",
          start: "top 70%",
          end: "top 20%",
          scrub: 2.5,
        },
      });

      // Premium smooth magnetic hover
      section5Words.forEach(word => {
        word.addEventListener("mousemove", function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(this, {
            x: x * 0.45,
            y: y * 0.45,
            color: "#f59e0b",
            scale: 1.15,
            textShadow: "0 30px 60px rgba(0, 0, 0, 0.7)",
            duration: 0.5,
            ease: "power2.out"
          });
        });
        
        word.addEventListener("mouseleave", function() {
          gsap.to(this, {
            x: 0,
            y: 0,
            color: "#ffffff",
            scale: 1,
            textShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.9,
            ease: "elastic.out(1, 0.4)"
          });
        });
      });

      // Keep section 5 partially visible for footer
      gsap.to(".section-5-content", {
        opacity: 0.2,
        scale: 0.92,
        scrollTrigger: {
          trigger: ".section-5",
          start: "bottom 50%",
          end: "bottom 15%",
          scrub: 2,
        },
      });
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
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
        className="fixed w-5 h-5 rounded-full pointer-events-none z-[100] mix-blend-difference border-2"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.6)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 🎥 FIXED VIDEO BACKGROUND */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={bgVideo}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover will-change-transform"
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/70"
        />
        
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.88) 100%)",
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