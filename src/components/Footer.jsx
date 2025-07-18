export default function Footer() {
  return (
    <footer className="text-white body-font bg-red-600">
      <div className="container px-4 md:px-8 py-6 mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Logo and Copyright */}
        <div className="flex items-center justify-center mb-4 sm:mb-0 space-x-4">
          <img
            src="/images/gym-banner.png"
            alt="Gym Logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <p className="text-sm sm:text-base text-gray-100 text-center">
            © 2025 Evolution Gym & Fitness. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <span className="inline-flex mt-4 sm:mt-0 justify-center sm:justify-start space-x-4">
          {/* Facebook */}
          <a
            className="text-white hover:text-gray-300"
            href="https://www.facebook.com/EvolutionGymEGF/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-6 h-6 md:w-7 md:h-7"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            className="text-white hover:text-gray-300"
            href="https://www.instagram.com/evolutiongymfitness/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-6 h-6 md:w-7 md:h-7"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <path d="M17.5 6.5h.01" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
}
