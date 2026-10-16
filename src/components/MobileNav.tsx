import { Link, useLocation } from 'react-router-dom';
import { Compass, Briefcase, Users, LucideIcon } from 'lucide-react';

interface MobileNavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: MobileNavItem[] = [
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/mentors', icon: Users, label: 'Mentors' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-paper-light border-t border-line z-40">
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-colors
                ${
                  isActive
                    ? 'text-green-700'
                    : 'text-muted-text'
                }
              `}
            >
              <Icon size={22} strokeWidth={1.5} className="mb-1" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
