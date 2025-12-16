import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Layout Components
import ResponsiveNavBar from './components/ResponsiveNavbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import Loader from './components/Loader';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import ComingSoon from './pages/ComingSoon';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      {/* Cinematic Loader */}
      {loading && <Loader onLoadComplete={() => setLoading(false)} />}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Navigation - Shows on all pages */}
          <ResponsiveNavBar />

          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/store" element={<ComingSoon pageName="Store" />} />
            <Route path="/playstation" element={<ComingSoon pageName="PlayStation" />} />
            <Route path="/coming-soon" element={<ComingSoon pageName="New Features" />} />
            {/* 404 Fallback */}
            <Route path="*" element={<ComingSoon pageName="Page" />} />
          </Routes>

          {/* Scroll to Top Button - Shows on all pages */}
          <ScrollToTopButton />
        </>
      )}
    </Router>
  );
}
export default App