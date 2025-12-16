import { useRef } from 'react';
import gsap from 'gsap';

/**
 * Editorial Fashion Button Component
 * Sharp edges, high contrast, intentional interactions
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {function} onClick - Click handler
 * @param {boolean} fullWidth - Expand to full width
 * @param {string} className - Additional classes
 */
export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick,
  fullWidth = false,
  className = '',
  disabled = false,
}) {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    gsap.to(buttonRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(buttonRef.current.querySelector('.button-bg'), {
      scaleX: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(buttonRef.current.querySelector('.button-bg'), {
      scaleX: 0,
      duration: 0.4,
      ease: 'power3.out',
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
        opacity: 0.5,
      });

      gsap.to(rippleRef.current, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // Button press animation
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    if (onClick) onClick(e);
  };

  // Variant styles
  const variants = {
    primary: 'bg-black text-white border-black hover:bg-white hover:text-black',
    secondary: 'bg-white text-black border-black hover:bg-black hover:text-white',
    outline: 'bg-transparent text-white border-white hover:bg-white hover:text-black',
  };

  // Size styles
  const sizes = {
    sm: 'px-6 py-2 text-sm tracking-[0.2em]',
    md: 'px-10 py-3 text-base tracking-[0.25em]',
    lg: 'px-16 py-4 text-lg tracking-[0.3em]',
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`
        relative overflow-hidden
        font-light uppercase
        border-2
        transition-colors duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{ borderRadius: 0 }} // Sharp edges enforced
    >
      {/* Animated background overlay */}
      <div
        className="button-bg absolute inset-0 origin-left"
        style={{
          transform: 'scaleX(0)',
          backgroundColor: variant === 'primary' ? 'white' : 'black',
          zIndex: 0,
        }}
      />

      {/* Ripple effect */}
      <div
        ref={rippleRef}
        className="absolute w-4 h-4 rounded-full pointer-events-none"
        style={{
          backgroundColor: variant === 'primary' ? 'white' : 'black',
          opacity: 0,
        }}
      />

      {/* Button text */}
      <span className="relative z-10 block">
        {children}
      </span>
    </button>
  );
}

/**
 * Button Group Component
 * For aligned button layouts
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