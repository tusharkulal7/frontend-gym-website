export default function Contact() {
  return (
    <section className="pt-32 text-gray-700 body-font">
     {/* Map Section */}
<div className="mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] h-[300px] md:h-[450px] lg:h-[500px]">
  <iframe
    title="Evolution Gym Location"
    src="https://www.google.com/maps?ll=13.02284,74.790204&z=15&t=k&output=embed"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

      {/* Contact Info */}
      <div className="container max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-20">
        <h2 className="font-agency underline text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold mb-10 text-center text-white">
          Contact Us
        </h2>

        <div className="text-center text-xl sm:text-2xl md:text-3xl lg:text-3xl space-y-8">
          <p className="font-agency text-white">
            📍 <span className="font-bold underline">Location:</span> Bharani Towers, Sasihitlu Road, Mukka, Mangaluru, Karnataka 574146, India
          </p>
          <p className="font-agency text-white">
            📞 <span className="font-bold underline">Phone:</span> +91 9535426679
          </p>
          <p className="font-agency text-white leading-relaxed">
            🕒 <span className="font-bold underline">Open:</span> Mon - Sat, 6AM - 11AM ,  4PM - 9PM <br />
          </p>
        </div>
      </div>
    </section>
  );
}
