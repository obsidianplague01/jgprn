// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import { CartProvider } from './context/CartContext';

import ScrollToTopButton from './components/ScrollToTopButton';
import Loader from './components/Loader';

import LandingPage from './pages/LandingPage';
import PlayStationPage from './pages/PlayStationPage';
import CheckoutPage from './pages/CheckoutPage';
import ManualPaymentPage from './pages/ManualPaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import Contact from './pages/Contact';
import ComingSoon from './pages/ComingSoon';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <CartProvider>
      <Router>
        {loading && <Loader onLoadComplete={() => setLoading(false)} />}

        {!loading && (
          <>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<ComingSoon pageName="Shop" />} />
              <Route path="/podcast" element={<ComingSoon pageName="Podcast" />} />
              <Route path="/playstation" element={<PlayStationPage />} />
              <Route path="/discover" element={<ComingSoon pageName="Discover" />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CheckoutPage />} />
              <Route path="/manual-payment" element={<ManualPaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<ComingSoon pageName="Page" />} />
            </Routes>

            <ScrollToTopButton />
          </>
        )}
      </Router>
    </CartProvider>
  );
}

export default App;