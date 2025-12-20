import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Context
import { CartProvider } from './context/CartContex';

// Components
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

  return (
    <CartProvider>
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
    </CartProvider>
  );
}

export default App;