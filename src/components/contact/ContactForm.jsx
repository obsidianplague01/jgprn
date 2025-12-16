import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../Button';

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered reveal animation
      gsap.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );

      // Stagger input fields
      gsap.fromTo(
        '.form-field',
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
          },
        }
      );

      // Header text split animation
      gsap.fromTo(
        '.header-word',
        {
          opacity: 0,
          y: 50,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Custom cursor for form area
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cursorRef.current) return;
      
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const formArea = formRef.current;
    if (formArea) {
      formArea.addEventListener('mousemove', handleMouseMove);
      
      formArea.addEventListener('mouseenter', () => {
        gsap.to(cursorRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
        });
      });

      formArea.addEventListener('mouseleave', () => {
        gsap.to(cursorRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
        });
      });

      return () => {
        formArea.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    
    // Animate label on focus
    gsap.to(`.label-${field}`, {
      y: -30,
      scale: 0.85,
      color: '#000',
      duration: 0.3,
      ease: 'power2.out',
    });

    // Animate underline on focus
    gsap.to(`.underline-${field}`, {
      scaleX: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      gsap.to(`.label-${field}`, {
        y: 0,
        scale: 1,
        color: 'rgba(0, 0, 0, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    setFocusedField(null);
    
    gsap.to(`.underline-${field}`, {
      scaleX: 0,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Disable form temporarily
    const inputs = formRef.current.querySelectorAll('input, textarea, button');
    inputs.forEach(input => input.disabled = true);

    // Success animation sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setSubmitted(true);
        
        // Reset after 4 seconds
        setTimeout(() => {
          gsap.to('.success-message', {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
              setSubmitted(false);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                message: '',
              });
              setCharCount(0);
              inputs.forEach(input => input.disabled = false);
            },
          });
        }, 4000);
      },
    });

    // Form collapse animation
    tl.to('.form-field', {
      opacity: 0,
      x: -50,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.in',
    })
    .to(formRef.current, {
      scale: 0.95,
      duration: 0.3,
    }, '-=0.2')
    // Success message entrance
    .fromTo(
      '.success-message',
      {
        opacity: 0,
        scale: 0.8,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(2)',
      }
    )
    // Confetti-like particles
    .to('.success-particle', {
      y: -100,
      x: (i) => (i % 2 === 0 ? -50 : 50),
      opacity: 0,
      stagger: 0.05,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.5');
  };

  return (
    <section
      ref={containerRef}
      className="relative mt-7 min-h-screen flex items-center justify-center px-6 md:px-12 py-20 overflow-hidden"
    >
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-black rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
        }}
      />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          
        />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16" style={{ perspective: '1000px' }}>
          <div className="overflow-hidden">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4">
              {['Get', 'in', 'Touch'].map((word, i) => (
                <span
                  key={i}
                  className="header-word inline-block mr-4"
                  style={{ transformOrigin: '50% 50% -50px' }}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>
          <p className="text-sm md:text-base tracking-[0.15em] opacity-60 uppercase">
            Let's create something together
          </p>
          
          {/* Decorative Line Animation */}
          <div className="w-24 h-[1px] bg-black mx-auto mt-6 origin-center">
            <div className="h-full bg-black animate-pulse" />
          </div>
        </div>

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 relative">
          
          {/* First Name & Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* First Name */}
            <div className="form-field relative group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onFocus={() => handleFocus('firstName')}
                onBlur={() => handleBlur('firstName')}
                required
                className="w-full bg-transparent border-b-2 border-black/10 py-4 px-0 text-lg outline-none transition-all duration-300"
              />
              <label
                className={`label-firstName absolute left-0 top-4 transition-all duration-300 pointer-events-none text-black/50 uppercase tracking-[0.15em] text-sm origin-left`}
              >
                First Name
              </label>
              {/* Active underline */}
              <div
                className={`underline-firstName absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left`}
                style={{ transform: 'scaleX(0)' }}
              />
              {/* Typing indicator dots */}
              {focusedField === 'firstName' && formData.firstName && (
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="form-field relative group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onFocus={() => handleFocus('lastName')}
                onBlur={() => handleBlur('lastName')}
                required
                className="w-full bg-transparent border-b-2 border-black/10 py-4 px-0 text-lg outline-none transition-all duration-300"
              />
              <label
                className={`label-lastName absolute left-0 top-4 transition-all duration-300 pointer-events-none text-black/50 uppercase tracking-[0.15em] text-sm origin-left`}
              >
                Last Name
              </label>
              <div
                className={`underline-lastName absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left`}
                style={{ transform: 'scaleX(0)' }}
              />
              {focusedField === 'lastName' && formData.lastName && (
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-field relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              required
              className="w-full bg-transparent border-b-2 border-black/10 py-4 px-0 text-lg outline-none transition-all duration-300"
            />
            <label
              className={`label-email absolute left-0 top-4 transition-all duration-300 pointer-events-none text-black/50 uppercase tracking-[0.15em] text-sm origin-left`}
            >
              Email
            </label>
            <div
              className={`underline-email absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left`}
              style={{ transform: 'scaleX(0)' }}
            />
            {/* Email validation indicator */}
            {formData.email && formData.email.includes('@') && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="form-field relative group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus('message')}
              onBlur={() => handleBlur('message')}
              required
              rows="6"
              maxLength="500"
              className="w-full bg-transparent border-b-2 border-black/10 py-4 px-0 text-lg outline-none resize-none transition-all duration-300"
            />
            <label
              className={`label-message absolute left-0 top-4 transition-all duration-300 pointer-events-none text-black/50 uppercase tracking-[0.15em] text-sm origin-left`}
            >
              Message
            </label>
            <div
              className={`underline-message absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left`}
              style={{ transform: 'scaleX(0)' }}
            />
            {/* Character counter */}
            {focusedField === 'message' && (
              <div className="absolute right-0 -bottom-6 text-xs opacity-60 tracking-wider">
                {charCount}/500
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            {!submitted ? (
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Send Message
              </Button>
            ) : (
              <div className="success-message text-center py-12 relative">
                {/* Success particles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="success-particle absolute w-2 h-2 bg-black rounded-full"
                    style={{
                      left: `${50 + (i % 2 === 0 ? -10 : 10) * (i + 1)}%`,
                      top: '50%',
                    }}
                  />
                ))}
                
                {/* Success icon */}
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <p className="text-2xl tracking-[0.15em] uppercase font-light mb-2">
                  Message Sent
                </p>
                <p className="text-sm opacity-60 tracking-wider">
                  We'll be in touch soon
                </p>
              </div>
            )}
          </div>
        </form>

      </div>
    </section>
  );
}