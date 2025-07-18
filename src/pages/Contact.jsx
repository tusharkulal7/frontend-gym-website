export default function Contact() {
  return (
    <section className="pt-32 text-gray-700 body-font">
      {/* Map Section */}
      <div className="w-full h-[300px] md:h-[450px] lg:h-[500px]">
        <iframe
          title="Evolution Gym Location"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15548.32779080079!2d74.790204!3d13.02284!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba3527240e0273f%3A0xa9a331904a6ad98d!2sEvolution%20Gym%20And%20Fitness!5e0!3m2!1sen!2sin!4v1721111111111!5m2!1sen!2sin"
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
    🕒 <span className="font-bold underline">Open:</span> Mon - Sat, 6AM - 11AM<br />
    <span className="pl-6 md:pl-12">4PM - 9PM</span>
  </p>
</div>

      </div>
    </section>
  );
}
