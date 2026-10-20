import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus } from 'lucide-react';

export default function AdminChallengesPage() {
  return (
    <AdminLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Challenges Management</h1>
            <p className="mt-2 text-gray-600">Manage corporate challenges</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
            <Plus className="h-5 w-5" />
            Create Challenge
          </button>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <p className="text-gray-600">
            Challenges CRUD interface will be implemented here.
            <br />
            Features: List all challenges, status filters, create/edit forms, close action, publish/unpublish, conditional detail fields validation.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
