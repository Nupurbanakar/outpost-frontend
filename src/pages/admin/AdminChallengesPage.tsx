import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import { adminChallengesApi } from '../../api/endpoints/admin/challenges';
import type { Challenge } from '../../api/endpoints/challenges';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { toast } from 'sonner';
import { useSectors } from '../../hooks';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Edit modal state
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { sectors } = useSectors();

  useEffect(() => {
    fetchChallenges();
  }, [statusFilter, currentPage]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const response = await adminChallengesApi.listChallenges({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage - 1, // Backend uses 0-indexed pages
        size: pageSize,
      });
      
      console.log('Challenges response:', response);
      
      setChallenges(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = async (id: string) => {
    try {
      console.log('Opening challenge:', id);
      await adminChallengesApi.openChallenge(id);
      console.log('Challenge opened successfully');
      toast.success('Challenge opened successfully');
      await fetchChallenges();
    } catch (error: any) {
      console.error('Failed to open challenge:', error);
      toast.error('Failed to open challenge');
    }
  };

  const handleClose = async (id: string) => {
    try {
      console.log('Closing challenge:', id);
      await adminChallengesApi.closeChallenge(id);
      console.log('Challenge closed successfully');
      toast.success('Challenge closed');
      await fetchChallenges();
    } catch (error: any) {
      console.error('Failed to close challenge:', error);
      toast.error('Failed to close challenge');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return;
    }

    try {
      await adminChallengesApi.deleteChallenge(id);
      toast.success('Challenge deleted');
      fetchChallenges();
    } catch (error) {
      toast.error('Failed to delete challenge');
    }
  };

  const handleEdit = async (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;

    try {
      setIsSaving(true);
      
      const updateData = {
        title: editingChallenge.title,
        corporateName: editingChallenge.corporateName,
        corporateLogo: editingChallenge.corporateLogo,
        sectorId: editingChallenge.sector?.id,
        theme: editingChallenge.theme,
        deadline: editingChallenge.deadline,
        problemStatement: editingChallenge.problemStatement,
        whatTheyAreLookingFor: editingChallenge.whatTheyAreLookingFor,
        eligibilityCriteria: editingChallenge.eligibilityCriteria,
        timeline: editingChallenge.timeline,
        offerType: editingChallenge.offerType,
        applyUrl: editingChallenge.applyUrl,
      };
      
      console.log('Updating challenge ID:', editingChallenge.id);
      console.log('Updating challenge with data:', updateData);
      
      const response = await adminChallengesApi.updateChallenge(editingChallenge.id, updateData);
      console.log('Challenge updated successfully. Response:', response);
      
      toast.success('Challenge updated successfully');
      setIsEditModalOpen(false);
      setEditingChallenge(null);
      
      await fetchChallenges();
    } catch (error: any) {
      console.error('Failed to update challenge:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(error.response?.data?.message || 'Failed to update challenge');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setIsEditModalOpen(false);
      setEditingChallenge(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Challenges Management</h1>
            <p className="mt-2 text-gray-600">
              {totalElements} total challenges
            </p>
          </div>
          <button 
            onClick={() => toast.info('Create challenge form coming soon')}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
          >
            <Plus className="h-5 w-5" />
            Create Challenge
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(['ALL', 'OPEN', 'CLOSED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                statusFilter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Challenges List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="rounded-lg bg-white p-12 shadow text-center">
            <p className="text-gray-600">No challenges found. Create your first challenge to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {challenge.corporateName}
                    </p>
                  </div>
                  {getStatusBadge(challenge.status)}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {challenge.sector && (
                    <div className="text-sm">
                      <span className="text-gray-500">Sector:</span>
                      <span className="ml-2 text-gray-900">{challenge.sector.name}</span>
                    </div>
                  )}
                  {challenge.theme && (
                    <div className="text-sm">
                      <span className="text-gray-500">Theme:</span>
                      <span className="ml-2 text-gray-900">{challenge.theme}</span>
                    </div>
                  )}
                  {challenge.deadline && (
                    <div className="text-sm">
                      <span className="text-gray-500">Deadline:</span>
                      <span className="ml-2 text-gray-900">{challenge.deadline}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {challenge.status === 'CLOSED' && (
                    <button
                      onClick={() => handleOpen(challenge.id)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-900 text-sm"
                      title="Open"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Open
                    </button>
                  )}
                  {challenge.status === 'OPEN' && (
                    <button
                      onClick={() => handleClose(challenge.id)}
                      className="flex items-center gap-1 text-orange-600 hover:text-orange-900 text-sm"
                      title="Close"
                    >
                      <XCircle className="h-4 w-4" />
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(challenge)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-900 text-sm"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-900 text-sm ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalElements > pageSize && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {Math.ceil(totalElements / pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= Math.ceil(totalElements / pageSize)}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Challenge</h2>
                <button
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingChallenge.title}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Corporate Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corporate Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingChallenge.corporateName}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, corporateName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Corporate Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corporate Logo URL
                  </label>
                  <input
                    type="url"
                    value={editingChallenge.corporateLogo || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, corporateLogo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector
                  </label>
                  <select
                    value={editingChallenge.sector?.id || ''}
                    onChange={(e) => {
                      const selectedSector = sectors.find(s => s.id === e.target.value);
                      setEditingChallenge({ 
                        ...editingChallenge, 
                        sector: selectedSector ? { id: selectedSector.id, name: selectedSector.name } : undefined
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select sector</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <input
                    type="text"
                    value={editingChallenge.theme || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, theme: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editingChallenge.deadline || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Problem Statement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={4}
                    value={editingChallenge.problemStatement || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, problemStatement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* What They're Looking For */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What They're Looking For
                  </label>
                  <textarea
                    rows={3}
                    value={editingChallenge.whatTheyAreLookingFor || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, whatTheyAreLookingFor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eligibility Criteria
                  </label>
                  <textarea
                    rows={3}
                    value={editingChallenge.eligibilityCriteria || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, eligibilityCriteria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={editingChallenge.timeline || ''}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, timeline: e.target.value })}
                    placeholder="e.g., 6 months"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Offer Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Type
                  </label>
                  <select
                    value={editingChallenge.offerType || ''}
                    onChange={(e) => setEditingChallenge({ 
                      ...editingChallenge, 
                      offerType: e.target.value as 'PILOT' | 'POC' | 'PARTNERSHIP' | undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select offer type</option>
                    <option value="PILOT">Pilot</option>
                    <option value="POC">Proof of Concept</option>
                    <option value="PARTNERSHIP">Partnership</option>
                  </select>
                </div>

                {/* Apply URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apply URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingChallenge.applyUrl}
                    onChange={(e) => setEditingChallenge({ ...editingChallenge, applyUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSaving}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
