import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f3] border-b border-[#e2dccc]">
      <nav className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
          >
            <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#202c3d] flex items-center justify-center">
              <div className="relative w-3 h-3 border-[2px] border-[#e9b75f] rounded-full">
                <span className="absolute top-[3px] left-[3px] w-1.5 h-1.5 bg-[#e9b75f] rounded-full" />
              </div>
            </div>
            <span className="font-serif text-lg lg:text-xl font-bold tracking-tight text-[#202c3d] group-hover:text-[#304258] transition-colors">
              Outpost
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/grants">Grants</NavLink>
            <NavLink to="/challenges">Challenges</NavLink>
            <NavLink to="/mentors">Mentors</NavLink>
            <NavLink to="/partners">Partners</NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Sign In - Desktop */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 lg:px-5 h-10 lg:h-11 text-sm font-semibold text-[#202c3d] hover:text-[#875e24] transition-colors"
            >
              Sign In
            </Link>

            {/* Get Started - Primary CTA */}
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 lg:px-6 h-10 lg:h-12 bg-[#202c3d] text-[#f7f4ec] text-sm font-semibold border border-[#202c3d] hover:bg-[#304258] hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#202c3d] hover:bg-[#eee9de] transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

// Navigation Link Component
function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-[#72777b] hover:text-[#202c3d] transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-3 lg:left-4 right-3 lg:right-4 h-[2px] bg-[#d69b42] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}

export default Header;
