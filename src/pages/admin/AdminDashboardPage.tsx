import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { TrendingUp, Award, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminGrantsApi } from '../../api/endpoints/admin/grants';
import { adminMentorsApi } from '../../api/endpoints/admin/mentors';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface DashboardStats {
  totalGrants: number;
  draftGrants: number;
  publishedGrants: number;
  expiredGrants: number;
  pendingMentors: number;
  approvedMentors: number;
  rejectedMentors: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);

      console.log('Fetching dashboard stats...');

      // Fetch counts for different statuses
      const [
        allGrants,
        draftGrants,
        publishedGrants,
        expiredGrants,
        pendingMentors,
        approvedMentors,
        rejectedMentors,
      ] = await Promise.all([
        adminGrantsApi.listGrants({ page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch all grants:', err);
          return null;
        }),
        adminGrantsApi.listGrants({ status: 'DRAFT', page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch draft grants:', err);
          return null;
        }),
        adminGrantsApi.listGrants({ status: 'PUBLISHED', page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch published grants:', err);
          return null;
        }),
        adminGrantsApi.listGrants({ status: 'EXPIRED', page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch expired grants:', err);
          return null;
        }),
        adminMentorsApi.listMentors({ status: 'PENDING', page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch pending mentors:', err);
          return null;
        }),
        adminMentorsApi.listMentors({ status: 'APPROVED', page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch approved mentors:', err);
          return null;
        }),
        adminMentorsApi.listMentors({ status: 'REJECTED', page: 0, size: 1 }).catch(err => {
          console.error('Failed to fetch rejected mentors:', err);
          return null;
        }),
      ]);

      console.log('Raw responses:', { allGrants, pendingMentors });

      // Helper to safely get count from response
      const getCount = (response: any): number => {
        if (!response) return 0;
        // Check different possible response structures
        if (response.page?.totalElements !== undefined) {
          return response.page.totalElements;
        }
        if (response.totalElements !== undefined) {
          return response.totalElements;
        }
        if (Array.isArray(response.content)) {
          return response.content.length;
        }
        if (Array.isArray(response)) {
          return response.length;
        }
        return 0;
      };

      const stats = {
        totalGrants: getCount(allGrants),
        draftGrants: getCount(draftGrants),
        publishedGrants: getCount(publishedGrants),
        expiredGrants: getCount(expiredGrants),
        pendingMentors: getCount(pendingMentors),
        approvedMentors: getCount(approvedMentors),
        rejectedMentors: getCount(rejectedMentors),
      };

      console.log('Dashboard stats calculated:', stats);
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { 
      label: 'Total Grants', 
      value: stats?.totalGrants || 0, 
      subtext: `${stats?.publishedGrants || 0} published, ${stats?.draftGrants || 0} draft`,
      icon: TrendingUp, 
      path: '/admin/grants', 
      color: 'bg-green-100 text-green-700' 
    },
    { 
      label: 'Pending Mentors', 
      value: stats?.pendingMentors || 0,
      subtext: `${stats?.approvedMentors || 0} approved total`,
      icon: Users, 
      path: '/admin/mentors', 
      color: 'bg-blue-100 text-blue-700' 
    },
    { 
      label: 'Published Grants', 
      value: stats?.publishedGrants || 0,
      subtext: 'Visible to founders',
      icon: TrendingUp, 
      path: '/admin/grants?status=PUBLISHED', 
      color: 'bg-emerald-100 text-emerald-700' 
    },
    { 
      label: 'Approved Mentors', 
      value: stats?.approvedMentors || 0,
      subtext: 'Visible to founders',
      icon: Users, 
      path: '/admin/mentors?status=APPROVED', 
      color: 'bg-purple-100 text-purple-700' 
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.path}
                className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </Link>
            );
          })}
        </div>

        {/* Breakdown Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Grants Breakdown */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Grants by Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published</span>
                <span className="text-sm font-semibold text-green-600">{stats?.publishedGrants || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Draft</span>
                <span className="text-sm font-semibold text-gray-600">{stats?.draftGrants || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expired</span>
                <span className="text-sm font-semibold text-red-600">{stats?.expiredGrants || 0}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-sm font-bold text-gray-900">{stats?.totalGrants || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mentors Breakdown */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Mentors by Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved</span>
                <span className="text-sm font-semibold text-green-600">{stats?.approvedMentors || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-semibold text-yellow-600">{stats?.pendingMentors || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="text-sm font-semibold text-red-600">{stats?.rejectedMentors || 0}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-sm font-bold text-gray-900">
                    {(stats?.approvedMentors || 0) + (stats?.pendingMentors || 0) + (stats?.rejectedMentors || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/admin/grants"
              className="rounded-lg border-2 border-gray-200 p-4 hover:border-indigo-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Grants</h3>
              <p className="mt-1 text-sm text-gray-600">View and manage all grants</p>
            </Link>
            <Link
              to="/admin/mentors"
              className="rounded-lg border-2 border-gray-200 p-4 hover:border-indigo-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Review Mentors</h3>
              <p className="mt-1 text-sm text-gray-600">
                {stats?.pendingMentors ? `${stats.pendingMentors} pending approval` : 'No pending applications'}
              </p>
            </Link>
            <Link
              to="/admin/challenges"
              className="rounded-lg border-2 border-gray-200 p-4 hover:border-indigo-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Challenges</h3>
              <p className="mt-1 text-sm text-gray-600">View and manage challenges</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
