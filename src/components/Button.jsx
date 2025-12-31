// src/components/Button.jsx
import { useRef } from 'react';
import gsap from 'gsap';

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
    
    gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(glowRef.current, {
      opacity: 1,
      scale: 1.1,
      duration: 0.4,
      ease: 'power2.out',
    });

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

    gsap.to(button, {
      scale: 0.97,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    if (onClick) onClick(e);
  };

  const variants = {
    primary: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-black',
      hoverBg: 'bg-gray-800',
      hoverText: 'text-white',
      glow: 'bg-gray-400',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-black',
      hoverBg: 'bg-gray-100',
      hoverText: 'text-black',
      glow: 'bg-gray-300',
    },
    accent: {
      bg: 'bg-amber-500',
      text: 'text-black',
      border: 'border-amber-600',
      hoverBg: 'bg-amber-600',
      hoverText: 'text-black',
      glow: 'bg-amber-300',
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-black',
      border: 'border-black',
      hoverBg: 'bg-black',
      hoverText: 'text-white',
      glow: 'bg-black',
    },
  };

  const variantStyles = variants[variant];

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
        group
        ${className}
      `}
      style={{ 
        borderRadius: 0,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        ref={glowRef}
        className={`absolute -inset-1 ${variantStyles.glow} opacity-0 blur-xl -z-10`}
      />

      <div
        className={`button-bg absolute inset-0 origin-left z-0 ${variantStyles.hoverBg}`}
        style={{ transform: 'scaleX(0)' }}
      />

      <div
        ref={rippleRef}
        className="absolute w-4 h-4 rounded-full pointer-events-none z-10 bg-white/30"
        style={{ opacity: 0 }}
      />

      <span className={`relative z-20 block transition-colors duration-300 group-hover:${variantStyles.hoverText}`}>
        {children}
      </span>

      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <div className="shine absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      </div>
    </button>
  );
}

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