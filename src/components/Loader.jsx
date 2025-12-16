import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onLoadComplete }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out loader
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            if (onLoadComplete) onLoadComplete();
          },
        });
      },
    });

    // Animate text letters with stagger
    tl.fromTo(
      textRef.current.children,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      }
    );

    // Progress bar animation
    const progressTl = gsap.timeline();
    progressTl.to(progressRef.current, {
      scaleX: 1,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: function () {
        setProgress(Math.round(this.progress() * 100));
      },
    });

    // Add slight delay before fade out
    tl.add(() => {}, '+=0.5');

    return () => {
      tl.kill();
      progressTl.kill();
    };
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Animated Text */}
      <div
        ref={textRef}
        className="flex gap-1 mb-12 text-5xl md:text-7xl font-light tracking-[0.3em] text-white heading-text"
        style={{ perspective: '1000px' }}
      >
        {'JGPNR.NG'.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{ transformOrigin: '50% 50% -50px' }}
          >
            {char === '.' ? '.' : char}
          </span>
        ))}
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 md:w-96 relative">
        {/* Background Bar */}
        <div className="h-[2px] bg-white/20 rounded-full overflow-hidden">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="h-full bg-white origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="text-white/60 text-sm mt-3 text-center font-light tracking-widest">
          {progress}%
        </div>
      </div>

      {/* Film Grain Effect */}
      <div className="film-grain" />
    </div>
  );
}