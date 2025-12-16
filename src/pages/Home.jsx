import VideoBackground from '../components/VideoBackground';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      {/* Scroll-Driven Video Narrative (5 Sections) */}
      <VideoBackground />

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </>
  );
}