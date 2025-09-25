import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast';
import {adminAPI} from '../../services/api';
import {Card, CardContent} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {Badge} from '../../components/ui/Badge';
import {Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle} from '../../components/ui/Modal';
import {Input} from '../../components/ui/Input';
import {ChevronLeft, ChevronRight, Edit, Eye, Plus, Trash2} from 'lucide-react';

const AdminNotices = () => {
    const {toast} = useToast();
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
                priority: priorityFilter || undefined,
            });

            const resData = response.data.data;

            // Handle the API response based on its structure
            if (Array.isArray(resData)) {
                setNotices(resData);
                setTotalPages(1);
            } else {
                setNotices(resData.notices || resData.items || []);
                setTotalPages(resData.pagination?.totalPages || resData.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
            toast({
                title: "Error",
                description: "Failed to load notices",
                variant: "destructive",
            });
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
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields',
                variant: 'destructive'
            });
            return;
        }

        setActionLoading(true);
        try {
            if (modalMode === 'create') {
                await adminAPI.createNotice(formData);
                toast({
                    title: 'Success',
                    description: 'Notice created successfully!',
                    variant: 'success'
                });
            } else if (modalMode === 'edit' && selectedNotice) {
                await adminAPI.updateNotice(selectedNotice._id, formData);
                toast({
                    title: 'Success',
                    description: 'Notice updated successfully!',
                    variant: 'success'
                });
            }

            await fetchNotices();
            closeModal();
        } catch (error) {
            console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} notice:`, error);
            toast({
                title: 'Error',
                description: `Failed to ${modalMode === 'create' ? 'create' : 'update'} notice`,
                variant: 'destructive'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (noticeId) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;

        try {
            await adminAPI.deleteNotice(noticeId);
            toast({
                title: 'Success',
                description: 'Notice deleted successfully!',
                variant: 'success'
            });
            await fetchNotices();
        } catch (error) {
            console.error('Error deleting notice:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete notice',
                variant: 'destructive'
            });
        }
    };

    const getStatusBadge = (notice) => {
        const now = new Date();
        const expiry = notice.expiryDate ? new Date(notice.expiryDate) : null;

        if (expiry && expiry < now) {
            return <Badge variant="secondary">Archived</Badge>;
        } else if (notice.status === 'draft') {
            return <Badge variant="outline">Draft</Badge>;
        } else {
            return <Badge variant="success">Published</Badge>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return new Date().toISOString().split('T')[0];
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Society Notices</h1>
                <Button
                    onClick={openCreateModal}
                    className={'!w-[200px]'}
                    spanClasses={'flex justify-center items-center'}
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Add New Notice
                </Button>
            </div>

            {/* Main Content Card */}
            <Card className="shadow-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-2">Loading notices...</span>
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No notices found.</p>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div
                                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
                                <div className="col-span-4">Title</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-4 text-right">Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-100">
                                {notices.map((notice) => (
                                    <div key={notice._id}
                                         className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="col-span-4">
                                            <h3 className="font-medium text-gray-900">{notice.title}</h3>
                                        </div>
                                        <div className="col-span-2">
                      <span className="text-sm text-gray-600">
                        {formatDate(notice.createdAt)}
                      </span>
                                        </div>
                                        <div className="col-span-2">
                                            {getStatusBadge(notice)}
                                        </div>
                                        <div className="col-span-4 flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openViewModal(notice)}
                                                className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
                                            >
                                                <Eye className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditModal(notice)}
                                                className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
                                            >
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(notice._id)}
                                                className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
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

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal} size="lg">
                <ModalHeader>
                    <ModalTitle>
                        {modalMode === 'create' && 'Add New Notice'}
                        {modalMode === 'edit' && 'Edit Notice'}
                        {modalMode === 'view' && 'Notice Details'}
                    </ModalTitle>
                    <ModalCloseButton onClick={closeModal}/>
                </ModalHeader>
                <ModalBody>
                    {modalMode === 'view' && selectedNotice ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{selectedNotice.title}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{selectedNotice.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Category</label>
                                    <p className="text-sm text-gray-900 capitalize">{selectedNotice.category}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Priority</label>
                                    <p className="text-sm text-gray-900 capitalize">{selectedNotice.priority}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Created At</label>
                                    <p className="text-sm text-gray-900">{new Date(selectedNotice.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                                    <p className="text-sm text-gray-900">
                                        {selectedNotice.expiryDate ? new Date(selectedNotice.expiryDate).toLocaleDateString() : 'No expiry'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter notice title"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter notice description"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date (Optional)
                                </label>
                                <Input
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full"
                                />
                            </div>
                        </form>
                    )}
                </ModalBody>
                <ModalFooter>
                    {modalMode !== 'view' && (
                        <Button
                            onClick={handleSubmit}
                            disabled={actionLoading}
                            variant="primary"
                        >
                            {actionLoading ? 'Processing...' : modalMode === 'create' ? 'Create Notice' : 'Update Notice'}
                        </Button>
                    )}
                    <Button onClick={closeModal} variant="outline">
                        {modalMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default AdminNotices;