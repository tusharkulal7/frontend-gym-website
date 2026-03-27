import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Services from "../components/Services"; // 👈 import the section
import Trainers from "../components/Trainers";
import GymStats from "../components/GymStats";
import { CAROUSEL_IMAGES } from "../constants/carouselImages";

export default function Home() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    detailsChanged: (s) => {
      s.slides.forEach((slide, idx) => {
        slide.style.opacity = s.track.details.abs === idx ? "1" : "0";
      });
    },
    created: (slider) => {
      // Initial hide all slides except first
      slider.slides.forEach((slide, idx) => {
        slide.style.opacity = idx === 0 ? "1" : "0";
      });
      
      setInterval(() => {
        slider.next();
      }, 3000);
    },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="text-white body-font pt-20 sm:pt-24 lg:pt-32">
        <div className="responsive-container py-12 sm:py-16 lg:py-20 flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-10 lg:gap-20">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
            <h1 className="font-agency text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              WELCOME TO OUR GYM
              <br />
              BUILD YOUR DREAM PHYSIQUE
            </h1>

            <p className="mt-6 sm:mt-8 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-agency font-medium text-slate-300">
               We provide a motivating atmosphere to help you build muscle and find supportive gym partners. Sculpt your body and achieve your dream physique.
Our expert trainers are here to guide you every step of the way, from personalized workout plans to nutritional advice tailored just for you.
Whether you're a beginner or an experienced lifter, our community welcomes all fitness levels with open arms.
State-of-the-art equipment, high-energy workout zones, and a results-driven environment keep you focused and inspired.
Join a group that celebrates hard work, progress, and transformation.
Every drop of sweat brings you closer to your goals—this is more than a gym; it’s a lifestyle.
Push past limits, break through barriers, and unlock the best version of yourself.
Experience the difference—train hard, recover smart, and grow stronger every day.
            </p>
          </div>

          {/* Carousel Section */}
          <div className="w-full lg:w-1/2">
            <div
              ref={sliderRef}
              className="keen-slider aspect-video rounded-xl overflow-hidden border-2 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
            >
              {CAROUSEL_IMAGES.map((imageUrl, index) => (
                <div key={index} className="keen-slider__slide">
                  <img
                    src={imageUrl}
                    alt={`Gym Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Trainers />
      {/* 👇 Add Services section here */}
      <Services />
      <GymStats />
    </>
  );
}
