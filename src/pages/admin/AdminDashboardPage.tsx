import { AdminLayout } from '../../components/admin/AdminLayout';
import { TrendingUp, Award, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Grants', value: '42', icon: TrendingUp, path: '/admin/grants', color: 'bg-green-100 text-green-700' },
    { label: 'Active Challenges', value: '18', icon: Award, path: '/admin/challenges', color: 'bg-purple-100 text-purple-700' },
    { label: 'Pending Mentors', value: '7', icon: Users, path: '/admin/mentors', color: 'bg-blue-100 text-blue-700' },
    { label: 'Active Benefits', value: '23', icon: Gift, path: '/admin/offers', color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.path}
                className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/admin/grants"
              className="rounded-lg border-2 border-gray-200 p-4 hover:border-indigo-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Create Grant</h3>
              <p className="mt-1 text-sm text-gray-600">Add a new funding opportunity</p>
            </Link>
            <Link
              to="/admin/challenges"
              className="rounded-lg border-2 border-gray-200 p-4 hover:border-indigo-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Create Challenge</h3>
              <p className="mt-1 text-sm text-gray-600">Add a new corporate challenge</p>
            </Link>
            <Link
              to="/admin/mentors"
              className="rounded-lg border-2 border-gray-200 p-4 hover:border-indigo-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Review Mentors</h3>
              <p className="mt-1 text-sm text-gray-600">Approve pending applications</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
