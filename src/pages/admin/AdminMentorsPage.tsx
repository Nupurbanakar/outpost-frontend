import { AdminLayout } from '../../components/admin/AdminLayout';
import { UserCheck, UserX } from 'lucide-react';

export default function AdminMentorsPage() {
  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Approval Queue</h1>
          <p className="mt-2 text-gray-600">Review and approve mentor applications</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <button className="rounded-lg border-2 border-indigo-600 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            Pending
          </button>
          <button className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Approved
          </button>
          <button className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Rejected
          </button>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <p className="text-gray-600 mb-4">
            Mentor approval queue will be implemented here.
            <br />
            Features: List with status filter, pending queue sorted oldest first, view application details, approve/reject actions, rejection reason required.
          </p>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              <UserCheck className="h-4 w-4" />
              Approve
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              <UserX className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
