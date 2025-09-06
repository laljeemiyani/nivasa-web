import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalCloseButton } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedResident, setSelectedResident] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchResidents();
  }, [page, search, statusFilter]);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      };
      const response = await adminAPI.getResidents(params);
      setResidents(response.data.data.residents);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (resident, status) => {
    setSelectedResident(resident);
    setActionStatus(status);
    setRejectionReason('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedResident(null);
    setActionStatus('');
    setRejectionReason('');
  };

  const handleStatusUpdate = async () => {
    if (actionStatus === 'rejected' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    setActionLoading(true);
    try {
      await adminAPI.updateResidentStatus(selectedResident._id, {
        status: actionStatus,
        rejectionReason: actionStatus === 'rejected' ? rejectionReason : undefined,
      });
      closeModal();
      fetchResidents();
    } catch (error) {
      console.error('Failed to update resident status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resident Management</h1>
        <p className="text-gray-600">Manage resident registrations and approvals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Residents</CardTitle>
          <CardDescription>View and manage all resident registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <Input
              type="text"
              placeholder="Search by name, email, wing, or flat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p>Loading residents...</p>
          ) : residents.length === 0 ? (
            <p>No residents found.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Wing</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Flat</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((resident) => (
                  <tr key={resident._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{resident.fullName}</td>
                    <td className="border border-gray-300 px-4 py-2">{resident.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{resident.wing}</td>
                    <td className="border border-gray-300 px-4 py-2">{resident.flatNumber}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Badge
                        variant={
                          resident.status === 'pending' ? 'warning' :
                          resident.status === 'approved' ? 'success' : 'error'
                        }
                      >
                        {resident.status}
                      </Badge>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      {resident.status === 'pending' && (
                        <>
                          <Button onClick={() => openModal(resident, 'approved')} variant="success" size="sm">
                            Approve
                          </Button>
                          <Button onClick={() => openModal(resident, 'rejected')} variant="error" size="sm">
                            Reject
                          </Button>
                        </>
                      )}
                      <Button onClick={() => openModal(resident, 'view')} variant="default" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Modal for Approve/Reject/View */}
      <Modal isOpen={modalOpen} onClose={closeModal} size="md">
        <ModalHeader>
          <ModalTitle>
            {actionStatus === 'approved' && 'Approve Resident'}
            {actionStatus === 'rejected' && 'Reject Resident'}
            {actionStatus === 'view' && 'Resident Details'}
          </ModalTitle>
          <ModalCloseButton onClick={closeModal} />
        </ModalHeader>
        <ModalBody>
          {actionStatus === 'view' && selectedResident && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedResident.fullName}</p>
              <p><strong>Email:</strong> {selectedResident.email}</p>
              <p><strong>Wing:</strong> {selectedResident.wing}</p>
              <p><strong>Flat:</strong> {selectedResident.flatNumber}</p>
              <p><strong>Status:</strong> {selectedResident.status}</p>
              {selectedResident.rejectionReason && (
                <p><strong>Rejection Reason:</strong> {selectedResident.rejectionReason}</p>
              )}
            </div>
          )}
          {(actionStatus === 'approved' || actionStatus === 'rejected') && (
            <>
              {actionStatus === 'rejected' && (
                <div className="mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                    Rejection Reason
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection"
                  />
                </div>
              )}
              <p>Are you sure you want to {actionStatus} this resident?</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleStatusUpdate} disabled={actionLoading} variant="primary">
            {actionLoading ? 'Processing...' : 'Confirm'}
          </Button>
          <Button onClick={closeModal} variant="secondary">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminResidents;
