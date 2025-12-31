// src/pages/PaymentSuccessPage.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const checkmarkRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: 'back.out(1.5)',
    })
    .from(checkmarkRef.current, {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    }, '-=0.3')
    .from('.success-text', {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4');

    gsap.to(checkmarkRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <>
      <Navbar theme="dark" />
      
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24">
        <div ref={containerRef} className="max-w-2xl w-full text-center py-12">
          
          <div 
            ref={checkmarkRef}
            className="w-32 h-32 mx-auto mb-8 border-4 border-green-600 rounded-full flex items-center justify-center"
          >
            <svg 
              className="w-16 h-16 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          <h1 className="success-text text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tighter text-black uppercase mb-6">
            Payment Submitted
          </h1>

          <p className="success-text text-lg sm:text-xl text-black/70 mb-4">
            Thank you for your payment!
          </p>

          <p className="success-text text-sm sm:text-base text-black/60 mb-12 max-w-lg mx-auto">
            Your payment receipt has been received and is being processed. 
            Our team will contact you shortly via email or WhatsApp to confirm your tickets.
          </p>

          <div className="success-text flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/playstation')}
            >
              Buy More Tickets
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-xs text-black/50 uppercase tracking-wider mb-2">
              Need Help?
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="text-sm text-black/70 hover:text-black transition-colors duration-300 uppercase tracking-wider"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}