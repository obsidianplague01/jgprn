import { useRef } from 'react';
import gsap from 'gsap';

export default function FormInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  label,
  required = false,
  error = '',
  disabled = false,
  className = '',
  showValidationIcon = false,
  isValid = false,
  theme = 'light', // 'light' or 'dark'
}) {
  const labelRef = useRef(null);
  const underlineRef = useRef(null);

  const handleFocus = (e) => {
    // Animate label
    gsap.to(labelRef.current, {
      y: -30,
      scale: 0.85,
      color: theme === 'light' ? '#000' : '#fff',
      duration: 0.3,
      ease: 'power2.out',
    });

    // Animate underline
    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    if (!value) {
      gsap.to(labelRef.current, {
        y: 0,
        scale: 1,
        color: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    gsap.to(underlineRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (onBlur) onBlur(e);
  };

  const themeClasses = {
    light: {
      text: 'text-black',
      border: 'border-black/10',
      label: 'text-black/50',
      underline: 'bg-black',
    },
    dark: {
      text: 'text-white',
      border: 'border-white/20',
      label: 'text-white/50',
      underline: 'bg-white',
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`relative group ${className}`}>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full bg-transparent border-b-2 ${currentTheme.border} py-3 sm:py-4 px-0 text-base sm:text-lg ${currentTheme.text} outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        
      />
      
      <label
        ref={labelRef}
        htmlFor={id}
        className={`absolute left-0 top-3 sm:top-4 transition-all duration-300 pointer-events-none ${currentTheme.label} uppercase tracking-[0.15em] text-xs sm:text-sm origin-left`}
      >
        {label} {required && '*'}
      </label>

      {/* Active underline */}
      <div
        ref={underlineRef}
        className={`absolute bottom-0 left-0 w-full h-[2px] ${currentTheme.underline} origin-left`}
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>
      )}

      {/* Validation icon */}
      {showValidationIcon && isValid && !error && value && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Textarea variant
export function FormTextarea({
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  label,
  required = false,
  error = '',
  disabled = false,
  className = '',
  rows = 4,
  maxLength = 500,
  showCharCount = false,
  theme = 'light',
}) {
  const labelRef = useRef(null);
  const underlineRef = useRef(null);

  const handleFocus = (e) => {
    gsap.to(labelRef.current, {
      y: -30,
      scale: 0.85,
      color: theme === 'light' ? '#000' : '#fff',
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    if (!value) {
      gsap.to(labelRef.current, {
        y: 0,
        scale: 1,
        color: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    gsap.to(underlineRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (onBlur) onBlur(e);
  };

  const themeClasses = {
    light: {
      text: 'text-black',
      border: 'border-black/10',
      label: 'text-black/50',
      underline: 'bg-black',
    },
    dark: {
      text: 'text-white',
      border: 'border-white/20',
      label: 'text-white/50',
      underline: 'bg-white',
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`relative group ${className}`}>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full bg-transparent border-b-2 ${currentTheme.border} py-3 sm:py-4 px-0 text-base sm:text-lg ${currentTheme.text} outline-none resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        
      />
      
      <label
        ref={labelRef}
        htmlFor={id}
        className={`absolute left-0 top-3 sm:top-4 transition-all duration-300 pointer-events-none ${currentTheme.label} uppercase tracking-[0.15em] text-xs sm:text-sm origin-left`}
      >
        {label} {required && '*'}
      </label>

      <div
        ref={underlineRef}
        className={`absolute bottom-0 left-0 w-full h-[2px] ${currentTheme.underline} origin-left`}
        style={{ transform: 'scaleX(0)' }}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>
      )}

      {showCharCount && (
        <div className="absolute right-0 -bottom-6 text-[10px] sm:text-xs opacity-60 tracking-wider">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}