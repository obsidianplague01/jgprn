import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Footer from '../components/Footer';

export default function ComingSoon({ pageName = "This Page" }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Entrance animations
      tl.from(titleRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.9,
        duration: 1.2,
        ease: 'power4.out',
      })
      .from(titleRef.current.querySelectorAll('.word'), {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.5)',
      }, '-=0.8')
      .from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.5')
      .from(buttonRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'back.out(2)',
      }, '-=0.4');

      

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split text into words
  const splitIntoWords = (text) => {
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="word inline-block mr-3 md:mr-4"
        style={{ transformStyle: "preserve-3d" }}
      >
        {word}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-32">
        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="text-[12vw] md:text-[8vw] lg:text-[6vw] font-extralight tracking-tighter leading-[0.9] text-white text-center uppercase mb-8"
          style={{ perspective: "1000px" }}
        >
          {splitIntoWords("Coming Soon")}
        </h1>

        {/* Subtitle */}
        <div ref={subtitleRef} className="text-center max-w-2xl mb-12">
          <p className="text-lg md:text-xl text-white/70 font-light tracking-wide mb-4">
            {pageName} is currently under construction
          </p>
          <p className="text-sm md:text-base text-white/50 tracking-[0.2em] uppercase">
            We're crafting something extraordinary
          </p>
        </div>

        {/* Decorative Line */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mb-12" />

        {/* Call to Action Button */}
        <Link to="/" ref={buttonRef}>
          <button className="group relative px-12 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white uppercase tracking-[0.3em] text-sm font-light transition-all duration-500 hover:bg-white hover:text-black hover:border-white overflow-hidden">
            {/* Button background animation */}
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            
            {/* Button text */}
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </span>
          </button>
        </Link>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-xs text-white/40 tracking-[0.2em] uppercase">
            Stay tuned for updates
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}