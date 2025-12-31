import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FormInput from './forms/FormInput';

gsap.registerPlugin(ScrollTrigger);

const navigation = {
  support: [
    { name: "Contact Information", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Refund Policy", href: "#" },
    { name: "Contact Information", href: "/contact" }
  ],
};

function Footer({ theme = 'light' }) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);
  const socialIconRef = useRef(null);

  const isDark = theme === 'dark';

  // Theme-based colors
  const colors = {
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-white/70' : 'text-gray-600',
    border: isDark ? 'border-white/10' : 'border-gray-900/10',
    button: isDark ? 'bg-white text-black hover:bg-white/80' : 'bg-black text-white hover:bg-black/80',
    linkHover: isDark ? 'hover:text-amber-400' : 'hover:text-black',
    icon: isDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-black',
    successOverlay: isDark ? 'bg-gray-900/90' : 'bg-white/90',
    successBorder: isDark ? 'border-white' : 'border-black',
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations on scroll
      gsap.from('.footer-section', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        }
      });

      // Animated divider line
      gsap.from('.footer-divider', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer-divider',
          start: 'top 90%',
        }
      });

      // Stagger link animations
      gsap.from('.footer-link', {
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-links-section',
          start: 'top 85%',
        }
      });

      // Copyright text fade in
      gsap.from('.footer-copyright', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-copyright',
          start: 'top 90%',
        }
      });

      // Social icon rotation on scroll
      if (socialIconRef.current) {
        gsap.to(socialIconRef.current, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none',
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Button hover animations
  const handleButtonMouseEnter = () => {
    // Removed hover animations
  };

  const handleButtonMouseLeave = () => {
    // Removed hover animations
  };

  // Link hover animations - fade and slight scale
  const handleLinkMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      opacity: 0.7,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLinkMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Social icon hover
  const handleSocialMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.2,
      rotation: 15,
      duration: 0.4,
      ease: 'back.out(2)',
    });
  };

  const handleSocialMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      gsap.to('.newsletter-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
      });
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      gsap.to('.newsletter-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success animation sequence
      const tl = gsap.timeline({
        onComplete: () => {
          setSubscribed(true);
          setTimeout(() => {
            setSubscribed(false);
            setEmail('');
            setIsSubmitting(false);
          }, 3000);
        },
      });

      tl.to('.newsletter-form', {
        scaleX: 0.95,
        opacity: 0.7,
        duration: 0.3,
      })
      .to(buttonRef.current, {
        scale: 1.15,
        rotation: 5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      }, '-=0.2')
      .fromTo(
        '.success-indicator',
        {
          scale: 0,
          opacity: 0,
          rotation: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(2)',
        }
      );

    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setError('Failed to subscribe. Please try again.');
      setIsSubmitting(false);
      
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <footer ref={footerRef} className={`${colors.bg} ${colors.text} z-50 transition-colors duration-300 relative overflow-hidden`}>
      {/* Animated background particles for dark mode */}
      {isDark && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 relative z-10">
        
        {/* Main Grid - Super large mobile/tablet spacing between sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-24 sm:gap-y-28 md:gap-y-32 lg:gap-16 xl:gap-20">
          
          {/* Newsletter Section */}
          <div className="lg:col-span-7 space-y-6 relative footer-section">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em]">SIGN UP BELOW</h3>
            <p className={`text-sm ${colors.textSecondary} tracking-[0.05em] max-w-md`}>
              Get early access, exclusive products, codes and more....
            </p>
            
            {/* Newsletter Form */}
            <div className="newsletter-form mt-4 space-y-6 max-w-lg">
              <FormInput
                id="newsletter-email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                label="Email Address"
                placeholder="your.email@example.com"
                required={true}
                error={error}
                disabled={isSubmitting}
                showValidationIcon={true}
                isValid={validateEmail(email)}
                theme={theme}
              />
              
              <p className={`text-xs ${colors.textSecondary} tracking-[0.05em] leading-relaxed`}>
                By completing and sending your data, you agree to the Privacy policy. All data will be kept confidential. (* are required fields)
              </p>
              
              {/* Submit Button */}
              <div className="flex gap-4 items-center pt-2 relative">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`subscribe-btn px-8 py-2.5 ${colors.button} text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative z-10`}
                >
                  {isSubmitting ? 'SUBSCRIBING...' : subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
                </button>
                
                {subscribed && (
                  <div className="text-xs text-green-600 tracking-wider success-indicator flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmed
                  </div>
                )}
              </div>
            </div>
            
            {/* Success overlay */}
            {subscribed && (
              <div className={`absolute inset-0 flex items-center justify-center ${colors.successOverlay} z-10 rounded-lg backdrop-blur-sm`}>
                <div className="text-center success-indicator">
                  <div className={`w-16 h-16 border-2 ${colors.successBorder} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm uppercase tracking-[0.15em] font-semibold">Welcome to JGPNR</p>
                  <p className={`text-xs ${colors.textSecondary} mt-2`}>Thank you for subscribing!</p>
                </div>
              </div>
            )}
          </div>

          
          <div className="lg:col-span-5 space-y-6 footer-section footer-links-section mtImp">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em]">Need Help?</h3>
            <ul role="list" className="space-y-1">
              {navigation.support.map((item, index) => (
                <li key={index} className="footer-link">
                  <a
                    href={item.href}
                    onMouseEnter={handleLinkMouseEnter}
                    onMouseLeave={handleLinkMouseLeave}
                    className={`text-sm ${colors.textSecondary} ${colors.linkHover} transition-colors duration-300 block py-1 uppercase tracking-widest`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`footer-divider mt-12 sm:mt-16 border-t ${colors.border} pt-8 origin-left`} />

       
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className={`footer-copyright text-sm ${colors.textSecondary} sm:order-1 uppercase tracking-widest`}>
            &copy; {currentYear} JGPNR.NG. All rights reserved.
          </p>
          
          
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a 
              href="#" 
              onMouseEnter={handleSocialMouseEnter}
              onMouseLeave={handleSocialMouseLeave}
              className={`${colors.icon} transition-colors duration-300 relative`}
            >
              <span className="sr-only">Instagram</span>
              <svg ref={socialIconRef} className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              
              <span className={`absolute inset-0 ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;