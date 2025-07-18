export default function About() {
  return (
    <section className="px-6 pt-32 py-10 md:px-20 lg:px-32 text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-agency underline text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center md:text-left">
          About Us:
        </h2>

        <p className="font-agency text-lg sm:text-xl md:text-2xl mb-6 leading-relaxed">
          <strong className="text-red-400">EVOLUTION GYM & FITNESS</strong> was founded by{" "}
          <strong className="text-yellow-300">HITHESH AMIN</strong> on August 15th, 2016. It has
          expanded with branches in <span className="text-green-300">Mukka, Padubidri, and Hosabettu</span>.
        </p>

        <p className="font-agency text-lg sm:text-xl md:text-2xl leading-relaxed">
          <strong className="text-red-400">ACHIEVEMENTS:</strong> Bodybuilders from EVOLUTION have won
          multiple medals at <span className="text-blue-300">District</span>,{" "}
          <span className="text-purple-300">State</span>, and{" "}
          <span className="text-pink-300">National</span> level competitions.
        </p>
      </div>
    </section>
  );
}
