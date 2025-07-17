import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    "/images/a.jpg",
    "/images/b.jpg",
    "/images/c.jpg",
    "/images/d.jpg",
    "/images/e.jpg",
  ];

  return (
    <>
      <section className="py-12 px-4 text-white">
        <h1 className="font-agency underline text-3xl font-semibold text-center">
          Explore the Library
        </h1>
        <p className="font-agency text-sm text-slate-400 text-center mt-2 max-w-lg mx-auto">
          A visual collection of our most recent works - each piece crafted with intention, emotion, and style.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-10 max-w-md mx-auto">
          {images.slice(0, 4).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`image-${index + 1}`}
              onClick={() => setSelectedImage(src)}
              className="w-full h-80 object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
          ))}
          <div className="col-span-2 flex justify-center">
            <img
              src={images[4]}
              alt="image-5"
              onClick={() => setSelectedImage(images[4])}
              className="w-[80%] sm:w-48 h-80 object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Modal with animation */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-3xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-2 right-4 font-bold text-white text-3xl cursor-pointer"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
