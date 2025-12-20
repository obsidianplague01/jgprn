import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContex';

export default function CheckoutPage() {
  const { cartItems, grandTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cartRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Entrance animations
    if (cartItems.length > 0) {
      gsap.from('.cart-item', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    gsap.from('.checkout-summary', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5,
    });
  }, [cartItems.length]);

  const handleRemoveItem = (itemId, index) => {
    // Animate out the item
    gsap.to(`.cart-item-${index}`, {
      x: 100,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        removeFromCart(itemId);
      }
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity, index) => {
    if (newQuantity < 1 || newQuantity > 20) return;

    updateQuantity(itemId, newQuantity);

    // Animate quantity change
    gsap.fromTo(
      `.quantity-${index}`,
      { scale: 1.3, color: '#f59e0b' },
      { scale: 1, color: '#000', duration: 0.4, ease: 'back.out(2)' }
    );
  };

  // Payment Integration - Paystack for Nigerian Market
  const initializePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Get first customer's email (all items should have same email in real scenario)
      const customerEmail = cartItems[0]?.email || '';
      
      // In production, this would call your backend API
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: grandTotal * 100, // Paystack expects amount in kobo
          metadata: {
            cart_items: cartItems.map(item => ({
              name: `${item.firstName} ${item.lastName}`,
              tickets: item.tickets,
              price: item.ticketPrice,
            })),
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: `${cartItems[0]?.firstName} ${cartItems[0]?.lastName}`
              }
            ]
          },
          callback_url: `${window.location.origin}/payment-success`,
          channels: ['card', 'bank', 'ussd', 'mobile_money']
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await response.json();
      
      // Redirect to Paystack payment page
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setPaymentError('Failed to process payment. Please try again.');
      setIsProcessing(false);
      
      // Show error animation
      gsap.from('.payment-error', {
        opacity: 0,
        y: -10,
        duration: 0.3
      });
      
      setTimeout(() => setPaymentError(null), 5000);
    }
  };

  const handleCheckout = () => {
    // Success animation
    gsap.to(cartRef.current, {
      scale: 0.98,
      opacity: 0.7,
      duration: 0.3,
      onComplete: () => {
        // For development/testing - replace with initializePayment() in production
        if (process.env.NODE_ENV === 'production') {
          initializePayment();
        } else {
          // Development mode - simulate payment
          setTimeout(() => {
            alert('Demo Mode: Payment would be processed via Paystack in production');
            clearCart();
            navigate('/');
          }, 1000);
        }
      }
    });
  };

  return (
    <>
      <Navbar theme="dark" />
      
      <div className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-32">
        <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tighter text-black uppercase mb-3 sm:mb-4">
              Checkout
            </h1>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-black/60">
              Review Your Order
            </p>
          </div>

          {/* Payment Error Message */}
          {paymentError && (
            <div className="payment-error bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4 mb-6 text-red-600 text-sm text-center">
              {paymentError}
            </div>
          )}

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-16 sm:py-20">
              <div className="mb-6 sm:mb-8">
                <FaShoppingCart className="text-6xl sm:text-7xl text-black/20 mx-auto" />
              </div>
              <p className="text-lg sm:text-xl text-black/60 mb-8 sm:mb-12">Your cart is empty</p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/playstation')}
              >
                Buy Tickets
              </Button>
            </div>
          ) : (
            <div ref={cartRef}>
              {/* Cart Items */}
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                {cartItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`cart-item cart-item-${index} bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-gray-300 transition-all duration-300 shadow-sm`}
                  >
                    {/* Item Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl text-black font-light mb-1 sm:mb-2">PlayStation Ticket</h3>
                        <p className="text-xs sm:text-sm text-black/60">
                          ₦{item.ticketPrice.toLocaleString()} per ticket
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, index)}
                        disabled={isProcessing}
                        className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Remove item"
                      >
                        <FaTrash className="text-base sm:text-lg" />
                      </button>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-black/70 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                      <div className="flex flex-col gap-2">
                        <p><span className="font-semibold text-black">Name:</span> {item.firstName} {item.lastName}</p>
                        <p><span className="font-semibold text-black">Email:</span> {item.email}</p>
                        <p><span className="font-semibold text-black">Phone:</span> {item.phone}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p><span className="font-semibold text-black">Location:</span> {item.location}</p>
                        <p><span className="font-semibold text-black">WhatsApp:</span> {item.whatsapp}</p>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                      {/* Quantity Adjuster */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-black/60 uppercase tracking-wider">Quantity:</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.tickets - 1, index)}
                            disabled={isProcessing}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-black text-white text-base sm:text-lg hover:bg-black/80 transition-all duration-300 hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={`quantity-${index} text-xl sm:text-2xl text-black font-light w-10 sm:w-12 text-center`}>
                            {item.tickets}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.tickets + 1, index)}
                            disabled={isProcessing}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-black text-white text-base sm:text-lg hover:bg-black/80 transition-all duration-300 hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-xs text-black/60 mb-1">Subtotal</p>
                        <span className="text-2xl sm:text-3xl text-amber-500 font-light">
                          ₦{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Summary */}
              <div className="checkout-summary space-y-4 sm:space-y-6">
                {/* Grand Total */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8 hover:border-amber-500/50 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-black/60 uppercase tracking-wider mb-1">Grand Total</p>
                      <p className="text-sm text-black/50">
                        {cartItems.reduce((sum, item) => sum + item.tickets, 0)} ticket(s)
                      </p>
                    </div>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-amber-500">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Complete Purchase'}
                </Button>

                {/* Continue Shopping */}
                <div className="text-center">
                  <button
                    onClick={() => navigate('/playstation')}
                    disabled={isProcessing}
                    className="text-sm text-black/60 hover:text-black uppercase tracking-wider transition-colors duration-300 disabled:opacity-50"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}