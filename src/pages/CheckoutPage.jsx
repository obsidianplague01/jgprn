import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaTrash } from 'react-icons/fa';
import Navbar from '../components/Navbar'
export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    
    // Calculate grand total
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    setGrandTotal(total);
  }, []);

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    const total = updatedCart.reduce((sum, item) => sum + item.totalPrice, 0);
    setGrandTotal(total);
  };

  const handleCheckout = () => {
    // Process payment (integrate payment gateway here)
    alert('Processing payment... (Payment gateway integration needed)');
    
    // Clear cart after successful payment
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <>
      <Navbar theme="dark" cartCount={0} />
      <div className="min-h-screen  pt-24 lg:pt-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <h1 className="text-4xl sm:text-5xl font-extralight tracking-tighter text-black uppercase mb-12 text-center">
            Checkout
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-black/60 mb-8">Your cart is empty</p>
              <button
                onClick={() => navigate('/playstation')}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold uppercase tracking-wider px-8 py-3 rounded-lg transition-all duration-300"
              >
                Buy Tickets
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl text-black font-light mb-2">PlayStation Ticket</h3>
                        <p className="text-sm text-black/60">Quantity: {item.tickets}</p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-black/70 mb-4">
                      <div>Email: {item.email}</div>
                      <div>Phone: {item.phone}</div>
                      <div>Location: {item.location}</div>
                      <div>WhatsApp: {item.whatsapp}</div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-2xl text-amber-500 font-light">
                        ₦{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-8 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-black uppercase tracking-wider">Grand Total:</span>
                  <span className="text-4xl font-light text-amber-500">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold uppercase tracking-wider py-4 rounded-lg transition-all duration-300 hover:scale-105 text-lg"
              >
                Complete Purchase
              </button>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
    
  );
}