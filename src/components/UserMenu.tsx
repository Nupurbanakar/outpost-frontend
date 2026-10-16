import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get user initials
  const getInitials = () => {
    if (!user?.founderName) return '?';
    const names = user.founderName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.founderName[0].toUpperCase();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors"
      >
        {getInitials()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-paper-light border border-line shadow-card z-50">
          <div className="px-4 py-3 border-b border-line">
            <p className="text-sm font-medium text-ink">{user?.founderName}</p>
            <p className="text-xs text-muted-text">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-paper transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-paper transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </div>

          <div className="border-t border-line py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-paper transition-colors w-full text-left"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
