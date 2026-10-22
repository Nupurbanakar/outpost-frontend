import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // If not logged in, show login button
  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors rounded"
      >
        Log In
      </Link>
    );
  }

  // Get user initials
  const getInitials = () => {
    if (!user?.founderName) return '?';
    const names = user.founderName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.founderName[0].toUpperCase();
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2d6a4f] text-white font-medium text-sm hover:bg-[#1f4d36] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:ring-offset-2 overflow-hidden"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user?.profilePhotoUrl ? (
          <img 
            src={user.profilePhotoUrl} 
            alt={user.founderName}
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials()
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-paper-light border border-line shadow-xl z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b border-line">
            <p className="text-sm font-medium text-ink truncate">{user?.founderName}</p>
            <p className="text-xs text-muted-text truncate">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-[#f5f3ed] transition-colors"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <User size={16} />
              <span>Profile</span>
            </Link>

            <Link
              to="/profile/security"
              className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-[#f5f3ed] transition-colors"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>

            {/* Admin Link - Only show for admin users */}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors border-t border-line"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <Shield size={16} />
                <span className="font-semibold">Admin Portal</span>
              </Link>
            )}
          </div>

          <div className="border-t border-line py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
              role="menuitem"
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
