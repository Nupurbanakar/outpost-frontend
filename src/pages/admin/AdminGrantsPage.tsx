import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { adminGrantsApi } from '../../api/endpoints/admin/grants';
import type { Grant } from '../../api/endpoints/grants';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { toast } from 'sonner';
import { useStages, useSectors } from '../../hooks';

export default function AdminGrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'EXPIRED'>('ALL');
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Edit modal state
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { stages } = useStages();
  const { sectors } = useSectors();

  useEffect(() => {
    fetchGrants();
  }, [statusFilter, currentPage]);

  const fetchGrants = async () => {
    try {
      setIsLoading(true);
      const response = await adminGrantsApi.listGrants({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage - 1, // Backend uses 0-indexed pages
        size: pageSize,
      });
      
      console.log('Grants response:', response);
      
      setGrants(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch grants:', error);
      toast.error('Failed to load grants');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await adminGrantsApi.publishGrant(id);
      toast.success('Grant published successfully');
      fetchGrants();
    } catch (error) {
      toast.error('Failed to publish grant');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await adminGrantsApi.unpublishGrant(id);
      toast.success('Grant unpublished');
      fetchGrants();
    } catch (error) {
      toast.error('Failed to unpublish grant');
    }
  };

  const handleExpire = async (id: string) => {
    try {
      await adminGrantsApi.expireGrant(id);
      toast.success('Grant marked as expired');
      fetchGrants();
    } catch (error) {
      toast.error('Failed to expire grant');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this grant? This action cannot be undone.')) {
      return;
    }

    try {
      await adminGrantsApi.deleteGrant(id);
      toast.success('Grant deleted');
      fetchGrants();
    } catch (error) {
      toast.error('Failed to delete grant');
    }
  };

  const handleEdit = async (grant: Grant) => {
    setEditingGrant(grant);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrant) return;

    try {
      setIsSaving(true);
      
      // Map Grant fields to AdminGrantUpdateRequest format
      const updateData = {
        name: editingGrant.title,
        issuingBody: editingGrant.issuingBody,
        issuingBodyType: editingGrant.issuingBodyType,
        type: editingGrant.type,
        summary: editingGrant.summary,
        deadline: editingGrant.deadline || undefined,
        sourceUrl: editingGrant.sourceUrl,
        amountMin: editingGrant.amount,
        amountMax: editingGrant.amount,
      };
      
      console.log('Updating grant ID:', editingGrant.id);
      console.log('Updating grant with data:', updateData);
      
      const response = await adminGrantsApi.updateGrant(editingGrant.id, updateData);
      console.log('Grant updated successfully. Response:', response);
      
      toast.success('Grant updated successfully');
      setIsEditModalOpen(false);
      setEditingGrant(null);
      
      // Force refresh the list
      await fetchGrants();
    } catch (error: any) {
      console.error('Failed to update grant:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(error.response?.data?.message || 'Failed to update grant');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setIsEditModalOpen(false);
      setEditingGrant(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PUBLISHED: 'bg-green-100 text-green-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-red-100 text-red-800',
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
            <h1 className="text-3xl font-bold text-gray-900">Grants Management</h1>
            <p className="mt-2 text-gray-600">
              {totalElements} total grants
            </p>
          </div>
          <button 
            onClick={() => toast.info('Create grant form coming soon')}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Create Grant
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(['ALL', 'DRAFT', 'PUBLISHED', 'EXPIRED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Grants List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : grants.length === 0 ? (
          <div className="rounded-lg bg-white p-12 shadow text-center">
            <p className="text-gray-600">No grants found. Create your first grant to get started.</p>
          </div>
        ) : (
          <div className="rounded-lg bg-white shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grant Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grants.map((grant) => (
                  <tr key={grant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{grant.title}</div>
                      <div className="text-sm text-gray-500">{grant.issuingBody}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {grant.type}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(grant.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {grant.amountMin && grant.amountMax 
                        ? `₹${(grant.amountMin / 100000).toFixed(0)}L - ₹${(grant.amountMax / 100000).toFixed(0)}L`
                        : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {grant.deadline || 'Rolling'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {grant.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(grant.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Publish"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        {grant.status === 'PUBLISHED' && (
                          <>
                            <button
                              onClick={() => handleUnpublish(grant.id)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Unpublish"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleExpire(grant.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Mark as Expired"
                            >
                              <Clock className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(grant)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(grant.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      {isEditModalOpen && editingGrant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Grant</h2>
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
                    value={editingGrant.title}
                    onChange={(e) => setEditingGrant({ ...editingGrant, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editingGrant.summary}
                    onChange={(e) => setEditingGrant({ ...editingGrant, summary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Issuing Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Body *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGrant.issuingBody}
                    onChange={(e) => setEditingGrant({ ...editingGrant, issuingBody: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Amount Band */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Min (₹)
                    </label>
                    <input
                      type="number"
                      value={editingGrant.amount || ''}
                      onChange={(e) => setEditingGrant({ 
                        ...editingGrant, 
                        amount: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      placeholder="1000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Text
                    </label>
                    <input
                      type="text"
                      value={editingGrant.amountBand || ''}
                      onChange={(e) => setEditingGrant({ ...editingGrant, amountBand: e.target.value })}
                      placeholder="Up to ₹10L"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editingGrant.deadline || ''}
                    onChange={(e) => setEditingGrant({ ...editingGrant, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Source URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingGrant.sourceUrl}
                    onChange={(e) => setEditingGrant({ ...editingGrant, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
