import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Trainers", path: "/trainers" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  return (
    <header className="text-white body-font bg-red-600">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to="/"
          className="flex items-center text-white mb-4 md:mb-0"
        >
          <img
            src="/images/gym-banner.png"
            alt="Gym Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="ml-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-agency font-bold text-black">
            EVOLUTION GYM & FITNESS
          </span>
        </Link>

        <nav className="w-full md:w-auto flex flex-wrap justify-center items-center font-agency text-sm sm:text-base md:text-lg space-x-4 mt-1 md:mt-0">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative transition-all duration-300 ease-in-out ${
                  isActive
                    ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white"
                    : "text-black font-normal hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
