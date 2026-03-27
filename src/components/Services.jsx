import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = {
  weightTraining: {
    title: "Weight Training",
    description:
      "Weight training is a form of strength exercise that uses resistance—such as dumbbells, barbells, machines, or body weight—to build and strengthen muscles. It improves muscle mass, boosts metabolism, enhances endurance, and supports overall physical health. Whether you're aiming to tone your body, gain strength, or increase muscle size, weight training is a proven and effective method for achieving fitness goals.",
  },
  personalTraining: {
    title: "Personal Training",
    description:
      "Personal training is a one-on-one fitness coaching service tailored to your individual goals, fitness level, and lifestyle. A certified personal trainer designs customized workout plans, provides expert guidance on proper exercise technique, and offers motivation and accountability to help you achieve real, lasting results.",
  },
  weightLoss: {
    title: "Weight Loss",
    description:
      "Weight loss training is a structured fitness approach designed to help you burn calories, reduce body fat, and improve overall health. It combines cardio workouts, strength training, and targeted exercises to boost your metabolism and promote sustainable fat loss. Guided by a trainer or personalized plan, weight loss training focuses on consistency, proper technique, and balanced nutrition to help you reach your ideal weight in a healthy and effective way.",
  },
};

export default function Services() {
  const [selected, setSelected] = useState("weightTraining");

  return (
    <section className="px-6 pt-32 py-12 md:px-10 text-white relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-agency underline text-4xl sm:text-5xl md:text-6xl font-bold mb-10 text-center md:text-left">
          What Services We Provide ? :
        </h2>

        {/* Button Group */}
        <div className="flex justify-between items-center mb-10 relative">
          {Object.keys(services).map((key, index) => (
            <div key={key} className="relative flex-1 text-center">
              {/* Service Button */}
              <button
                onClick={() => setSelected(key)}
                className={`px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-agency text-xs sm:text-base md:text-lg lg:text-2xl transition-all relative z-10 whitespace-nowrap inline-block ${
                  selected === key
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {services[key].title}
              </button>
            </div>
          ))}
        </div>

        {/* Animated Description Box with Border Effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-900/80 p-6 md:p-8 rounded-xl shadow-lg relative"
          >
            {/* Hacker-style Border Animation */}
            <div className="absolute inset-0 rounded-xl border border-red-600/30 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-agency underline underline-offset-4 decoration-red-600">
              {services[selected].title}
            </h3>
            <p className="text-gray-300 font-agency text-base sm:text-lg md:text-xl leading-relaxed">
              {services[selected].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
