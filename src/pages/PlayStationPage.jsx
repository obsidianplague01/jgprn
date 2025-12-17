import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

gsap.registerPlugin(ScrollTrigger);

// Simulated live data generator
const generateLiveData = () => {
  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  
  const data = [];
  const basePrice = 5000;
  
  for (let i = 1; i <= 20; i++) {
    const priceVariation = Math.random() * 2000 - 1000;
    data.push({
      players: i,
      price: Math.round(basePrice + priceVariation),
      color: colors[i % colors.length],
    });
  }
  
  return data;
};

export default function PlayStationPage() {
  const [chartData, setChartData] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    whatsapp: '',
    tickets: 1,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(5000);
  const [focusedField, setFocusedField] = useState(null);
  
  const chartRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const priceDisplayRef = useRef(null);
  const navigate = useNavigate();

  // Simulate live data updates
  useEffect(() => {
    const updateData = () => {
      const newData = generateLiveData();
      setChartData(newData);
      
      const avgPrice = Math.round(
        newData.reduce((sum, item) => sum + item.price, 0) / newData.length
      );
      setTicketPrice(avgPrice);

      // Animate price change
      if (priceDisplayRef.current) {
        gsap.fromTo(
          priceDisplayRef.current,
          { scale: 1.2, color: '#f59e0b' },
          { scale: 1, color: '#f59e0b', duration: 0.5, ease: 'back.out(2)' }
        );
      }
    };

    updateData();
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate total price
  useEffect(() => {
    setTotalPrice(ticketPrice * formData.tickets);
  }, [ticketPrice, formData.tickets]);

  // Entrance animations
  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(headerRef.current.children, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
      });

      // Chart entrance
      gsap.from(chartRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chartRef.current,
          start: 'top 80%',
        },
      });

      // Form entrance
      gsap.from(formRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
        },
      });

      // Stagger form fields
      gsap.from('.form-field', {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 70%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTicketChange = (increment) => {
    const newTickets = Math.max(1, formData.tickets + increment);
    setFormData({ ...formData, tickets: newTickets });

    // Animate ticket number
    gsap.fromTo(
      '.ticket-count',
      { scale: 1.3, color: '#f59e0b' },
      { scale: 1, color: '#fff', duration: 0.4, ease: 'back.out(2)' }
    );
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    
    const fieldElement = document.querySelector(`[name="${field}"]`);
    if (fieldElement) {
      gsap.to(fieldElement, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleBlur = (field) => {
    setFocusedField(null);
    
    const fieldElement = document.querySelector(`[name="${field}"]`);
    if (fieldElement) {
      gsap.to(fieldElement, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleBuyNow = () => {
    // Validate form
    if (!formData.email || !formData.phone || !formData.location || !formData.whatsapp) {
      // Shake animation for empty fields
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
      return;
    }

    // Success animation
    gsap.to(formRef.current, {
      scale: 0.95,
      opacity: 0.5,
      duration: 0.3,
      onComplete: () => {
        const cartItem = {
          ...formData,
          ticketPrice,
          totalPrice,
          timestamp: Date.now(),
        };
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch custom event for cart update
        window.dispatchEvent(new Event('cartUpdated'));
        
        navigate('/checkout');
      }
    });
  };

  return (
    <div className="min-h-screen via-black to-gray-900">
      {/* Dark Theme Navbar */}
      <Navbar theme="dark" cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        
        {/* Page Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tighter text-black uppercase mb-4">
            PlayStation Gaming
          </h1>
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-black/60">
            Live Ticket Pricing
          </p>
        </div>

        {/* Chart Section */}
        <div 
          ref={chartRef} 
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 mb-12 hover:border-white/20 transition-all duration-500 group"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-black mb-8 tracking-wide group-hover:text-amber-500 transition-colors duration-300">
            Live Price Chart
          </h2>
          
          <div className="h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="players" 
                  stroke="#010101"
                  label={{ value: 'Number of Players', position: 'insideBottom', offset: -5, fill: '#fff' }}
                />
                <YAxis 
                  stroke="#010101"
                  label={{ value: 'Price (₦")', angle: -90, position: 'insideLeft', fill: '#fff' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Ticket Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Price Display */}
          <div className="mt-8 text-center">
            <p className="text-sm text-black/60 uppercase tracking-wider mb-2">Current Ticket Price</p>
            <p ref={priceDisplayRef} className="text-4xl sm:text-5xl font-light text-amber-500">
              ₦{ticketPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Ticket Form Section */}
        <div 
          ref={formRef} 
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 hover:border-white/20 transition-all duration-500"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-black mb-8 tracking-wide">
            Purchase Tickets
          </h2>

          <form className="space-y-6">
            
            {/* Email */}
            <div className="form-field">
              <label className="block text-sm text-black/70 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-black focus:border-amber-500 focus:outline-none transition-all duration-300 hover:border-white/20"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="form-field">
              <label className="block text-sm text-black/70 uppercase tracking-wider mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus('phone')}
                onBlur={() => handleBlur('phone')}
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-black focus:border-amber-500 focus:outline-none transition-all duration-300 hover:border-white/20"
                placeholder="+234 XXX XXX XXXX"
              />
            </div>

            {/* Location */}
            <div className="form-field">
              <label className="block text-sm text-black/70 uppercase tracking-wider mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onFocus={() => handleFocus('location')}
                onBlur={() => handleBlur('location')}
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-black focus:border-amber-500 focus:outline-none transition-all duration-300 hover:border-white/20"
                placeholder="City, State"
              />
            </div>

            {/* WhatsApp */}
            <div className="form-field">
              <label className="block text-sm text-black/70 uppercase tracking-wider mb-2">
                WhatsApp Number *
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                onFocus={() => handleFocus('whatsapp')}
                onBlur={() => handleBlur('whatsapp')}
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-black focus:border-amber-500 focus:outline-none transition-all duration-300 hover:border-white/20"
                placeholder="+234 XXX XXX XXXX"
              />
            </div>

            {/* Number of Tickets */}
            <div className="form-field">
              <label className="block text-sm text-black/70 uppercase tracking-wider mb-2">
                Number of Tickets
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleTicketChange(-1)}
                  className="w-12 h-12 bg-black/5 border-2 border-white/20 rounded-lg text-black text-xl hover:bg-white/10 hover:border-amber-500 transition-all duration-300 hover:scale-110"
                >
                  −
                </button>
                <span className="ticket-count text-3xl text-black font-light w-16 text-center">
                  {formData.tickets}
                </span>
                <button
                  type="button"
                  onClick={() => handleTicketChange(1)}
                  className="w-12 h-12 bg-white/5 border-2 border-white/20 rounded-lg text-black text-xl hover:bg-white/10 hover:border-amber-500 transition-all duration-300 hover:scale-110"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-6 mt-8 hover:border-amber-500/50 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-black/70 uppercase tracking-wider">Total Amount:</span>
                <span className="text-3xl font-light text-amber-500">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buy Now Button */}
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}