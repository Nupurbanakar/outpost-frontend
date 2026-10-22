import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { UserCheck, UserX, Trash2, ExternalLink } from 'lucide-react';
import { adminMentorsApi } from '../../api/endpoints/admin/mentors';
import type { Mentor } from '../../api/endpoints/mentors';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { toast } from 'sonner';

type MentorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<MentorStatus>('PENDING');
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    fetchMentors();
  }, [statusFilter, currentPage]);

  const fetchMentors = async () => {
    try {
      setIsLoading(true);
      
      console.log('📋 Fetching mentors:', { statusFilter, page: currentPage - 1, size: pageSize });
      
      const response = await adminMentorsApi.listMentors({
        status: statusFilter,
        page: currentPage - 1, // Backend uses 0-indexed pages
        size: pageSize,
      });
      
      console.log('✅ Mentors response:', response);
      
      setMentors(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error: any) {
      console.error('❌ Failed to fetch mentors:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error('Failed to load mentors: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this mentor application? The mentor will become visible to founders.')) {
      return;
    }

    try {
      await adminMentorsApi.approveMentor(id);
      toast.success('Mentor approved successfully');
      fetchMentors();
    } catch (error) {
      toast.error('Failed to approve mentor');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this mentor application? This action cannot be undone.')) {
      return;
    }

    try {
      await adminMentorsApi.rejectMentor(id);
      toast.success('Mentor application rejected');
      fetchMentors();
    } catch (error) {
      toast.error('Failed to reject mentor');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mentor? This action cannot be undone.')) {
      return;
    }

    try {
      await adminMentorsApi.deleteMentor(id);
      toast.success('Mentor deleted');
      fetchMentors();
    } catch (error) {
      toast.error('Failed to delete mentor');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
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
            <h1 className="text-3xl font-bold text-gray-900">Mentor Management</h1>
            <p className="mt-2 text-gray-600">
              {totalElements} {statusFilter.toLowerCase()} mentor{totalElements !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
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

        {/* Mentors List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : mentors.length === 0 ? (
          <div className="rounded-lg bg-white p-12 shadow text-center">
            <p className="text-gray-600">
              No {statusFilter.toLowerCase()} mentors found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="rounded-lg bg-white shadow p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Mentor Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                      {getStatusBadge(mentor.status)}
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-2">{mentor.headline}</p>
                    <p className="text-sm text-gray-600 mb-3">{mentor.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {mentor.expertise.map((exp) => (
                        <span key={exp} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {exp}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{mentor.email}</span>
                      {mentor.calComUrl && (
                        <a
                          href={mentor.calComUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                        >
                          Cal.com <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {mentor.linkedInUrl && (
                        <a
                          href={mentor.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                        >
                          LinkedIn <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {mentor.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(mentor.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                          title="Approve"
                        >
                          <UserCheck className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(mentor.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                          title="Reject"
                        >
                          <UserX className="h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {mentor.status === 'APPROVED' && (
                      <button
                        onClick={() => handleDelete(mentor.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                    {mentor.status === 'REJECTED' && (
                      <button
                        onClick={() => handleDelete(mentor.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
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
    </AdminLayout>
  );
}
