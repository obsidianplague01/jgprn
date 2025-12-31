// src/components/contact/ContactForm.jsx
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FormInput, { FormTextarea } from '../forms/FormInput';
import Button from '../Button';
import { submitContactForm } from '../../utils/api';
import { sanitizeFormData, isValidFormData } from '../../utils/sanitize';
import { checkRateLimit, formRateLimiter } from '../../utils/rateLimiter';
import { logFormSubmission } from '../../utils/logger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 100 },
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

      gsap.fromTo(
        '.form-field',
        { opacity: 0, x: -30 },
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

      gsap.fromTo(
        '.header-word',
        { opacity: 0, y: 50, rotateX: -90 },
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
      return;
    }

    try {
      checkRateLimit(formRateLimiter, 'contact', 3);
    } catch (rateLimitError) {
      setSubmitError(rateLimitError.message);
      return;
    }

    const sanitized = sanitizeFormData(formData);
    
    if (!isValidFormData(sanitized)) {
      setSubmitError('Invalid form data. Please check your inputs.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactForm(sanitized);

      logFormSubmission('contact', true, { email: sanitized.email });

      const inputs = formRef.current.querySelectorAll('input, textarea, button');
      inputs.forEach(input => input.disabled = true);

      const tl = gsap.timeline({
        onComplete: () => {
          setSubmitted(true);
          
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
                inputs.forEach(input => input.disabled = false);
                setIsSubmitting(false);
              },
            });
          }, 4000);
        },
      });

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
      .fromTo(
        '.success-message',
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(2)',
        }
      )
      .to('.success-particle', {
        y: -100,
        x: (i) => (i % 2 === 0 ? -50 : 50),
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.5');

    } catch (apiError) {
      console.error('Contact form submission failed:', apiError);
      setSubmitError(apiError.message || 'Failed to send message. Please try again.');
      setIsSubmitting(false);

      logFormSubmission('contact', false, { 
        email: formData.email, 
        error: apiError.message 
      });

      gsap.from('.submit-error', {
        opacity: 0,
        y: -10,
        duration: 0.3,
      });

      setTimeout(() => setSubmitError(null), 5000);
    }
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-12 py-20 sm:py-24 pt-32 sm:pt-36 overflow-hidden"
      >
        
        <div
          ref={cursorRef}
          className="hidden lg:block fixed w-8 h-8 border-2 border-black rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
          }}
        />

        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-12 sm:mb-16" style={{ perspective: '1000px' }}>
            <div className="overflow-hidden mb-4 sm:mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase">
                {['Get', 'in', 'Touch'].map((word, i) => (
                  <span
                    key={i}
                    className="header-word inline-block mr-3 sm:mr-4"
                    style={{ transformOrigin: '50% 50% -50px' }}
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base tracking-[0.15em] opacity-60 uppercase">
              Let's create something together
            </p>
            
            <div className="w-20 sm:w-24 h-px bg-black mx-auto mt-4 sm:mt-6 origin-center">
              <div className="h-full bg-black animate-pulse" />
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 relative">
            
            {submitError && (
              <div className="submit-error bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4 text-red-600 text-sm text-center">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                label="First Name"
                placeholder="John"
                required={true}
                error={errors.firstName}
                disabled={isSubmitting}
                className="form-field"
                theme="light"
              />

              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                label="Last Name"
                placeholder="Doe"
                required={true}
                error={errors.lastName}
                disabled={isSubmitting}
                className="form-field"
                theme="light"
              />
            </div>

            <FormInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              placeholder="you@example.com"
              required={true}
              error={errors.email}
              disabled={isSubmitting}
              className="form-field"
              showValidationIcon={true}
              isValid={validateEmail(formData.email)}
              theme="light"
            />

            <FormTextarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              label="Message"
              placeholder="Tell us about your project..."
              required={true}
              error={errors.message}
              disabled={isSubmitting}
              className="form-field"
              rows={6}
              maxLength={500}
              showCharCount={true}
              theme="light"
            />

            <div className="pt-6 sm:pt-8">
              {!submitted ? (
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              ) : (
                <div className="success-message text-center py-10 sm:py-12 relative">
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
                  
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 border-2 border-black rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <p className="text-xl sm:text-2xl tracking-[0.15em] uppercase font-light mb-2">
                    Message Sent
                  </p>
                  <p className="text-xs sm:text-sm opacity-60 tracking-wider">
                    We'll be in touch soon
                  </p>
                </div>
              )}
            </div>
          </form>

          <div className="mt-16 sm:mt-20 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
        </div>
      </section>
    </>
  );
}