import { useState, useEffect, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const buttonRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Show button after scrolling 500px
      if (scrolled > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress for circular indicator
      const progress = scrolled / (docHeight - winHeight);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Check initial state

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Floating animation when button is visible
  useEffect(() => {
    if (isVisible && buttonRef.current) {
      // Kill any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Create new floating animation
      animationRef.current = gsap.to(buttonRef.current, {
        y: -12,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    } else if (animationRef.current) {
      // Kill animation when button is hidden
      animationRef.current.kill();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isVisible]);

  const scrollToTop = () => {
    // Add click animation
    gsap.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Alternative GSAP scroll (if ScrollToPlugin is available)
    // gsap.to(window, {
    //   duration: 1.5,
    //   scrollTo: { y: 0 },
    //   ease: 'power3.inOut',
    // });
  };

  // Calculate stroke offset for progress circle
  const circumference = 2 * Math.PI * 26;
  const strokeOffset = circumference * (1 - scrollProgress);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          ref={buttonRef}
          className="fixed bottom-8 right-8 z-50 group cursor-pointer"
          aria-label="Scroll to top"
          style={{ willChange: 'transform' }}
        >
          {/* Button Container */}
          <div className="relative">
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main Button */}
            <div className="relative w-16 h-16 flex items-center justify-center bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-full transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/50 group-hover:scale-110">
              <FaArrowUp 
                className="text-white text-xl transition-transform duration-300 group-hover:-translate-y-1" 
              />
            </div>

            {/* Circular Progress Indicator */}
            <svg
              className="absolute inset-0 w-16 h-16 -rotate-90 pointer-events-none"
            >
              
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="white"
                strokeWidth="2"
                fill="none"
                className="opacity-90 transition-all duration-150"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeOffset,
                  strokeLinecap: 'round'
                }}
              />
            </svg>
          </div>

          {/* Tooltip */}
          <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-white/20 pointer-events-none">
            Back to top
            <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-black/90"></span>
          </span>
        </button>
      )}
    </>
  );
}