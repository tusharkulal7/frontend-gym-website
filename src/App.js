// App.js
import { Carousel } from "react-responsive-carousel";
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
import "react-responsive-carousel/lib/styles/carousel.min.css";

function App() {
  return (
    <div
      className="min-h-screen bg-black bg-no-repeat bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "url('/images/gymbg.jpg')",
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
