// src/pages/Home.jsx
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function Home() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    slides: {
      perView: 1,
    },
    created: (slider) => {
      setInterval(() => {
        slider.next();
      }, 3000); // autoplay every 3 seconds
    },
  });

  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        {/* Text Section */}
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="font-agency text-white font-bold text-[2.5rem] leading-tight text-center">
            WELCOME TO OUR GYM
            <br />
            BUILD YOUR DREAM PHYSIQUE
          </h1>

          <p className="mb-8 leading-relaxed text-white text-lg font-agency text-4xl font-bold">
            We provide a motivating atmosphere to help you build muscle and find supportive gym partners. Sculpt your body and achieve your dream physique
          </p>
        </div>

        {/* Carousel Section */}
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <div ref={sliderRef} className="keen-slider rounded overflow-hidden">
            <div className="keen-slider__slide number-slide1">
              <img src="/images/0.jpg" alt="Slide 1" className="w-full h-full object-cover" />
            </div>
            <div className="keen-slider__slide number-slide2">
              <img src="/images/1.jpg" alt="Slide 2" className="w-full h-full object-cover" />
            </div>
            <div className="keen-slider__slide number-slide3">
              <img src="/images/2.jpg" alt="Slide 3" className="w-full h-full object-cover" />
            </div>
            <div className="keen-slider__slide number-slide4">
              <img src="/images/4.jpg" alt="Slide 4" className="w-full h-full object-cover" />
            </div>
            <div className="keen-slider__slide number-slide5">
              <img src="/images/5.jpg" alt="Slide 5" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
