import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export function NavItem({ to, icon: Icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors
        border-b-2 ${
          isActive
            ? 'border-green-600 text-green-700'
            : 'border-transparent text-muted-text hover:text-ink'
        }
      `}
    >
      <Icon size={18} strokeWidth={1.5} />
      <span>{label}</span>
    </Link>
  );
}
