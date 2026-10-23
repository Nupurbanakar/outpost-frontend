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

  // Edit/Create modal state
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { sectors } = useSectors();

  useEffect(() => {
    fetchChallenges();
  }, [statusFilter, currentPage]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      
      console.log('📋 [AdminChallengesPage] Fetching challenges with filters:', {
        statusFilter,
        statusToSend: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage - 1,
        size: pageSize,
      });
      
      const response = await adminChallengesApi.listChallenges({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage - 1, // Backend uses 0-indexed pages
        size: pageSize,
      });
      
      console.log('📋 [AdminChallengesPage] Challenges response:', response);
      
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
    console.log('🟢 [handleOpen] Starting - Challenge ID:', id);
    try {
      console.log('🟢 [handleOpen] Calling API to open challenge...');
      await adminChallengesApi.openChallenge(id);
      console.log('🟢 [handleOpen] ✅ API call successful');
      toast.success('Challenge opened successfully');
      console.log('🟢 [handleOpen] Refreshing challenges list...');
      await fetchChallenges();
      console.log('🟢 [handleOpen] ✅ Complete');
    } catch (error: any) {
      console.error('🟢 [handleOpen] ❌ Failed:', error);
      console.error('🟢 [handleOpen] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMsg = error.response?.data?.message || 'Failed to open challenge';
      toast.error(errorMsg);
    }
  };

  const handleClose = async (id: string) => {
    console.log('🔴 [handleClose] Starting - Challenge ID:', id);
    try {
      console.log('🔴 [handleClose] Calling API to close challenge...');
      await adminChallengesApi.closeChallenge(id);
      console.log('🔴 [handleClose] ✅ API call successful');
      toast.success('Challenge closed');
      console.log('🔴 [handleClose] Refreshing challenges list...');
      await fetchChallenges();
      console.log('🔴 [handleClose] ✅ Complete');
    } catch (error: any) {
      console.error('🔴 [handleClose] ❌ Failed:', error);
      console.error('🔴 [handleClose] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMsg = error.response?.data?.message || 'Failed to close challenge';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('🗑️ [handleDelete] Starting - Challenge ID:', id);
    
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      console.log('🗑️ [handleDelete] User cancelled deletion');
      return;
    }

    try {
      console.log('🗑️ [handleDelete] Calling API to delete challenge...');
      await adminChallengesApi.deleteChallenge(id);
      console.log('🗑️ [handleDelete] ✅ API call successful');
      toast.success('Challenge deleted');
      console.log('🗑️ [handleDelete] Refreshing challenges list...');
      await fetchChallenges();
      console.log('🗑️ [handleDelete] ✅ Complete');
    } catch (error: any) {
      console.error('🗑️ [handleDelete] ❌ Failed:', error);
      console.error('🗑️ [handleDelete] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMsg = error.response?.data?.message || 'Failed to delete challenge';
      toast.error(errorMsg);
    }
  };

  const handleCreateNew = () => {
    console.log('➕ [handleCreateNew] Creating new challenge template');
    
    // Create empty challenge template
    const newChallenge: Challenge = {
      id: '',
      title: '',
      corporateName: '',
      corporateLogo: '',
      theme: '',
      deadline: '',
      problemStatement: '',
      whatTheyAreLookingFor: '',
      eligibilityCriteria: '',
      timeline: '',
      offerType: undefined,
      applyUrl: '',
      status: 'CLOSED' as const,
      hasDetail: false,
    };
    
    console.log('➕ [handleCreateNew] New challenge template:', newChallenge);
    
    setEditingChallenge(newChallenge);
    console.log('➕ [handleCreateNew] editingChallenge state updated');
    
    setIsCreateMode(true);
    console.log('➕ [handleCreateNew] isCreateMode set to true');
    
    setIsEditModalOpen(true);
    console.log('➕ [handleCreateNew] ✅ Modal opened - ready to create challenge');
  };

  const handleEdit = (challenge: Challenge) => {
    console.log('✏️ [handleEdit] Starting edit for challenge:', {
      id: challenge.id,
      title: challenge.title,
      status: challenge.status,
      fullChallenge: challenge,
    });
    
    setEditingChallenge(challenge);
    console.log('✏️ [handleEdit] editingChallenge state updated');
    
    setIsCreateMode(false);
    console.log('✏️ [handleEdit] isCreateMode set to false');
    
    setIsEditModalOpen(true);
    console.log('✏️ [handleEdit] Modal opened - isEditModalOpen set to true');
    console.log('✏️ [handleEdit] ✅ Complete - Modal should now be visible');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('💾 [handleSaveEdit] Form submitted');
    console.log('💾 [handleSaveEdit] isCreateMode:', isCreateMode);
    console.log('💾 [handleSaveEdit] editingChallenge:', editingChallenge);
    
    if (!editingChallenge) {
      console.error('💾 [handleSaveEdit] ❌ No editingChallenge found - aborting');
      return;
    }

    try {
      setIsSaving(true);
      console.log('💾 [handleSaveEdit] isSaving set to true');
      
      const requestData = {
        title: editingChallenge.title,
        corporateName: editingChallenge.corporateName,
        corporateLogoUrl: editingChallenge.corporateLogo || '', // Backend expects corporateLogoUrl and it's required
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
      
      console.log('💾 [handleSaveEdit] Request data prepared:', requestData);
      
      if (isCreateMode) {
        console.log('💾 [handleSaveEdit] CREATE MODE - Calling createChallenge API');
        const response = await adminChallengesApi.createChallenge(requestData);
        console.log('💾 [handleSaveEdit] ✅ Create successful - Response:', response);
        toast.success('Challenge created successfully');
      } else {
        console.log('💾 [handleSaveEdit] EDIT MODE - Calling updateChallenge API');
        console.log('💾 [handleSaveEdit] Challenge ID:', editingChallenge.id);
        const response = await adminChallengesApi.updateChallenge(editingChallenge.id, requestData);
        console.log('💾 [handleSaveEdit] ✅ Update successful - Response:', response);
        toast.success('Challenge updated successfully');
      }
      
      console.log('💾 [handleSaveEdit] Closing modal and resetting state...');
      setIsEditModalOpen(false);
      setEditingChallenge(null);
      setIsCreateMode(false);
      
      // Reset to first page if we created a new challenge
      if (isCreateMode) {
        console.log('💾 [handleSaveEdit] Resetting to page 1 (new challenge created)');
        setCurrentPage(1);
      }
      
      console.log('💾 [handleSaveEdit] Refreshing challenges list...');
      await fetchChallenges();
      console.log('💾 [handleSaveEdit] ✅ Complete - all state updated and list refreshed');
    } catch (error: any) {
      console.error(`💾 [handleSaveEdit] ❌ Failed to ${isCreateMode ? 'create' : 'update'} challenge:`, error);
      console.error('💾 [handleSaveEdit] Error message:', error.message);
      console.error('💾 [handleSaveEdit] Error response data:', error.response?.data);
      console.error('💾 [handleSaveEdit] Error status:', error.response?.status);
      console.error('💾 [handleSaveEdit] Error headers:', error.response?.headers);
      
      // Log validation errors if present
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        console.error('🚨 VALIDATION ERRORS:');
        error.response.data.errors.forEach((err: any, index: number) => {
          console.error(`   ${index + 1}. Field: "${err.field}", Message: "${err.message}", Rejected Value: "${err.rejectedValue}"`);
        });
      }
      
      const errorMsg = error.response?.data?.message || `Failed to ${isCreateMode ? 'create' : 'update'} challenge`;
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
      console.log('💾 [handleSaveEdit] isSaving set to false');
    }
  };

  const handleCloseModal = () => {
    console.log('❌ [handleCloseModal] Attempting to close modal');
    console.log('❌ [handleCloseModal] isSaving:', isSaving);
    
    if (!isSaving) {
      console.log('❌ [handleCloseModal] Not saving - closing modal and resetting state');
      setIsEditModalOpen(false);
      setEditingChallenge(null);
      setIsCreateMode(false);
      console.log('❌ [handleCloseModal] ✅ Modal closed and state reset');
    } else {
      console.log('❌ [handleCloseModal] ⚠️ Cannot close - save in progress');
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
            onClick={handleCreateNew}
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCreateMode ? 'Create Challenge' : 'Edit Challenge'}
                </h2>
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
                    onChange={(e) => {
                      console.log('📝 [Form Input] Title changed:', e.target.value);
                      setEditingChallenge({ ...editingChallenge, title: e.target.value });
                    }}
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
                      console.log('📝 [Form Input] Sector changed:', e.target.value);
                      const selectedSector = sectors.find(s => s.id === e.target.value);
                      console.log('📝 [Form Input] Selected sector object:', selectedSector);
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
                    {isSaving 
                      ? (isCreateMode ? 'Creating...' : 'Saving...') 
                      : (isCreateMode ? 'Create' : 'Save Changes')
                    }
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
