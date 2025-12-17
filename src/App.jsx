
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Components
import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';
import Loader from './components/Loader';

// Pages
import LandingPage from './pages/LandingPage';
import PlayStationPage from './pages/PlayStationPage';
import CheckoutPage from './pages/CheckoutPage';
import Contact from './pages/Contact';
import ComingSoon from './pages/ComingSoon';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <Router>
      {/* Loader */}
      {loading && <Loader onLoadComplete={() => setLoading(false)} />}

      {!loading && (
        <>
         

          {/* Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<ComingSoon pageName="Shop" />} />
            <Route path="/podcast" element={<ComingSoon pageName="Podcast" />} />
            <Route path="/playstation" element={<PlayStationPage />} />
            <Route path="/discover" element={<ComingSoon pageName="Discover" />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CheckoutPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<ComingSoon pageName="Page" />} />
          </Routes>

          {/* Scroll to Top - Shows on all pages */}
          <ScrollToTopButton />
        </>
      )}
    </Router>
  );
}

export default App;

