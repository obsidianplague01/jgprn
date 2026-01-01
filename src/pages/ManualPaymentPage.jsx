// src/pages/ManualPaymentPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import PaymentModal from '../components/PaymentModal';
import { useCart } from '../context/CartContext';
import { submitPayment } from '../utils/api';
import { logPaymentEvent } from '../utils/logger';



const BANK_DETAILS = {
  bankName: 'Access Bank',
  accountName: 'Clement Omachi',
  accountNumber: '0769091903'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

export default function ManualPaymentPage() {
  const navigate = useNavigate();
  const { cartItems, grandTotal, clearCart } = useCart();
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [error, setError] = useState(null);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: 'loading',
    message: '',
  });

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/playstation');
      return;
    }

    window.scrollTo(0, 0);

    gsap.from('.payment-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, [cartItems, navigate]);

  const validateFile = (file) => {
    if (!file) {
      return 'Please select a receipt file';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setReceipt(null);
      setReceiptPreview(null);
      return;
    }

    setError(null);
    setReceipt(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }

    gsap.from('.receipt-preview', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
    });
  };

  const formatOrderSummary = () => {
    const totalTickets = cartItems.reduce((sum, item) => sum + item.tickets, 0);
    
    return `
=== JGPNR PAYMENT NOTIFICATION ===

ORDER SUMMARY:
Total Tickets: ${totalTickets}
Grand Total: ₦${grandTotal.toLocaleString()}

CUSTOMER DETAILS:
${cartItems.map((item, i) => `
Ticket ${i + 1}:
  Name: ${item.firstName} ${item.lastName}
  Email: ${item.email}
  Phone: ${item.phone}
  Location: ${item.location}
  WhatsApp: ${item.whatsapp}
  Tickets: ${item.tickets}
  Amount: ₦${item.totalPrice.toLocaleString()}
`).join('\n')}

BANK TRANSFER DETAILS:
Bank: ${BANK_DETAILS.bankName}
Account: ${BANK_DETAILS.accountName}
Number: ${BANK_DETAILS.accountNumber}

Receipt attached.
    `.trim();
  };

  const handleSubmitPayment = async () => {
    if (!receipt) {
      setError('Please upload your payment receipt');
      gsap.to(fileInputRef.current?.closest('.upload-section'), {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
      });
      return;
    }

    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Processing your payment submission...',
    });

    setError(null);

    try {
      const paymentData = {
        receipt,
        orderDetails: cartItems,
        grandTotal,
        summary: formatOrderSummary(),
      };

      await submitPayment(paymentData);

      logPaymentEvent('payment_submitted', {
        totalAmount: grandTotal,
        itemCount: cartItems.length,
      });

      setModalState({
        isOpen: true,
        status: 'success',
        message: 'Your payment has been submitted successfully! Our team will contact you shortly via email or WhatsApp to confirm your tickets.',
      });

      setTimeout(() => {
        clearCart();
        navigate('/payment-success');
      }, 3000);

    } catch (apiError) {
      console.error('Payment submission error:', apiError);
      
      logPaymentEvent('payment_failed', {
        totalAmount: grandTotal,
        error: apiError.message,
      });

      setModalState({
        isOpen: true,
        status: 'error',
        message: apiError.message || 'Failed to submit payment. Please try again or contact support.',
      });
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector(`[data-copy="${label}"]`);
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        
        gsap.fromTo(btn, 
          { scale: 1.2, backgroundColor: '#10b981' },
          { scale: 1, backgroundColor: '', duration: 0.3 }
        );

        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    });
  };

  const handleModalClose = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Navbar theme="dark" />
      
      <PaymentModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        message={modalState.message}
        onClose={handleModalClose}
      />

      <div className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-32">
        <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tighter text-black uppercase mb-3 sm:mb-4">
              Complete Payment
            </h1>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-black/60">
              Transfer to Bank Account
            </p>
          </div>

          {error && (
            <div className="error-message bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4 mb-6 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="payment-card bg-linear-to-br from-black to-gray-900 text-white rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-light mb-6 uppercase tracking-wider">Bank Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-white/70 text-sm uppercase tracking-wider">Bank Name</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-light">{BANK_DETAILS.bankName}</span>
                    <button
                      onClick={() => copyToClipboard(BANK_DETAILS.bankName, 'bank')}
                      data-copy="bank"
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-white/70 text-sm uppercase tracking-wider">Account Name</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-light">{BANK_DETAILS.accountName}</span>
                    <button
                      onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'name')}
                      data-copy="name"
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-white/70 text-sm uppercase tracking-wider">Account Number</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-light tracking-wider">{BANK_DETAILS.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'number')}
                      data-copy="number"
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-white/70 text-sm uppercase tracking-wider">Amount</span>
                  <span className="text-3xl font-light text-amber-500">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="payment-card bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 upload-section">
              <h2 className="text-xl sm:text-2xl font-light mb-6 uppercase tracking-wider">Upload Receipt</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="cursor-pointer block"
                  >
                    <div className="mx-auto w-16 h-16 mb-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {receipt ? receipt.name : 'Click to upload receipt'}
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG, or PDF (Max 5MB)</p>
                  </label>
                </div>

                {receiptPreview && (
                  <div className="receipt-preview">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-full max-h-64 object-contain border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="payment-card">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmitPayment}
                disabled={!receipt || modalState.isOpen}
              >
                {modalState.isOpen ? 'Processing...' : 'Submit Payment'}
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/cart')}
                disabled={modalState.isOpen}
                className="text-sm text-black/60 hover:text-black uppercase tracking-wider transition-colors duration-300 disabled:opacity-50"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}