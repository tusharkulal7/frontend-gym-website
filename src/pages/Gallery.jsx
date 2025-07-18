import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    "/images/a.jpg",
    "/images/b.jpg",
    "/images/c.jpg",
    "/images/d.jpg",
    "/images/e.jpg", // 5th image
  ];

  return (
    <>
      <section className="py-16 pt-32 px-4 text-white">
        <h1 className="font-agency underline text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-center">
  Explore the Library
</h1>
<p className="font-agency text-gray-600 text-xl sm:text-2xl md:text-3xl lg:text-3xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
  A visual collection of our most recent works - better transformation and fitness.
</p>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 max-w-6xl mx-auto">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`image-${index + 1}`}
              onClick={() => setSelectedImage(src)}
              className={`w-full object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer 
                h-64 md:h-72 lg:h-72`}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
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
              className="relative max-w-4xl w-full mx-4"
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
