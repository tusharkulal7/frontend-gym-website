import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useUser, SignedIn } from "@clerk/clerk-react";

const baseLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Header({ onProfileClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  // ✅ user exists means logged in
  const isLoggedIn = !!user;

  // Build nav links based on login state
  const navLinks = isLoggedIn
    ? [...baseLinks, { name: "Profile", path: "#", isProfile: true }]
    : [...baseLinks];

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
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center font-agency space-x-6 text-lg sm:text-xl md:text-2xl lg:text-3xl">
            {navLinks.map((link) =>
              link.isProfile ? (
                <SignedIn key="profile">
                  <button
                    onClick={onProfileClick}
                    className="flex items-center space-x-2 text-black font-medium hover:text-white transition-all duration-300"
                  >
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={24} />
                    )}
                    <span>Profile</span>
                  </button>
                </SignedIn>
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
          
          {/* Login/Signup Buttons */}
          {!isLoggedIn && (
            <div className="flex items-center space-x-3 ml-6">
              <Link
                to="/login"
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black px-6 pb-4 font-agency text-base space-y-3">
          {navLinks.map((link) =>
            link.isProfile ? (
              <SignedIn>
                <button
                  key="profile"
                  onClick={() => {
                    onProfileClick();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-red-500 hover:text-white font-bold transition-all"
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span>Profile</span>
                </button>
              </SignedIn>
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
          
          {/* Mobile Login/Signup Buttons */}
          {!isLoggedIn && (
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-600">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-center hover:bg-gray-100 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-center hover:bg-red-700 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
