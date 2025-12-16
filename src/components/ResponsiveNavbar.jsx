import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMaskSettings } from "../../constant";

function ResponsiveNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const navRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const blobRef = useRef(null);

  const { initialMaskPos, initialMaskSize } = useMaskSettings();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // 🎬 Navbar entrance + logo animation
  useGSAP(() => {
    if (!navRef.current || !logoRef.current) return;

    // Mask setup
    gsap.set(".mask-wrapper", {
      maskPosition: initialMaskPos,
      maskSize: initialMaskSize,
    });

    // Refined navbar entrance
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        ease: "power3.out",
        delay: 0.3
      }
    );

    // Logo animation
    gsap.timeline({ repeat: -1, yoyo: true })
      .to(logoRef.current, { y: -10, duration: 1.2, ease: "power1.inOut" })
      .to(logoRef.current, { rotationY: 360, duration: 2, ease: "power1.inOut" })
      .to(logoRef.current, { rotation: 0, y: 0, duration: 1, ease: "power1.inOut" });

    // Menu button subtle pulse
    if (menuButtonRef.current) {
      gsap.to(menuButtonRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  // 🎬 Enhanced menu animations with blob
  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      // Animate blob morphing
      if (blobRef.current) {
        gsap.to(blobRef.current, {
          attr: {
            d: "M45.2,-73.9C58.6,-65.9,69.5,-52.5,76.8,-37.3C84.1,-22.1,87.9,-5,86.3,11.6C84.7,28.2,77.7,44.3,66.9,56.2C56.1,68.1,41.5,75.8,25.8,78.9C10.1,82,-6.7,80.5,-22.3,75.3C-37.9,70.1,-52.3,61.2,-63.5,48.9C-74.7,36.6,-82.7,20.9,-84.2,4.3C-85.7,-12.3,-80.7,-29.8,-71.2,-44.1C-61.7,-58.4,-47.7,-69.5,-32.4,-76.5C-17.1,-83.5,-0.5,-86.4,14.6,-83.9C29.7,-81.4,31.8,-81.9,45.2,-73.9Z"
          },
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to(blobRef.current, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none"
        });

        gsap.to(blobRef.current, {
          scale: 1.15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Dramatic menu entrance
      const tl = gsap.timeline();
      
      tl.fromTo(
        menuRef.current,
        { 
          clipPath: "circle(0% at 95% 5%)",
          opacity: 0 
        },
        { 
          clipPath: "circle(150% at 50% 50%)",
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out" 
        }
      );

      tl.from(
        ".menu-blob",
        {
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)"
        },
        "-=0.5"
      );

      tl.fromTo(
        ".menu-item",
        { 
          opacity: 0, 
          x: -60,
          rotationY: -45
        },
        { 
          opacity: 1, 
          x: 0,
          rotationY: 0,
          stagger: 0.08, 
          duration: 0.6,
          ease: "back.out(1.2)" 
        },
        "-=0.4"
      );

      tl.fromTo(
        ".menu-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );

      tl.fromTo(
        ".menu-footer",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );

    } else {
      const tl = gsap.timeline({
        onComplete: () => setIsVisible(false)
      });

      tl.to(".menu-item", {
        opacity: 0,
        x: 60,
        rotationY: 45,
        stagger: 0.04,
        duration: 0.4,
        ease: "power2.in",
      });

      tl.to(
        [".menu-header", ".menu-footer"],
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.3"
      );

      tl.to(".menu-blob", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.7)"
      }, "-=0.3");

      tl.to(menuRef.current, {
        clipPath: "circle(0% at 95% 5%)",
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen) {
      setIsVisible(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  // Navigation items with routes
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: "Play Station", path: "/playstation" },
    { name: "Coming Soon", path: "/coming-soon" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50">
        <div
          ref={navRef}
          className="flex items-center justify-between px-6 md:px-12 py-4 md:py-6 relative z-50 mask-wrapper"
        >
          <Link to="/">
            <img 
              ref={logoRef} 
              src={logo} 
              alt="JGPNR Logo" 
              className="h-20 md:h-24 w-auto cursor-pointer drop-shadow-lg" 
            />
          </Link>

          <button 
            ref={menuButtonRef}
            className={`
              focus:outline-none z-50 
              transition-all duration-300 
              hover:scale-110
              w-14 h-14 
              rounded-full 
              flex items-center justify-center
              backdrop-blur-md
              border-2
              ${!isOpen 
                ? 'bg-black/30 border-white/20 hover:bg-black/50 hover:border-white/40' 
                : 'bg-white/30 border-black/20 hover:bg-white/50 hover:border-black/40'
              }
            `}
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {!isOpen ? (
              <Bars3BottomLeftIcon className="h-6 w-6 text-white drop-shadow-md" />
            ) : (
              <XMarkIcon className="h-6 w-6 text-black drop-shadow-md" />
            )}
          </button>
        </div>
      </nav>

      {/* Fullscreen menu overlay */}
      {isVisible && (
        <div 
          ref={menuRef} 
          className="fixed inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 z-40 overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Animated Blob Background */}
          <div className="menu-blob absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <svg 
              className="w-[150%] h-[150%] absolute"
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "blur(40px)" }}
            >   
              <path 
                ref={blobRef}
                fill="#010101" 
                d="M42.3,-66.1C55.9,-57.2,68.5,-47.1,74.3,-34C80.2,-20.9,79.3,-4.8,73.1,7.7C67,20.3,55.7,29.4,45.9,38.5C36,47.6,27.7,56.8,16.9,62.2C6,67.6,-7.4,69.1,-18.7,65.1C-30,61.1,-39.2,51.6,-46.2,41.3C-53.2,31,-58,20,-58.1,9.3C-58.1,-1.4,-53.6,-11.9,-52.1,-27.4C-50.6,-42.9,-52.3,-63.5,-44.2,-74.8C-36,-86.1,-18,-88.2,-1.8,-85.4C14.4,-82.7,28.8,-75,42.3,-66.1Z" 
                transform="translate(100 100)" 
              />
            </svg>
            
            <svg 
              className="w-[120%] h-[120%] absolute"
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "blur(60px)" }}
            >   
              <path 
                fill="#FFFFFF" 
                d="M47.3,-78.5C60.9,-70.2,71.4,-56.4,77.8,-40.9C84.2,-25.4,86.5,-8.2,84.1,7.8C81.7,23.8,74.6,38.6,64.5,50.8C54.4,63,41.3,72.6,26.3,77.9C11.3,83.2,-5.6,84.2,-21.4,80.5C-37.2,76.8,-51.9,68.4,-63.8,56.3C-75.7,44.2,-84.8,28.4,-87.3,11.4C-89.8,-5.6,-85.7,-23.8,-77.1,-38.9C-68.5,-54,-55.4,-66,-40.8,-73.8C-26.2,-81.6,-10.1,-85.2,4.9,-92.5C19.9,-99.8,33.7,-86.8,47.3,-78.5Z" 
                transform="translate(100 100)" 
                style={{
                  animation: "blob-morph 10s ease-in-out infinite alternate"
                }}
              />
            </svg>
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black rounded-full blur-3xl animate-pulse" 
                 style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" 
                 style={{ animationDuration: "6s", animationDelay: "2s" }} />
          </div>

          {/* Menu header */}
          <div className="menu-header absolute top-20 md:top-28 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-sm md:text-sm tracking-[0.2em] uppercase opacity-60 font-light">
              {date} · {time}
            </p>
          </div>

          {/* Menu items with routing */}
          <ul className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-black z-10">
            {navItems.map((item) => (
              <li 
                key={item.name} 
                className="menu-item group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link 
                  to={item.path}
                  className="block"
                >
                  <span className="text-lg md:text-lg lg:text-lg font-light tracking-wide transition-all duration-300 group-hover:tracking-widest group-hover:text-white inline-block">
                    {item.name}
                  </span>
                  <div className="h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left mt-0.5" />
                </Link>
              </li>
            ))}
            
            {/* Social icon */}
            <li className="menu-item mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-xl md:text-xl cursor-pointer hover:scale-110 hover:rotate-12 transition-all duration-300" />
              </a>
            </li>
          </ul>

          {/* Menu footer */}
          <div className="menu-footer absolute bottom-6 md:bottom-8 left-6 md:left-12 right-6 md:right-12 flex justify-between items-end text-black z-10">
            <div>
              <p className="text-lg md:text-lg font-semibold tracking-[0.3em]">JGPNR.NG</p>
            </div>
            <p className="text-xs md:text-sm opacity-70 tracking-wide">
              Creative Studios.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob-morph {
          0% {
            d: path("M47.3,-78.5C60.9,-70.2,71.4,-56.4,77.8,-40.9C84.2,-25.4,86.5,-8.2,84.1,7.8C81.7,23.8,74.6,38.6,64.5,50.8C54.4,63,41.3,72.6,26.3,77.9C11.3,83.2,-5.6,84.2,-21.4,80.5C-37.2,76.8,-51.9,68.4,-63.8,56.3C-75.7,44.2,-84.8,28.4,-87.3,11.4C-89.8,-5.6,-85.7,-23.8,-77.1,-38.9C-68.5,-54,-55.4,-66,-40.8,-73.8C-26.2,-81.6,-10.1,-85.2,4.9,-92.5C19.9,-99.8,33.7,-86.8,47.3,-78.5Z");
          }
          50% {
            d: path("M45.2,-73.9C58.6,-65.9,69.5,-52.5,76.8,-37.3C84.1,-22.1,87.9,-5,86.3,11.6C84.7,28.2,77.7,44.3,66.9,56.2C56.1,68.1,41.5,75.8,25.8,78.9C10.1,82,-6.7,80.5,-22.3,75.3C-37.9,70.1,-52.3,61.2,-63.5,48.9C-74.7,36.6,-82.7,20.9,-84.2,4.3C-85.7,-12.3,-80.7,-29.8,-71.2,-44.1C-61.7,-58.4,-47.7,-69.5,-32.4,-76.5C-17.1,-83.5,-0.5,-86.4,14.6,-83.9C29.7,-81.4,31.8,-81.9,45.2,-73.9Z");
          }
          100% {
            d: path("M42.3,-66.1C55.9,-57.2,68.5,-47.1,74.3,-34C80.2,-20.9,79.3,-4.8,73.1,7.7C67,20.3,55.7,29.4,45.9,38.5C36,47.6,27.7,56.8,16.9,62.2C6,67.6,-7.4,69.1,-18.7,65.1C-30,61.1,-39.2,51.6,-46.2,41.3C-53.2,31,-58,20,-58.1,9.3C-58.1,-1.4,-53.6,-11.9,-52.1,-27.4C-50.6,-42.9,-52.3,-63.5,-44.2,-74.8C-36,-86.1,-18,-88.2,-1.8,-85.4C14.4,-82.7,28.8,-75,42.3,-66.1Z");
          }
        }
      `}</style>
    </>
  );
}

export default ResponsiveNavBar;