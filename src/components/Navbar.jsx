import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaInstagram, FaShoppingCart } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "../context/CartContex";

export default function Navbar({ theme = 'dark' }) {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const navRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const blobRef = useRef(null);

  // Detect screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close menu if switching to desktop
      if (!mobile) {
        setIsOpen(false);
        setIsVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Navbar entrance + enhanced logo animation
  useGSAP(() => {
    if (!navRef.current || !logoRef.current) return;

    // Navbar entrance
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );

    // Beautiful logo animation sequence - FLIP ROTATION with rotateY
    const logoSequence = gsap.timeline({ 
      delay: 1.5,
      repeat: -1,
    });

    // 1. COIN FLIP (rotateY - side to side flip)
    logoSequence.to(logoRef.current, {
      rotateY: 360,
      duration: 1.5,
      ease: "power2.inOut",
    });

    // Reset for clean loop
    logoSequence.set(logoRef.current, { rotateY: 0 });

    // 2. ENERGETIC BOUNCE with scale
    logoSequence.to(logoRef.current, {
      y: -28,
      scale: 1.15,
      duration: 0.4,
      ease: "power2.out",
    });

    logoSequence.to(logoRef.current, {
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "bounce.out",
    });

    // 3. QUICK PULSE
    logoSequence.to(logoRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
    });

    logoSequence.to(logoRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "elastic.out(1, 0.5)",
    });

    // 4. PLAYFUL TILT WIGGLE (Z-axis shake)
    logoSequence.to(logoRef.current, {
      rotateZ: 15,
      duration: 0.18,
      ease: "power2.out",
    });

    logoSequence.to(logoRef.current, {
      rotateZ: -15,
      duration: 0.32,
      ease: "sine.inOut",
    });

    logoSequence.to(logoRef.current, {
      rotateZ: 10,
      duration: 0.28,
      ease: "sine.inOut",
    });

    logoSequence.to(logoRef.current, {
      rotateZ: -6,
      duration: 0.22,
      ease: "sine.inOut",
    });

    logoSequence.to(logoRef.current, {
      rotateZ: 0,
      duration: 0.18,
      ease: "power2.inOut",
    });

    // 5. SUBTLE Y-AXIS WIGGLE (slight flip wobble)
    logoSequence.to(logoRef.current, {
      rotateY: 20,
      duration: 0.25,
      ease: "power1.out",
    });

    logoSequence.to(logoRef.current, {
      rotateY: -20,
      duration: 0.4,
      ease: "sine.inOut",
    });

    logoSequence.to(logoRef.current, {
      rotateY: 12,
      duration: 0.35,
      ease: "sine.inOut",
    });

    logoSequence.to(logoRef.current, {
      rotateY: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });

    // 6. GENTLE FLOAT (breathing motion)
    logoSequence.to(logoRef.current, {
      y: -10,
      scale: 1.03,
      duration: 0.7,
      ease: "sine.inOut",
    });

    logoSequence.to(logoRef.current, {
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "sine.inOut",
    });

    // 7. QUICK SPIN (small rotateY flip)
    logoSequence.to(logoRef.current, {
      rotateY: 180,
      duration: 0.5,
      ease: "power2.inOut",
    });

    logoSequence.to(logoRef.current, {
      rotateY: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // 8. PAUSE before repeating
    logoSequence.to(logoRef.current, {
      duration: 1,
    });
  }, []);

  // Menu animations
  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      // Blob animations
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
      }

      const tl = gsap.timeline();
      
      tl.fromTo(
        menuRef.current,
        { clipPath: "circle(0% at 95% 5%)", opacity: 0 },
        { clipPath: "circle(150% at 50% 50%)", opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      tl.from(".menu-blob", {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
      }, "-=0.5");

      tl.fromTo(
        ".menu-item",
        { opacity: 0, x: -60, rotationY: -45 },
        { opacity: 1, x: 0, rotationY: 0, stagger: 0.08, duration: 0.6, ease: "back.out(1.2)" },
        "-=0.4"
      );

    } else {
      const tl = gsap.timeline({ onComplete: () => setIsVisible(false) });

      tl.to(".menu-item", {
        opacity: 0,
        x: 60,
        rotationY: 45,
        stagger: 0.04,
        duration: 0.4,
        ease: "power2.in",
      });

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

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "PlayStation", path: "/playstation" },
    { name: "Podcast", path: "/podcast" },
    { name: "Discover", path: "/discover" },
    { name: "Contact", path: "/contact" },
  ];

  // Theme styles
  const isDark = theme === 'light';
  const textColor = isDark ? 'text-white' : 'text-black';
  const bgColor = isDark ? 'bg-black/10' : 'bg-white/95';
  const borderColor = isDark ? 'border-white/10' : 'border-black/5';
  const hoverColor = isDark ? 'hover:text-amber-500' : 'hover:text-amber-600';

  return (
    <>
      <nav className={`w-full fixed top-0 left-0 z-50 ${bgColor} backdrop-blur-md border-b ${borderColor} transition-all duration-300`}>
        <div
          ref={navRef}
          className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-2.5 lg:py-3"
        >
          {/* Logo - Reduced Height with Enhanced Animation */}
          <Link to="/" className="flex-shrink-0">
            <img 
              ref={logoRef} 
              src={logo} 
              alt="JGPNR Logo" 
              className="h-12 sm:h-14 md:h-16 lg:h-16 xl:h-18 w-auto cursor-pointer drop-shadow-lg transition-transform hover:scale-105" 
              style={{ transformOrigin: 'center center' }}
            />
          </Link>

          {/* Desktop & Tablet Menu - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${textColor} text-xs lg:text-sm xl:text-base tracking-wider uppercase font-light ${hoverColor} transition-all duration-300 hover:tracking-widest relative group`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] ${isDark ? 'bg-amber-500' : 'bg-amber-600'} transition-all duration-300 group-hover:w-full`} />
              </Link>
            ))}
            
            {/* Instagram Icon - Desktop */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${textColor} ${hoverColor} transition-all duration-300 hover:scale-110 hover:rotate-12`}
            >
              <FaInstagram className="text-lg lg:text-xl xl:text-2xl" />
            </a>
          </div>

          {/* Right Side - Cart + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Icon - Responsive */}
            <Link to="/cart">
              <div className="relative group">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-md border-2 ${isDark ? 'border-white/20' : 'border-black/10'} flex items-center justify-center transition-all duration-300 ${isDark ? 'hover:bg-white/20 hover:border-white/40' : 'hover:bg-black/10 hover:border-black/20'} hover:scale-110`}>
                  <FaShoppingCart className={`${textColor} text-sm sm:text-base lg:text-lg`} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Hamburger Menu - Mobile/Tablet Only */}
            {isMobile && (
              <button
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all duration-300 focus:outline-none ${
                  !isOpen
                    ? `${isDark ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-black/5 border-black/10 hover:bg-black/10"}`
                    : "bg-amber-500 border-amber-600"
                }`}
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {!isOpen ? (
                  <Bars3BottomLeftIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${textColor}`} />
                ) : (
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isVisible && (
        <div 
          ref={menuRef} 
          className="fixed inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 z-40 md:hidden overflow-hidden"
        >
          {/* Animated Blobs */}
          <div className="menu-blob absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <svg className="w-[150%] h-[150%] absolute" viewBox="0 0 200 200" style={{ filter: "blur(40px)" }}>   
              <path 
                ref={blobRef}
                fill="#010101" 
                d="M42.3,-66.1C55.9,-57.2,68.5,-47.1,74.3,-34C80.2,-20.9,79.3,-4.8,73.1,7.7C67,20.3,55.7,29.4,45.9,38.5C36,47.6,27.7,56.8,16.9,62.2C6,67.6,-7.4,69.1,-18.7,65.1C-30,61.1,-39.2,51.6,-46.2,41.3C-53.2,31,-58,20,-58.1,9.3C-58.1,-1.4,-53.6,-11.9,-52.1,-27.4C-50.6,-42.9,-52.3,-63.5,-44.2,-74.8C-36,-86.1,-18,-88.2,-1.8,-85.4C14.4,-82.7,28.8,-75,42.3,-66.1Z" 
                transform="translate(100 100)" 
              />
            </svg>
          </div>

          {/* Menu Items - Mobile */}
          <ul className="absolute inset-0 flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-black z-10 px-4">
            {navItems.map((item) => (
              <li key={item.name} className="menu-item group">
                <Link to={item.path}>
                  <span className="text-lg sm:text-xl md:text-2xl font-light tracking-wide transition-all duration-300 group-hover:tracking-widest group-hover:text-white">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
            
            <li className="menu-item mt-4 sm:mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl sm:text-3xl cursor-pointer hover:scale-110 hover:rotate-12 transition-all duration-300" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}