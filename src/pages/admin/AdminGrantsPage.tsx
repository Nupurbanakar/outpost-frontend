import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus } from 'lucide-react';

export default function AdminGrantsPage() {
  return (
    <AdminLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grants Management</h1>
            <p className="mt-2 text-gray-600">Manage funding opportunities</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
            <Plus className="h-5 w-5" />
            Create Grant
          </button>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <p className="text-gray-600">
            Grants CRUD interface will be implemented here.
            <br />
            Features: List all grants (published/draft/expired), status filters, create/edit forms, publish/unpublish/expire actions, delete with confirmation.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
