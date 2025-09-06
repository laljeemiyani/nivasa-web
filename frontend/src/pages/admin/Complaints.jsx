import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle } from '../../components/ui/Modal';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [page, statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getComplaints({
        page,
        limit: 10,
        status: statusFilter || undefined,
        category: categoryFilter || undefined
      });

      setComplaints(response.data.data.complaints);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (complaint, status) => {
    setSelectedComplaint(complaint);
    setActionStatus(status);
    setAdminResponse(complaint.adminResponse || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
    setActionStatus('');
    setAdminResponse('');
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint) return;

    // Validate admin response for in_progress and resolved statuses
    if (['in_progress', 'resolved'].includes(actionStatus) && !adminResponse.trim()) {
      alert('Please provide a response for the resident');
      return;
    }

    setActionLoading(true);
    try {
      await adminAPI.updateComplaintStatus(selectedComplaint._id, {
        status: actionStatus,
        adminResponse
      });

      // Refresh complaints list
      await fetchComplaints();
      closeModal();
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await adminAPI.deleteComplaint(complaintId);
      await fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Failed to delete complaint');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600">Manage and resolve resident complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>View and manage all resident complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                className="border border-gray-300 rounded px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="categoryFilter"
                className="border border-gray-300 rounded px-3 py-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="security">Security</option>
                <option value="maintenance">Maintenance</option>
                <option value="noise">Noise</option>
                <option value="parking">Parking</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Resident</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{complaint.title}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {complaint.userId?.fullName || 'Unknown'}
                        <div className="text-xs text-gray-500">{complaint.userId?.wing}-{complaint.userId?.flatNumber}</div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">{complaint.category}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant={getPriorityBadgeVariant(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant={getStatusBadgeVariant(complaint.status)}>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 space-x-2">
                        <Button onClick={() => openModal(complaint, 'view')} variant="default" size="sm">
                          View
                        </Button>
                        {complaint.status === 'pending' && (
                          <Button onClick={() => openModal(complaint, 'in_progress')} variant="info" size="sm">
                            Process
                          </Button>
                        )}
                        {complaint.status === 'in_progress' && (
                          <Button onClick={() => openModal(complaint, 'resolved')} variant="success" size="sm">
                            Resolve
                          </Button>
                        )}
                        {complaint.status === 'resolved' && (
                          <Button onClick={() => openModal(complaint, 'closed')} variant="secondary" size="sm">
                            Close
                          </Button>
                        )}
                        <Button onClick={() => handleDelete(complaint._id)} variant="error" size="sm">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              size="sm"
            >
              Previous
            </Button>
            <span className="px-3 py-2 border border-gray-300 rounded">{page} / {totalPages}</span>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              size="sm"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for View/Update Status */}
      <Modal isOpen={modalOpen} onClose={closeModal} size="md">
        <ModalHeader>
          <ModalTitle>
            {actionStatus === 'view' && 'Complaint Details'}
            {actionStatus === 'in_progress' && 'Process Complaint'}
            {actionStatus === 'resolved' && 'Resolve Complaint'}
            {actionStatus === 'closed' && 'Close Complaint'}
          </ModalTitle>
          <ModalCloseButton onClick={closeModal} />
        </ModalHeader>
        <ModalBody>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>Title:</strong> {selectedComplaint.title}</p>
                <p><strong>Description:</strong> {selectedComplaint.description}</p>
                <p><strong>Category:</strong> <span className="capitalize">{selectedComplaint.category}</span></p>
                <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
                <p><strong>Status:</strong> {selectedComplaint.status.replace('_', ' ')}</p>
                <p><strong>Submitted by:</strong> {selectedComplaint.userId?.fullName} ({selectedComplaint.userId?.wing}-{selectedComplaint.userId?.flatNumber})</p>
                <p><strong>Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                {selectedComplaint.adminResponse && (
                  <p><strong>Admin Response:</strong> {selectedComplaint.adminResponse}</p>
                )}
              </div>

              {actionStatus !== 'view' && (
                <div className="mt-4">
                  <label htmlFor="adminResponse" className="block text-sm font-medium text-gray-700 mb-1">
                    Response to Resident
                  </label>
                  <textarea
                    id="adminResponse"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Enter your response to the resident"
                  />
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {actionStatus !== 'view' && (
            <Button onClick={handleStatusUpdate} disabled={actionLoading} variant="primary">
              {actionLoading ? 'Processing...' : 'Confirm'}
            </Button>
          )}
          <Button onClick={closeModal} variant="secondary">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminComplaints;
