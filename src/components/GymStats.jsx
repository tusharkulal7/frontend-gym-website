import { Users, Trophy, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

export default function GymStats() {
  const stats = [
    {
      icon: <Users className="w-12 h-12 text-red-500" />,
      number: "500+",
      label: "Total Members",
    },
    {
      icon: <Dumbbell className="w-12 h-12 text-red-500" />,
      number: "300+",
      label: "Transformations",
    },
    {
      icon: <Trophy className="w-12 h-12 text-red-500" />,
      number: "25+",
      label: "Achievements",
    },
  ];

  return (
    <section className="text-white py-16 px-4 sm:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 underline font-agency">
          The Evolution Journey
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-zinc-900 hover:scale-105 transition-transform"
            >
              {stat.icon}
              <h3 className="text-3xl sm:text-4xl font-bold mt-4 text-red-500">
                {stat.number}
              </h3>
              <p className="text-xl sm:text-2xl text-gray-300 font-semibold mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery Button */}
        <div className="flex justify-center mt-12">
  <Link
    to="/gallery"
    className="px-12 py-5 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-2xl shadow-lg shadow-red-500/50 transition-transform transform hover:scale-110"
  >
    View Gallery
  </Link>
</div>

      </div>
    </section>
  );
}
