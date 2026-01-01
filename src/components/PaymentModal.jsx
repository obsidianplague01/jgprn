// src/components/PaymentModal.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PaymentModal({ isOpen, status, message, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const tl = gsap.timeline();
      
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      .fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.2'
      );

      if (status === 'success') {
        gsap.to('.modal-icon', {
          rotation: 360,
          duration: 0.8,
          ease: 'back.out(1.5)',
          delay: 0.3,
        });

        gsap.to('.modal-icon', {
          y: -10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1,
        });
      } else if (status === 'error') {
        gsap.to('.modal-icon', {
          x: [-10, 10, -10, 10, 0],
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.3,
        });
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, status]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
    }, '-=0.1');
  };

  if (!isOpen) return null;

  const statusConfig = {
    success: {
      icon: (
        <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Payment Submitted!',
      borderColor: 'border-green-600',
      bgColor: 'bg-green-50',
    },
    error: {
      icon: (
        <svg className="w-16 h-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: 'Submission Failed',
      borderColor: 'border-red-600',
      bgColor: 'bg-red-50',
    },
    loading: {
      icon: (
        <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin" />
      ),
      title: 'Processing...',
      borderColor: 'border-black',
      bgColor: 'bg-gray-50',
    },
  };

  const config = statusConfig[status] || statusConfig.loading;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`relative max-w-md w-full mx-4 ${config.bgColor} border-4 ${config.borderColor} rounded-2xl p-8 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className={`modal-icon w-24 h-24 mx-auto mb-6 border-4 ${config.borderColor} rounded-full flex items-center justify-center ${config.bgColor}`}>
            {config.icon}
          </div>

          <h3 id="modal-title" className="text-2xl sm:text-3xl font-light tracking-wider uppercase mb-4">
            {config.title}
          </h3>

          <p className="text-sm sm:text-base text-black/70 mb-6 leading-relaxed">
            {message}
          </p>

          {status !== 'loading' && (
            <button
              onClick={handleClose}
              className="w-full bg-black text-white py-3 px-6 uppercase tracking-wider text-sm font-medium hover:bg-black/80 transition-colors duration-300"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}