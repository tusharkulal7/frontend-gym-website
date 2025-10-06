import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const baseLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Header({ user, onProfileClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ user exists means logged in
  const isLoggedIn = !!user;

  // Build nav links based on login state
  const navLinks = isLoggedIn
    ? [...baseLinks, { name: "Profile", path: "#", isProfile: true }]
    : [...baseLinks, { name: "Signup", path: "/signup" }, { name: "Login", path: "/login" }];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-red-600 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-white">
          <img
            src="/images/gym-banner.png"
            alt="Gym Logo"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
          />
          <span className="ml-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-agency font-bold text-black">
            EVOLUTION GYM & FITNESS
          </span>
        </Link>

        {/* Hamburger - Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-black focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center font-agency space-x-6 text-lg sm:text-xl md:text-2xl lg:text-3xl">
          {navLinks.map((link) =>
            link.isProfile ? (
              <button
                key="profile"
                onClick={onProfileClick}
                className="text-black font-medium hover:text-white transition-all duration-300"
              >
                Profile
              </button>
            ) : (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white"
                      : "text-black font-medium hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black px-6 pb-4 font-agency text-base space-y-3">
          {navLinks.map((link) =>
            link.isProfile ? (
              <button
                key="profile"
                onClick={() => {
                  onProfileClick();
                  setMenuOpen(false);
                }}
                className="block text-red-500 hover:text-white font-bold transition-all"
              >
                Profile
              </button>
            ) : (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block transition-all duration-200 font-bold ${
                    isActive ? "text-white" : "text-red-500 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            )
          )}
        </div>
      )}
    </header>
  );
}
