import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import bgVideo from "../assets/videos/background.mp4";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { PlayIcon } from "@heroicons/react/24/solid";


export default function LandingPage() {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const heroTextRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tl = gsap.timeline();

    // 🎥 Cinematic entrance
    tl.from(video, {
      scale: 1.4,
      filter: "blur(18px)",
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
          y: 60,
          duration: 1.4,
          ease: "power3.out",
        },
        "-=1.4"
      )
      .from(
        buttonRef.current,
        {
          opacity: 0,
          y: 10,
          scale: 0.9,
          duration: 1,
          ease: "back.out(1.4)",
        },
        "-=0.8"
      );
      gsap.to(".btn-bg", {
        backgroundPosition: "200% 50%",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    // 🔁 Button idle motion
    gsap.to(buttonRef.current, {
      y: -4,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <>
      <Navbar theme="light" cartCount={0} />

      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video */}
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
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-10 px-6 md:px-16">
          <div
            ref={heroTextRef}
            className="max-w-3xl text-left"
          >
            {/* MAIN HEADING */}
            <h1 className="heading-text text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.12em] leading-tight">
              JUSTGOT
              <span className="text-cyan-400">PLAYFUL</span>
              <span className="text-purple-400">N</span>
              <span className="text-cyan-400">RICH</span>
              <span className="text-purple-400">.NG</span>
            </h1>

            {/* SUB TEXT */}
            <p className="mt-6 flex items-center gap-1 text-white">
              <span className="text-lg md:text-xl font-bold">C</span>
              <span className="text-lg md:text-xl font-bold">O</span>

              <span className="text-sm md:text-base font-medium text-purple-400">N</span>
              <span className="text-sm md:text-base font-medium">T</span>
              <span className="text-sm md:text-base font-medium">R</span>

              <span className="text-lg md:text-xl font-bold ">
                3
              </span>
              <span className="text-lg md:text-xl font-bold">'S</span>

              {/* Nigeria Flag */}
              <span
                className="inline-block w-6 h-4 bg-contain bg-no-repeat ml-2"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 24%22%3E%3Cpath fill=%22%23008753%22 d=%22M0 0h12v24H0z%22/%3E%3Cpath fill=%22%23FFFFFF%22 d=%22M12 0h12v24H12z%22/%3E%3Cpath fill=%22%23008753%22 d=%22M24 0h12v24H24z%22/%3E%3C/svg%3E')",
                }}
              />
            </p>

            <div
              ref={buttonRef}
              className="mt-14 inline-block cursor-pointer"
              onMouseEnter={() => {
                gsap.to(".btn-bg", {
                  backgroundPosition: "100% 50%",
                  duration: 0.8,
                  ease: "power2.out",
                });
                gsap.to(buttonRef.current, {
                  y: -6,
                  scale: 1.05,
                  duration: 0.4,
                  ease: "power3.out",
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
              <button className="relative overflow-hidden rounded-full px-12 py-4 group">
                {/* Gradient background */}
                <span className="btn-bg absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 transition-all duration-700" />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-3 text-white font-semibold tracking-widest uppercase">
                  <PlayIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  PlayStation
                </span>
              </button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
