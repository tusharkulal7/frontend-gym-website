export default function Trainers() {
  const trainers = [
    {
      name: "RAVI KULAI",
      role: "Head Trainer",
      bio: "Winner of Mr.Karnataka and Champion of Champions in 2017.",
      image: "/images/master.jpg",
    },
  ];

  return (
    <section className="text-white py-16 pt-32 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-agency underline text-4xl sm:text-5xl md:text-6xl font-bold mb-12 text-center">
          Train with Champion of Champions
        </h2>

        {trainers.map((trainer, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } items-center mb-16 gap-6 md:gap-12`}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 max-w-md lg:max-w-full">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="rounded-2xl w-full object-cover h-64 md:h-80 lg:h-[28rem] border-4 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
              />
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2">
              <h3 className="font-agency underline text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                {trainer.name}
              </h3>
              <p className="font-agency text-red-500 text-lg sm:text-2xl md:text-3xl font-semibold mb-4">
                {trainer.role}
              </p>
              <p className="font-agency text-gray-300 text-base sm:text-lg md:text-2xl leading-relaxed">
                {trainer.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
