import { Link } from 'react-router-dom';
import { Search, Compass, Briefcase, Users } from 'lucide-react';
import { NavItem } from './NavItem';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper-light border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/discover" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-ink">
              <div className="w-3 h-3 rounded-full border-2 border-gold"></div>
            </div>
            <span className="text-lg font-bold font-serif text-ink">T-Hub Founders</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavItem to="/discover" icon={Compass} label="Discover" />
            <NavItem to="/opportunities" icon={Briefcase} label="Opportunities" />
            <NavItem to="/mentors" icon={Users} label="Mentors" />
          </nav>

          {/* Desktop Search & User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
              <input
                type="text"
                placeholder="Search... ⌘K"
                className="input w-64 pl-10 pr-4 h-10"
              />
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>

          {/* Mobile User Menu */}
          <div className="lg:hidden">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
