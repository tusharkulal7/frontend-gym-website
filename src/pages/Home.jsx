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
      }, 3000);
    },
  });

  return (
    <section className="text-white body-font pt-32">
      <div className="container mx-auto px-5 py-20 flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20">
        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
          <h1 className="font-agency text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            WELCOME TO OUR GYM
            <br />
            BUILD YOUR DREAM PHYSIQUE
          </h1>

          <p className="mt-8 text-xl sm:text-2xl md:text-3xl font-agency font-medium text-slate-300">
            We provide a motivating atmosphere to help you build muscle and find supportive gym partners. Sculpt your body and achieve your dream physique.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="w-full lg:w-1/2">
          <div
  ref={sliderRef}
  className="keen-slider aspect-video rounded-xl overflow-hidden border-4 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
>

            {[0, 1, 2, 4, 5].map((i) => (
              <div key={i} className="keen-slider__slide">
                <img
                  src={`/images/${i}.jpg`}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
