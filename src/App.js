import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Trainers from './pages/Trainers';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="relative min-h-screen text-white font-agency">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 bg-black bg-cover bg-center z-[-1]"
        style={{ backgroundImage: "url('/images/gymbg.jpg')" }}
      ></div>

      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black opacity-80 z-[-1]" />

      <Router>
        <Header />
        <main className="min-h-[80vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
