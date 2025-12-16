import { useRef, useState } from 'react';
import gsap from 'gsap';
import Button from './Button'; // Assuming Button component is in same directory

const navigation = {
  support: [
    { name: "Contact Information", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Refund Policy", href: "#" },
  ],
  company: [
    { name: "Home", href: "#" },
    { name: "Coming Soon", href: "#" },
    { name: "Play Station", href: "#" },
    { name: "Store", href: "#" },
  ],
  legal: [
    { name: "Terms of service", href: "#" },
    { name: "Privacy policy", href: "#" },
    { name: "Shipping Policy", href: "#" },
  ],
};

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const inputRef = useRef(null);
  const underlineRef = useRef(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFocus = () => {
    setFocused(true);
    if (underlineRef.current) {
      gsap.to(underlineRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
    
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (underlineRef.current && !email) {
      gsap.to(underlineRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
    
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    // Animation sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setSubscribed(true);
        setTimeout(() => {
          setSubscribed(false);
          setEmail('');
        }, 3000);
      },
    });

    // Input shrink
    tl.to(inputRef.current, {
      scaleX: 0.95,
      opacity: 0.7,
      duration: 0.3,
    })
    // Button animation
    .to('.subscribe-btn', {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    }, '-=0.2')
    // Success indicator
    .fromTo(
      '.success-indicator',
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
      }
    );
  };

  return (
    <footer className="bg-white text-gray-900 z-50">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
        
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              <div className="space-y-6">
                <h3 className="text-sm/6 font-semibold uppercase tracking-[0.15em]">Need Help?</h3>
                <ul role="list" className="space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-600 hover:text-black transition-colors duration-300 block py-1 uppercase tracking-[0.1em]"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-6 mt-6 md:mt-0">
                <h3 className="text-sm/6 font-semibold uppercase tracking-[0.15em]">JGPNR.NG</h3>
                <ul role="list" className="space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-600 hover:text-black transition-colors duration-300 block py-1 uppercase tracking-[0.1em]"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 mt-6 md:mt-0">
                <h3 className="text-sm/6 font-semibold uppercase tracking-[0.15em]">Legal</h3>
                <ul role="list" className="space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-600 hover:text-black transition-colors duration-300 block py-1 uppercase tracking-[0.1em]"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-10 xl:mt-0 space-y-6 relative">
            <h3 className="text-sm/6 font-semibold uppercase tracking-[0.15em]">SIGN UP BELOW</h3>
            <p className="text-sm/6 text-gray-600 tracking-[0.05em]">
              Get early access, exclusive products, codes and more....
            </p>
            
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  id="email-address"
                  name="email-address"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="EMAIL ADDRESS *"
                  autoComplete="email"
                  className="w-full bg-transparent py-3 px-0 text-sm uppercase tracking-[0.15em] outline-none transition-all duration-300 placeholder:text-gray-400 focus:placeholder:text-transparent"
                  style={{ borderRadius: 0 }}
                />
                
                {/* Animated Underline */}
                <div
                  ref={underlineRef}
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-left"
                  style={{ transform: 'scaleX(0)' }}
                />
                
                {/* Static bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300" />
                
                {/* Email validation indicator */}
                {email.includes('@') && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 success-indicator">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Typing indicator */}
                {focused && email && (
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex gap-1">
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
              
              {/* Submit Button - Using your Button component */}
              <div className="flex gap-4 items-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="subscribe-btn flex-1 uppercase"
                >
                  {subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
                </Button>
                
                {/* Success message */}
                {subscribed && (
                  <div className="text-xs text-green-600 tracking-wider animate-fadeIn">
                    ✓ Confirmed
                  </div>
                )}
              </div>
            </form>
            
            {/* Success animation overlay */}
            {subscribed && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-[0.15em]">Welcome to JGPNR</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Social + Copyright */}
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <p className="mt-8 text-sm/6 text-gray-600 md:order-1 md:mt-0 uppercase tracking-[0.1em]">
            &copy; {currentYear} JGPNR.NG. All rights reserved.
          </p>
          
          {/* Optional: Add social links here */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-black transition-colors duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </footer>
  );
}

export default Footer;