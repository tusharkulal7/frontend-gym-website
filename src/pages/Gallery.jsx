import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const images = [
    "/images/gallery/1.jpg", "/images/gallery/2.jpg", "/images/gallery/3.webp",
    "/images/gallery/4.jpg", "/images/gallery/5.jpg", "/images/gallery/6.jpg",
    "/images/gallery/7.jpg", "/images/gallery/8.jpg", "/images/gallery/9.jpg",
    "/images/gallery/10.jpg", "/images/gallery/11.jpg", "/images/gallery/12.jpg",
    "/images/gallery/13.jpg", "/images/gallery/14.jpg", "/images/gallery/15.jpg",
    "/images/gallery/16.jpg", "/images/gallery/17.jpg", "/images/gallery/18.jpg",
    "/images/gallery/19.jpg", "/images/gallery/20.jpg", "/images/gallery/21.jpg",
    "/images/gallery/22.jpg", "/images/gallery/23.jpg", "/images/gallery/24.jpg",
    "/images/gallery/g2.jpg",
  ];

  const videos = [
    "/videos/1.mp4", "/videos/2.mp4", "/videos/3.mp4",
    "/videos/4.mp4", "/videos/5.mp4", "/videos/6.mp4",
  ];

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setSelectedVideo(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <section className="py-16 pt-32 px-4 text-white">
        <h1 className="font-agency underline text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-center">
          Explore the Library
        </h1>
        <p className="font-agency text-gray-600 text-xl sm:text-2xl md:text-3xl lg:text-3xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
          A visual collection of our most recent works – better transformation and fitness.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mt-10 gap-4">
          {["photos", "videos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 md:px-8 py-2 md:py-3 font-agency text-xl md:text-2xl lg:text-3xl rounded-full border-2 transition-all duration-300 ${
                activeTab === tab
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-transparent text-red-500 border-red-500 hover:bg-red-600 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-12 max-w-6xl mx-auto">
          {activeTab === "photos" && (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`image-${index + 1}`}
                  onClick={() => setSelectedImage(src)}
                  className="w-full object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-64 md:h-72 lg:h-72"
                />
              ))}
            </div>
          )}

          {activeTab === "videos" && (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              {videos.map((src, index) =>
                src.includes("youtube.com") ? (
                  <iframe
                    key={index}
                    src={src}
                    title={`video-${index}`}
                    className="w-full aspect-video rounded-lg shadow-md"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    key={index}
                    src={src}
                    onClick={() => setSelectedVideo(src)}
                    className="w-full h-64 md:h-72 lg:h-72 object-contain rounded-lg shadow-md cursor-pointer"
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
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
                className="absolute top-2 right-4 z-50 font-bold text-white text-3xl cursor-pointer bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
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

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={() => setSelectedVideo(null)}
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
                className="absolute top-2 right-4 z-50 font-bold text-white text-3xl cursor-pointer bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVideo(null);
                }}
              >
                ×
              </button>
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
