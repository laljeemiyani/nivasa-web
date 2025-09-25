import {useEffect, useState} from 'react';
import {adminAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card';
import {Badge} from '../../components/ui/Badge';
import {Button} from '../../components/ui/Button';
import {Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle} from '../../components/ui/Modal';
import {Input} from '../../components/ui/Input';
import {Dropdown, DropdownItem, DropdownSeparator} from '../../components/ui/Dropdown';
import {Check, ChevronLeft, ChevronRight, Eye, MoreVertical, Search, Users, X} from 'lucide-react';

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
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
          {/* Header */}
          <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-6 w-6 text-primary"/>
                  <h1 className="text-2xl font-bold text-gray-900">Resident Management</h1>
              </div>
              <p className="text-gray-600">Manage resident registrations and approvals</p>
          </div>

          <Card>
              <CardHeader>
                  <CardTitle>Residents</CardTitle>
                  <CardDescription>View and manage all resident registrations</CardDescription>
              </CardHeader>
              <CardContent>
                  {/* Search and Filter Controls */}
                  <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                          <Input
                              type="text"
                              placeholder="Search by name, email, wing, or flat"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="pl-10"
                          />
                      </div>
                      <select
                          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary min-w-[140px]"
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
                      <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading residents...</span>
                      </div>
                  ) : residents.length === 0 ? (
                      <div className="text-center py-12">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                          <p className="text-gray-500">No residents found.</p>
                      </div>
                  ) : (
                      <>
                          {/* Responsive Table */}
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                              <table className="w-full table-auto">
                                  <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Wing</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Flat</th>
                                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                                  </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                  {residents.map((resident, index) => (
                                      <tr
                                          key={resident._id}
                                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                          }`}
                                      >
                                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                              {resident.fullName}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-600">
                                              {resident.email}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-600">
                          <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {resident.wing}
                          </span>
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-600">
                                              {resident.flatNumber}
                                          </td>
                                          <td className="px-4 py-3">
                                              <Badge
                                                  variant={
                                                      resident.status === 'pending' ? 'warning' :
                                                          resident.status === 'approved' ? 'success' : 'destructive'
                                                  }
                                                  className="capitalize"
                                              >
                                                  {resident.status}
                                              </Badge>
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                              <Dropdown
                                                  trigger={
                                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                          <MoreVertical className="h-4 w-4"/>
                                                      </Button>
                                                  }
                                                  align="right"
                                                  width="sm"
                                              >
                                                  {resident.status === 'pending' && (
                                                      <>
                                                          <DropdownItem
                                                              onClick={() => openModal(resident, 'approved')}
                                                              className="text-green-600 hover:bg-green-50"
                                                          >
                                                              <Check className="mr-2 h-4 w-4"/>
                                                              Approve
                                                          </DropdownItem>
                                                          <DropdownItem
                                                              onClick={() => openModal(resident, 'rejected')}
                                                              className="text-red-600 hover:bg-red-50"
                                                          >
                                                              <X className="mr-2 h-4 w-4"/>
                                                              Reject
                                                          </DropdownItem>
                                                          <DropdownSeparator/>
                                                      </>
                                                  )}
                                                  <DropdownItem
                                                      onClick={() => openModal(resident, 'view')}
                                                      className="text-blue-600 hover:bg-blue-50"
                                                  >
                                                      <Eye className="mr-2 h-4 w-4"/>
                                                      View Details
                                                  </DropdownItem>
                                              </Dropdown>
                                          </td>
                                      </tr>
                                  ))}
                                  </tbody>
                              </table>
                          </div>

                          {/* Improved Pagination */}
                          {totalPages > 1 && (
                              <div className="flex items-center justify-between mt-6">
                                  <div className="text-sm text-gray-500">
                                      Page {page} of {totalPages}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                          disabled={page === 1}
                                          className="flex items-center gap-1"
                                      >
                                          <ChevronLeft className="h-4 w-4"/>
                                          Previous
                                      </Button>

                                      {/* Page Numbers */}
                                      <div className="flex items-center space-x-1">
                                          {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                              const pageNum = page - 2 + i;
                                              if (pageNum < 1 || pageNum > totalPages) return null;

                                              return (
                                                  <Button
                                                      key={pageNum}
                                                      variant={page === pageNum ? "default" : "outline"}
                                                      size="sm"
                                                      onClick={() => setPage(pageNum)}
                                                      className="w-8 h-8 p-0"
                                                  >
                                                      {pageNum}
                                                  </Button>
                                              );
                                          })}
                                      </div>

                                      <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                          disabled={page === totalPages}
                                          className="flex items-center gap-1"
                                      >
                                          Next
                                          <ChevronRight className="h-4 w-4"/>
                                      </Button>
                                  </div>
                              </div>
                          )}
                      </>
                  )}
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
                  <ModalCloseButton onClick={closeModal}/>
              </ModalHeader>
              <ModalBody>
                  {actionStatus === 'view' && selectedResident && (
                      <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-sm font-medium text-gray-500">Name</label>
                                  <p className="text-sm text-gray-900">{selectedResident.fullName}</p>
                              </div>
                              <div>
                                  <label className="text-sm font-medium text-gray-500">Email</label>
                                  <p className="text-sm text-gray-900">{selectedResident.email}</p>
                              </div>
                              <div>
                                  <label className="text-sm font-medium text-gray-500">Wing</label>
                                  <p className="text-sm text-gray-900">{selectedResident.wing}</p>
                              </div>
                              <div>
                                  <label className="text-sm font-medium text-gray-500">Flat</label>
                                  <p className="text-sm text-gray-900">{selectedResident.flatNumber}</p>
                              </div>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-500">Status</label>
                              <div className="mt-1">
                                  <Badge
                                      variant={
                                          selectedResident.status === 'pending' ? 'warning' :
                                              selectedResident.status === 'approved' ? 'success' : 'destructive'
                                      }
                                      className="capitalize"
                                  >
                                      {selectedResident.status}
                                  </Badge>
                              </div>
                          </div>
                          {selectedResident.rejectionReason && (
                              <div>
                                  <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                                  <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                                      {selectedResident.rejectionReason}
                                  </p>
                              </div>
                          )}
                      </div>
                  )}
                  {(actionStatus === 'approved' || actionStatus === 'rejected') && (
                      <div className="space-y-4">
                          {actionStatus === 'rejected' && (
                              <div>
                                  <label htmlFor="rejectionReason"
                                         className="block text-sm font-medium text-gray-700 mb-2">
                                      Rejection Reason *
                                  </label>
                                  <textarea
                                      id="rejectionReason"
                                      rows={3}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      placeholder="Enter reason for rejection"
                                  />
                              </div>
                          )}
                          <div className="bg-gray-50 p-4 rounded-lg border">
                              <p className="text-sm text-gray-700">
                                  Are you sure you want to <strong
                                  className="text-gray-900">{actionStatus}</strong> this resident?
                              </p>
                          </div>
                      </div>
                  )}
              </ModalBody>
              <ModalFooter>
                  {actionStatus !== 'view' && (
                      <Button
                          onClick={handleStatusUpdate}
                          disabled={actionLoading}
                          variant={actionStatus === 'rejected' ? 'destructive' : 'default'}
                          className="flex items-center gap-2"
                      >
                          {actionLoading ? (
                              <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Processing...
                              </>
                          ) : (
                              <>
                                  {actionStatus === 'approved' && <Check className="h-4 w-4"/>}
                                  {actionStatus === 'rejected' && <X className="h-4 w-4"/>}
                                  Confirm {actionStatus === 'approved' ? 'Approval' : 'Rejection'}
                              </>
                          )}
                      </Button>
                  )}
                  <Button onClick={closeModal} variant="outline">
                      {actionStatus === 'view' ? 'Close' : 'Cancel'}
                  </Button>
              </ModalFooter>
          </Modal>
      </div>
  );
};

export default AdminResidents;