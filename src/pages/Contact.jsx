import { useEffect } from 'react';
import ContactForm from '../components/contact/ContactForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar theme="dark" />
      <div className="relative bg-white">
          <div className="h-20 sm:h-24 md:h-28" />
          
          <ContactForm />

          <Footer />
      </div>
    </>
  );
}