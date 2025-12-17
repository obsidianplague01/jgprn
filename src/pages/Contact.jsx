import { useEffect } from 'react';
import ContactForm from '../components/contact/ContactForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar theme="dark" cartCount={0} />
      <div className="relative bg-white">
          {/* Add spacing for navbar */}
          <div className="h-24 md:h-28" />
          
          {/* Contact Form */}
          <ContactForm />

          {/* Footer */}
          <Footer />
      </div>
    </>
    
  );
}