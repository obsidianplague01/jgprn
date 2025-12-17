import { useRef } from 'react';
import gsap from 'gsap';

/**
 * Sharp-edged Button with Premium Interactions
 * Inspired by Apple's micro-interaction design
 */
export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick,
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
}) {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    // Subtle scale on hover
    gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Glow effect
    gsap.to(glowRef.current, {
      opacity: 1,
      scale: 1.1,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Background slide
    gsap.to(buttonRef.current.querySelector('.button-bg'), {
      scaleX: 1,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(buttonRef.current.querySelector('.button-bg'), {
      scaleX: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  const handleMouseMove = (e) => {
    if (disabled) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Subtle tilt effect (Apple style)
    const xPercent = (x / rect.width - 0.5) * 10;
    const yPercent = (y / rect.height - 0.5) * 10;

    gsap.to(button, {
      rotationY: xPercent,
      rotationX: -yPercent,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeaveReset = () => {
    if (disabled) return;

    gsap.to(buttonRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleClick = (e) => {
    if (disabled) return;

    // Ripple effect
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rippleRef.current) {
      gsap.set(rippleRef.current, {
        left: x,
        top: y,
        scale: 0,
        opacity: 0.6,
      });

      gsap.to(rippleRef.current, {
        scale: 5,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // Press animation
    gsap.to(button, {
      scale: 0.97,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    if (onClick) onClick(e);
  };

  // Variant styles
  const variants = {
    primary: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-black',
      hoverBg: 'bg-white',
      hoverText: 'text-black',
      glow: 'bg-gray-400',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-black',
      hoverBg: 'bg-black',
      hoverText: 'text-white',
      glow: 'bg-gray-600',
    },
    accent: {
      bg: 'bg-amber-500',
      text: 'text-black',
      border: 'border-amber-600',
      hoverBg: 'bg-amber-600',
      hoverText: 'text-white',
      glow: 'bg-amber-300',
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-white',
      border: 'border-white',
      hoverBg: 'bg-white',
      hoverText: 'text-black',
      glow: 'bg-white',
    },
  };

  const variantStyles = variants[variant];

  // Size styles
  const sizes = {
    sm: 'px-6 py-2.5 text-xs tracking-[0.2em]',
    md: 'px-10 py-3.5 text-sm tracking-[0.25em]',
    lg: 'px-14 py-4 text-base tracking-[0.3em]',
    xl: 'px-20 py-5 text-lg tracking-[0.35em]',
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={(e) => {
        handleMouseLeave();
        handleMouseLeaveReset();
      }}
      onMouseMove={handleMouseMove}
      disabled={disabled}
      className={`
        relative overflow-hidden
        font-medium uppercase
        border-2
        transition-colors duration-300
        ${variantStyles.bg}
        ${variantStyles.text}
        ${variantStyles.border}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{ 
        borderRadius: 0,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className={`absolute -inset-1 ${variantStyles.glow} opacity-0 blur-xl -z-10`}
      />

      {/* Animated background overlay */}
      <div
        className="button-bg absolute inset-0 origin-left z-0"
        style={{
          transform: 'scaleX(0)',
          backgroundColor: variant === 'primary' ? 'white' : variant === 'secondary' ? 'black' : variant === 'accent' ? '#d97706' : 'white',
        }}
      />

      {/* Ripple effect */}
      <div
        ref={rippleRef}
        className="absolute w-4 h-4 rounded-full pointer-events-none z-10"
        style={{
          backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
          opacity: 0,
        }}
      />

      {/* Button text with smooth color transition */}
      <span className={`relative z-20 block transition-colors duration-300`}>
        {children}
      </span>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <div className="shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      </div>
    </button>
  );
}

/**
 * Button Group Component
 */
export function ButtonGroup({ children, align = 'center', gap = '4', className = '' }) {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex flex-wrap ${alignments[align]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}