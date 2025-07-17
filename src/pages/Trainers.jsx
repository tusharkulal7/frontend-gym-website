// src/components/TrainerSection.jsx
export default function TrainerSection() {
  const trainers = [
    {
      name: "HITHESH AMIN",
      role: "Gym Founder",
      bio: "Founder of EVOLUTION GYM & FITNESS",
      image: "/images/hithesh.jpg",
    },
    {
      name: "RAVI KULAI",
      role: "Head Trainer",
      bio: "Winner of Mr.Karnataka and Champion of Champions in 2017.",
      image: "/images/master.jpg",
    },
    // Add more trainers if needed
  ];

  return (
    <section className="text-white py-16 px-4 sm:px-8">
      <h2 className="font-agency underline text-4xl font-bold mb-12 text-center">
        Our Trainers
      </h2>

      {trainers.map((trainer, index) => (
        <div
          key={index}
          className={`flex flex-row ${
            index % 2 !== 0 ? "flex-row-reverse" : ""
          } items-center mb-10 gap-4`}
        >
          {/* Image */}
          <div className="w-1/2">
            <img
              src={trainer.image}
              alt={trainer.name}
              className="rounded-2xl shadow-lg w-full object-cover h-40 sm:h-64 md:h-80"
            />
          </div>

          {/* Info */}
          <div className="w-1/2">
            <h3 className="font-agency underline text-xl sm:text-2xl font-bold mb-2">
              {trainer.name}
            </h3>
            <p className="font-agency text-red-500 mb-4 font-semibold">
              {trainer.role}
            </p>
            <p className="font-agency text-gray-300 text-sm sm:text-base">
              {trainer.bio}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
