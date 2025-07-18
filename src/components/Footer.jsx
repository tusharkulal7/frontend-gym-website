export default function Footer() {
  return (
    <footer className="text-white body-font bg-red-600">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a
          href="/"
          className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
        >
          <img
            src="/images/gym-banner.png"
            alt="Gym Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="ml-3 font-agency text-2xl font-bold text-white">
            EVOLUTION GYM & FITNESS
          </span>
        </a>

        <p className="text-sm text-gray-900 text-lg sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2025-EVOLUTION GYM & FITNESS
        </p>

        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          {/* Facebook */}
          <a
            className="text-black"
            href="https://www.facebook.com/EvolutionGymEGF/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-7 h-7"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            className="ml-3 text-black"
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
              className="w-7 h-7"
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
