import { AdminLayout } from '../../components/admin/AdminLayout';
import { Calendar, Plus } from 'lucide-react';

export default function AdminSpotlightPage() {
  return (
    <AdminLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Founder of the Day Scheduler</h1>
            <p className="mt-2 text-gray-600">Schedule spotlight founders</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
            <Plus className="h-5 w-5" />
            Schedule Spotlight
          </button>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <div className="mb-6 flex items-center gap-3 text-gray-600">
            <Calendar className="h-6 w-6" />
            <p className="text-lg">Calendar view coming soon</p>
          </div>
          
          <p className="text-gray-600">
            Spotlight scheduler will be implemented here.
            <br />
            Features: Calendar view of scheduled spotlights, add new schedule (pick founder, date, one-liner), founder search/select from onboarded founders, edit/delete scheduled spotlights, conflict detection (one per day).
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
