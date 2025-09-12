import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, create, edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    expiryDate: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [page, categoryFilter, priorityFilter]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getNotices({
        page,
        limit: 10,
        category: categoryFilter || undefined,
        priority: priorityFilter || undefined
      });

      setNotices(response.data.data.notices);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      expiryDate: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (notice) => {
    setModalMode('edit');
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      priority: notice.priority,
      expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : ''
    });
    setModalOpen(true);
  };

  const openViewModal = (notice) => {
    setModalMode('view');
    setSelectedNotice(notice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotice(null);
    setModalMode('view');
    setFormData({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      expiryDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setActionLoading(true);
    try {
      if (modalMode === 'create') {
        await adminAPI.createNotice(formData);
      } else if (modalMode === 'edit' && selectedNotice) {
        await adminAPI.updateNotice(selectedNotice._id, formData);
      }

      // Refresh notices list
      await fetchNotices();
      closeModal();
    } catch (error) {
      console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} notice:`, error);
      alert(`Failed to ${modalMode === 'create' ? 'create' : 'update'} notice`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      await adminAPI.deleteNotice(noticeId);
      await fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('Failed to delete notice');
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'info';
      case 'high': return 'warning';
      default: return 'default';
    }
  };

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case 'general': return 'default';
      case 'maintenance': return 'info';
      case 'security': return 'warning';
      case 'event': return 'success';
      case 'payment': return 'error';
      case 'other': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
          <p className="text-gray-600">Create and manage society notices</p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          Create Notice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notices</CardTitle>
          <CardDescription>Create, edit, and manage society notices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
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
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
                <option value="event">Event</option>
                <option value="payment">Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Priority
              </label>
              <select
                id="priorityFilter"
                className="border border-gray-300 rounded px-3 py-2"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading notices...</p>
          ) : notices.length === 0 ? (
            <p>No notices found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Created By</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Expiry Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{notice.title}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant={getCategoryBadgeVariant(notice.category)}>
                          {notice.category}
                        </Badge>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant={getPriorityBadgeVariant(notice.priority)}>
                          {notice.priority}
                        </Badge>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {notice.userId?.fullName || 'Admin'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatDate(notice.expiryDate)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 space-x-2">
                        <Button onClick={() => openViewModal(notice)} variant="default" size="sm">
                          View
                        </Button>
                        <Button onClick={() => openEditModal(notice)} variant="info" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(notice._id)} variant="error" size="sm">
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

      {/* Modal for Create/Edit/View Notice */}
      <Modal isOpen={modalOpen} onClose={closeModal} size="md">
        <ModalHeader>
          <ModalTitle>
            {modalMode === 'create' && 'Create Notice'}
            {modalMode === 'edit' && 'Edit Notice'}
            {modalMode === 'view' && 'Notice Details'}
          </ModalTitle>
          <ModalCloseButton onClick={closeModal} />
        </ModalHeader>
        <ModalBody>
          {modalMode === 'view' && selectedNotice ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>Title:</strong> {selectedNotice.title}</p>
                <p><strong>Description:</strong> {selectedNotice.description}</p>
                <p><strong>Category:</strong> <span className="capitalize">{selectedNotice.category}</span></p>
                <p><strong>Priority:</strong> {selectedNotice.priority}</p>
                <p><strong>Created By:</strong> {selectedNotice.userId?.fullName || 'Admin'}</p>
                <p><strong>Created At:</strong> {new Date(selectedNotice.createdAt).toLocaleString()}</p>
                <p><strong>Expiry Date:</strong> {formatDate(selectedNotice.expiryDate)}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter notice title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter notice description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="event">Event</option>
                    <option value="payment">Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <Input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          {modalMode !== 'view' && (
            <Button onClick={handleSubmit} disabled={actionLoading} variant="primary">
              {actionLoading ? 'Processing...' : modalMode === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
          <Button onClick={closeModal} variant="secondary">
            {modalMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminNotices;
