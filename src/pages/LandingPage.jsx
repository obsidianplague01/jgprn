// LandingPage.jsx
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
  const glow4Ref = useRef(null);
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

    // 🌟 Multiple layered glow animations - subtle and beautiful
    // Glow 1 - Purple outer ring (slow, large)
    gsap.to(glow1Ref.current, {
      opacity: 0.4,
      scale: 1.3,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Glow 2 - Pink middle ring (medium speed)
    gsap.to(glow2Ref.current, {
      opacity: 0.5,
      scale: 1.2,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5,
    });

    // Glow 3 - Indigo inner ring (faster)
    gsap.to(glow3Ref.current, {
      opacity: 0.6,
      scale: 1.15,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    // Glow 4 - Rotating halo effect
    gsap.to(glow4Ref.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.to(glow4Ref.current, {
      opacity: 0.3,
      scale: 1.25,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5,
    });

    // 🔄 Button gradient animation
    gsap.to(".btn-bg", {
      backgroundPosition: "200% 50%",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ✨ Play icon pulse with subtle rotation
    gsap.to(".play-icon", {
      scale: 1.1,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".play-icon", {
      rotation: 15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <>
      <Navbar theme="light" cartCount={0} />

      {/* HERO SECTION - 100vh */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/65"
        />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-10 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
          <div
            ref={heroTextRef}
            className="max-w-7xl w-full"
          >
            {/* MAIN HEADING - Responsive Typography */}
            <h1 className="heading-text text-white leading-[0.9] sm:leading-[0.92] md:leading-[0.95] font-bold tracking-[0.08em] sm:tracking-[0.1em] md:tracking-[0.12em] mb-4 sm:mb-6 md:mb-8">
              <span className="block text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw]">
                JUSTGOT
              </span>
              <span className="block text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw]">
                <span className="text-cyan-400">PLAYFUL</span>
                <span className="text-purple-400">N</span>
                <span className="text-cyan-400">RICH</span>
                <span className="text-purple-400">.NG</span>
              </span>
            </h1>

            {/* SUB TEXT - Responsive */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-white mb-8 sm:mb-10 md:mb-14 lg:mb-16">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">C</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">O</span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-purple-400">N</span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">T</span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">R</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">3</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">'S</span>

              {/* Nigeria Flag - Responsive Size */}
              <span
                className="inline-block w-5 h-3 sm:w-6 sm:h-4 md:w-7 md:h-5 bg-contain bg-no-repeat ml-1 sm:ml-2"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 24%22%3E%3Cpath fill=%22%23008753%22 d=%22M0 0h12v24H0z%22/%3E%3Cpath fill=%22%23FFFFFF%22 d=%22M12 0h12v24H12z%22/%3E%3Cpath fill=%22%23008753%22 d=%22M24 0h12v24H24z%22/%3E%3C/svg%3E')",
                }}
              />
            </div>

            {/* CTA Button with Multiple Layered Glows */}
            <div
              ref={buttonRef}
              className="inline-block cursor-pointer relative"
              onMouseEnter={() => {
                gsap.to(".btn-bg", {
                  backgroundPosition: "100% 50%",
                  duration: 0.8,
                  ease: "power2.out",
                });
                gsap.to(buttonRef.current, {
                  y: -12,
                  scale: 1.05,
                  duration: 0.4,
                  ease: "power3.out",
                });
                gsap.to([glow1Ref.current, glow2Ref.current, glow3Ref.current, glow4Ref.current], {
                  opacity: 0.8,
                  scale: "+=0.1",
                  duration: 0.3,
                });
              }}
              onMouseLeave={() => {
                gsap.to(".btn-bg", {
                  backgroundPosition: "0% 50%",
                  duration: 0.8,
                  ease: "power2.out",
                });
                gsap.to(buttonRef.current, {
                  y: 0,
                  scale: 1,
                  duration: 0.4,
                  ease: "power3.out",
                });
              }}
              onClick={() => navigate("/playstation")}
            >
              {/* Multiple Layered Glow Effects */}
              {/* Glow 1 - Outer Purple Halo */}
              <div
                ref={glow1Ref}
                className="absolute -inset-8 rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)",
                }}
              />
              
              {/* Glow 2 - Middle Pink Ring */}
              <div
                ref={glow2Ref}
                className="absolute -inset-6 rounded-full opacity-40 blur-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(219, 39, 119, 0.5) 0%, rgba(219, 39, 119, 0.3) 50%, transparent 100%)",
                }}
              />
              
              {/* Glow 3 - Inner Indigo Glow */}
              <div
                ref={glow3Ref}
                className="absolute -inset-4 rounded-full opacity-50 blur-xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0.4) 50%, transparent 100%)",
                }}
              />
              
              {/* Glow 4 - Rotating Halo Effect */}
              <div
                ref={glow4Ref}
                className="absolute -inset-7 rounded-full opacity-25 blur-2xl pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg, rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3), rgba(99, 102, 241, 0.3), rgba(147, 51, 234, 0.3))",
                }}
              />
              
              <button className="relative overflow-hidden rounded-full group transition-all duration-300 px-8 sm:px-10 md:px-12 lg:px-14 py-3 sm:py-3.5 md:py-4 shadow-2xl">
                {/* Gradient background */}
                <span className="btn-bg absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 transition-all duration-700" />

                {/* Inner glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 blur-xl" />

                {/* Content - Responsive */}
                <span className="relative z-10 flex items-center gap-2 sm:gap-2.5 md:gap-3 text-white font-semibold tracking-widest uppercase text-xs sm:text-sm md:text-base">
                  <PlayIcon className="play-icon w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg" />
                  PlayStation
                </span>

                {/* Hover shine effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </span>

                {/* Border glow */}
                <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Film Grain Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        </div>
      </section>

      <Footer />
    </>
  );
}