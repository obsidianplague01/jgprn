// PlayStationPage.jsx - Enhanced with Wave Chart & Micro-animations
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ComposedChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import FormInput from '../components/forms/FormInput';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContex';

gsap.registerPlugin(ScrollTrigger);

// Generate colored player data with wave effect
const generatePlayerData = (ticketPrice = 9499) => {
  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#14b8a6', '#6366f1', '#a855f7',
    '#ec4899', '#f43f5e', '#fb923c', '#facc15',
    '#4ade80', '#2dd4bf', '#60a5fa', '#c084fc', '#f472b6'
  ];
  
  const data = [];
  for (let i = 1; i <= 21; i++) {
    // Add wave effect using sine wave
    const baseValue = ticketPrice * i;
    const waveAmplitude = ticketPrice * 0.08; // 8% variation
    const waveFrequency = 0.5;
    const wave = Math.sin(i * waveFrequency) * waveAmplitude;
    
    data.push({
      players: i,
      totalMoney: baseValue + wave,
      actualTotal: baseValue, // Store actual value for tooltip
      color: colors[i - 1],
      ticketPrice,
    });
  }
  return data;
};

// Custom Tooltip with floating animation
const CustomTooltip = ({ active, payload }) => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (active && tooltipRef.current) {
      gsap.fromTo(
        tooltipRef.current,
        { scale: 0.8, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }
      );
      
      // Floating animation
      gsap.to(tooltipRef.current, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [active]);

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        ref={tooltipRef}
        className="bg-black/95 border-2 border-amber-500 p-4 rounded-lg backdrop-blur-md shadow-2xl"
      >
        <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
          Live Ticket Analysis Tracker
        </p>
        <div className="space-y-2 text-xs text-white/90">
          <p><span className="text-amber-500">▮ </span> {data.players} {data.players === 1 ? 'Player' : 'Players'} Available</p>
          <p className="text-amber-400 font-semibold">Ticket Price: ₦{data.ticketPrice.toLocaleString()}</p>
          <p className="text-white/70">Arena Opens:</p>
          <p className="text-white/70 text-[10px]">Tuesday 7:30-9:30 / Friday 7:30-9:30</p>
          <p className="text-white/60 text-[10px] mt-2 border-t border-white/20 pt-2">
            1-20 players (capacity)
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function PlayStationPage() {
  const { addToCart, cartCount } = useCart();
  const [chartData, setChartData] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    whatsapp: '',
    tickets: 1,
  });
  
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrice] = useState(9499);
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const chartRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const introRef = useRef(null);
  const priceDisplayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = generatePlayerData(ticketPrice);
    setChartData(data);
  }, [ticketPrice]);

  useEffect(() => {
    setTotalPrice(ticketPrice * formData.tickets);
  }, [ticketPrice, formData.tickets]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Header animations with stagger
      gsap.from(headerRef.current.children, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        }
      });

      // Intro card with scale
      gsap.from(introRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 80%',
        }
      });

      // Chart with rotation + scale
      gsap.from(chartRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.9,
        rotateX: -15,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chartRef.current,
          start: 'top 80%',
        },
      });

      // Form with 3D effect
      gsap.from(formRef.current, {
        opacity: 0,
        y: 100,
        rotateX: 15,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
        },
      });

      // Floating animation for price display
      if (priceDisplayRef.current) {
        gsap.to(priceDisplayRef.current, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Micro-animations for cards
      gsap.utils.toArray('.animate-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        });

        // Add hover scale animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // Micro-animation for background blobs
  useEffect(() => {
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');

    if (blob1) {
      gsap.to(blob1, {
        x: 50,
        y: -50,
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (blob2) {
      gsap.to(blob2, {
        x: -30,
        y: 30,
        scale: 0.9,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  const toggleShowMore = () => {
    setShowMore(!showMore);
    if (!showMore) {
      gsap.from('.more-content', {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleTicketChange = (increment) => {
    const newTickets = Math.max(1, Math.min(20, formData.tickets + increment));
    setFormData({ ...formData, tickets: newTickets });

    // Enhanced animation for ticket count
    gsap.fromTo(
      '.ticket-count',
      { scale: 1.5, color: '#f59e0b', rotateY: 360 },
      { scale: 1, color: '#fff', rotateY: 0, duration: 0.6, ease: 'back.out(2)' }
    );

    // Pulse animation for total price
    gsap.fromTo(
      '.total-price',
      { scale: 1.1, color: '#fbbf24' },
      { scale: 1, color: '#f59e0b', duration: 0.4, ease: 'back.out(2)' }
    );
  };

  const handleBuyNow = async () => {
    if (!validateForm()) {
      // Enhanced shake animation
      gsap.to(formRef.current, {
        x: [-15, 15, -15, 15, -10, 10, 0],
        duration: 0.6,
        ease: 'power2.out',
      });
      
      setSubmitError('Please fill in all required fields correctly');
      gsap.from('.error-message', {
        opacity: 0,
        y: -10,
        scale: 0.9,
        duration: 0.3
      });
      
      setTimeout(() => setSubmitError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Success animation sequence
      const tl = gsap.timeline();
      
      tl.to(formRef.current, {
        scale: 0.98,
        opacity: 0.6,
        duration: 0.3,
      })
      .to('.form-field', {
        opacity: 0,
        x: -20,
        stagger: 0.05,
        duration: 0.3,
      }, '-=0.2')
      .call(() => {
        const cartItem = {
          ...formData,
          ticketPrice,
          totalPrice,
        };
        
        addToCart(cartItem);
        navigate('/checkout');
      });
    } catch (error) {
      setSubmitError('Failed to add to cart. Please try again.');
      setIsSubmitting(false);
      
      gsap.to(formRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar theme="light" />
      
      {/* Animated Background with floating blobs */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
        <div className="blob-1 absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" 
            style={{ animationDuration: '4s' }} />
        <div className="blob-2 absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" 
            style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24 sm:pt-28 lg:pt-32">
        
        {/* Page Header */}
        <div ref={headerRef} className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tighter text-white uppercase mb-3 sm:mb-4">
            PlayStation Gaming
          </h1>
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/60">
            Live Ticket Pricing
          </p>
        </div>

        {/* Introduction Section */}
        <div ref={introRef} className="animate-card bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-4 sm:mb-6 leading-relaxed">
              Welcome to JGPNR Play Station - the ultimate city's hub for 5-a-side football enthusiasts
            </h2>
            
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
              Here, players from around the world meet, connect and dive into thrilling matches of advanced soccer. 
              We deliver a top-notch football experience packed with skill, strategy and non-stop fun. Join us and elevate your game.
            </p>

            {showMore && (
              <div className="more-content space-y-4 mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  JGPNR is more than just a club, it is a vibrant community where football lovers come together remotely 
                  to play, chat, and enjoy the beautiful game. Specializing in intense 5-a-side matches, we bring players 
                  from everywhere to compete in advanced, skill-based soccer.
                </p>
                
                <div className="border-t-2 border-amber-500 pt-4 space-y-2">
                  <p className="text-sm font-semibold text-white uppercase tracking-wider">
                    TVD - Ticket Valid Duration
                  </p>
                  <p className="text-lg font-light text-amber-500">
                    Get your tickets today.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={toggleShowMore}
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-amber-500 transition-colors duration-300 uppercase tracking-wider group"
            >
              {showMore ? 'Show Less' : 'More'}
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        </div>

        {/* Chart Section with Wave */}
        <div 
          ref={chartRef} 
          className="animate-card bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl p-4 sm:p-6 lg:p-10 mb-8 sm:mb-12 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-amber-500/10"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-6 sm:mb-8 tracking-wide">
            Live Player Chart
          </h2>
          
          <div className="h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="4.76%" stopColor="#f59e0b" />
                    <stop offset="9.52%" stopColor="#10b981" />
                    <stop offset="14.29%" stopColor="#3b82f6" />
                    <stop offset="19.05%" stopColor="#8b5cf6" />
                    <stop offset="23.81%" stopColor="#ec4899" />
                    <stop offset="28.57%" stopColor="#06b6d4" />
                    <stop offset="33.33%" stopColor="#84cc16" />
                    <stop offset="38.10%" stopColor="#f97316" />
                    <stop offset="42.86%" stopColor="#14b8a6" />
                    <stop offset="47.62%" stopColor="#6366f1" />
                    <stop offset="52.38%" stopColor="#a855f7" />
                    <stop offset="57.14%" stopColor="#ec4899" />
                    <stop offset="61.90%" stopColor="#f43f5e" />
                    <stop offset="66.67%" stopColor="#fb923c" />
                    <stop offset="71.43%" stopColor="#facc15" />
                    <stop offset="76.19%" stopColor="#4ade80" />
                    <stop offset="80.95%" stopColor="#2dd4bf" />
                    <stop offset="85.71%" stopColor="#60a5fa" />
                    <stop offset="90.48%" stopColor="#c084fc" />
                    <stop offset="95.24%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                  
                  {/* Glow effect for the area */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis 
                  dataKey="players" 
                  stroke="#fff"
                  label={{ value: 'Number of Players', position: 'insideBottom', offset: -5, fill: '#fff' }}
                  tick={{ fontSize: 12, fill: '#fff' }}
                />
                <YAxis 
                  stroke="#fff"
                  label={{ value: 'Total Money In (₦)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#fff' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone"
                  dataKey="totalMoney" 
                  stroke="url(#areaGradient)"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  fillOpacity={0.8}
                  filter="url(#glow)"
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div ref={priceDisplayRef} className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-white/60 uppercase tracking-wider mb-2">Current Ticket Price (Fixed)</p>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-amber-500">
              ₦{ticketPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Ticket Form */}
        <div 
          ref={formRef} 
          className="animate-card bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl p-4 sm:p-6 lg:p-10 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-amber-500/10"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-6 sm:mb-8 tracking-wide">
            Purchase Tickets
          </h2>

          {submitError && (
            <div className="error-message bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4 mb-6 text-red-300 text-sm">
              {submitError}
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="form-field">
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
                  theme="dark"
                />
              </div>

              <div className="form-field">
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
                  theme="dark"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="form-field">
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email Address"
                  placeholder="you@example.com"
                  required={true}
                  error={errors.email}
                  disabled={isSubmitting}
                  showValidationIcon={true}
                  isValid={validateEmail(formData.email)}
                  theme="dark"
                />
              </div>

              <div className="form-field">
                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  label="Phone Number"
                  placeholder="+234 XXX XXX XXXX"
                  required={true}
                  error={errors.phone}
                  disabled={isSubmitting}
                  theme="dark"
                />
              </div>
            </div>

            {/* Location & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="form-field">
                <FormInput
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  label="Location"
                  placeholder="City, State"
                  required={true}
                  error={errors.location}
                  disabled={isSubmitting}
                  theme="dark"
                />
              </div>

              <div className="form-field">
                <FormInput
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  label="WhatsApp Number"
                  placeholder="+234 XXX XXX XXXX"
                  required={true}
                  error={errors.whatsapp}
                  disabled={isSubmitting}
                  theme="dark"
                />
              </div>
            </div>

            {/* Ticket Quantity Selector */}
            <div className="form-field">
              <label className="block text-xs sm:text-sm text-white/70 uppercase tracking-wider mb-3 sm:mb-4">
                Number of Tickets
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  type="button" 
                  onClick={() => handleTicketChange(-1)}
                  disabled={isSubmitting}
                  aria-label="Decrease ticket quantity"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 border-2 border-white/20 text-white text-lg sm:text-xl hover:bg-white/20 hover:border-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-12 flex items-center justify-center backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >−</button>
                <span className="ticket-count text-2xl sm:text-3xl text-white font-light w-12 sm:w-16 text-center">
                  {formData.tickets}
                </span>
                <button 
                  type="button" 
                  onClick={() => handleTicketChange(1)}
                  disabled={isSubmitting}
                  aria-label="Increase ticket quantity"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 border-2 border-white/20 text-white text-lg sm:text-xl hover:bg-white/20 hover:border-amber-500 transition-all duration-300 hover:scale-110 hover:-rotate-12 flex items-center justify-center backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >+</button>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8 hover:border-amber-500/50 transition-all duration-300 backdrop-blur-sm hover:bg-amber-500/15">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <span className="text-sm sm:text-base text-white/70 uppercase tracking-wider">Total Amount:</span>
                <span className="total-price text-2xl sm:text-3xl font-light text-amber-500">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              variant="accent" 
              size="lg" 
              fullWidth 
              onClick={handleBuyNow} 
              disabled={isSubmitting}
              className="mt-4 sm:mt-6"
            >
              {isSubmitting ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Footer theme="dark" />
      </div>
    </div>
  );
}