import { ReactNode } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import {
  LayoutDashboard,
  TrendingUp,
  Award,
  Users,
  Handshake,
  Gift,
  Star,
  Settings,
  LogOut,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Check if user is admin
  // For now, we'll check a role property (you may need to add this to User type)
  const isAdmin = (user as any)?.role === 'ADMIN';

  if (!isAdmin) {
    return <Navigate to="/discover" replace />;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: TrendingUp, label: 'Grants', path: '/admin/grants' },
    { icon: Award, label: 'Challenges', path: '/admin/challenges' },
    { icon: Users, label: 'Mentors', path: '/admin/mentors' },
    { icon: Handshake, label: 'Partners', path: '/admin/partners' },
    { icon: Gift, label: 'Offers', path: '/admin/offers' },
    { icon: Star, label: 'Spotlight', path: '/admin/spotlight' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-400">T-Hub Outpost</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-gray-800 p-4">
          <div className="mb-3 text-sm text-gray-400">
            <p className="font-medium text-white">{user?.founderName}</p>
            <p>{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  );
}
