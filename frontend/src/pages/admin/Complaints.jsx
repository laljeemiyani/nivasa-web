import {useEffect, useState} from 'react';
import {adminAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card';
import {Button} from '../../components/ui/Button';
import {Badge} from '../../components/ui/Badge';
import {Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle} from '../../components/ui/Modal';
import {
    AlertTriangle,
    Archive,
    Calendar,
    CheckCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Filter,
    MessageSquare,
    Play,
    Tag,
    Trash2,
    User
} from 'lucide-react';

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
            case 'pending':
                return 'warning';
            case 'in_progress':
                return 'default';
            case 'resolved':
                return 'success';
            case 'closed':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority) {
            case 'low':
                return 'secondary';
            case 'medium':
                return 'default';
            case 'high':
                return 'warning';
            case 'urgent':
                return 'destructive';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-3 w-3"/>;
            case 'in_progress':
                return <Play className="h-3 w-3"/>;
            case 'resolved':
                return <CheckCircle2 className="h-3 w-3"/>;
            case 'closed':
                return <Archive className="h-3 w-3"/>;
            default:
                return null;
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'urgent':
                return <AlertTriangle className="h-3 w-3"/>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageSquare className="h-6 w-6 text-primary"/>
                    <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
                </div>
                <p className="text-gray-600">Manage and resolve resident complaints</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Complaints</CardTitle>
                    <CardDescription>View and manage all resident complaints</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="inline h-4 w-4 mr-1"/>
                                Filter by Status
                            </label>
                            <select
                                id="statusFilter"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
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
                        <div className="flex-1">
                            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                <Tag className="inline h-4 w-4 mr-1"/>
                                Filter by Category
                            </label>
                            <select
                                id="categoryFilter"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
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
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading complaints...</span>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                            <p className="text-gray-500">
                                {statusFilter || categoryFilter ? 'Try adjusting your filters' : 'No complaints have been submitted yet'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Responsive Table */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full table-auto">
                                    <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Resident</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                    {complaints.map((complaint, index) => (
                                        <tr
                                            key={complaint._id}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 line-clamp-1">
                                                    {complaint.title}
                                                </div>
                                                <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                                                    {complaint.description}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400"/>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {complaint.userId?.fullName || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {complaint.userId?.wing}-{complaint.userId?.flatNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className="capitalize">
                                                    {complaint.category}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={getPriorityBadgeVariant(complaint.priority)}
                                                       className="flex items-center gap-1 w-fit">
                                                    {getPriorityIcon(complaint.priority)}
                                                    <span className="capitalize">{complaint.priority}</span>
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={getStatusBadgeVariant(complaint.status)}
                                                       className="flex items-center gap-1 w-fit">
                                                    {getStatusIcon(complaint.status)}
                                                    <span
                                                        className="capitalize">{complaint.status.replace('_', ' ')}</span>
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Calendar className="h-3 w-3"/>
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        onClick={() => openModal(complaint, 'view')}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2"
                                                    >
                                                        <Eye className="h-4 w-4"/>
                                                    </Button>
                                                    {complaint.status === 'pending' && (
                                                        <Button
                                                            onClick={() => openModal(complaint, 'in_progress')}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Play className="h-4 w-4"/>
                                                        </Button>
                                                    )}
                                                    {complaint.status === 'in_progress' && (
                                                        <Button
                                                            onClick={() => openModal(complaint, 'resolved')}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2 text-green-600 hover:bg-green-50"
                                                        >
                                                            <CheckCircle className="h-4 w-4"/>
                                                        </Button>
                                                    )}
                                                    {complaint.status === 'resolved' && (
                                                        <Button
                                                            onClick={() => openModal(complaint, 'closed')}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2 text-gray-600 hover:bg-gray-50"
                                                        >
                                                            <Archive className="h-4 w-4"/>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => handleDelete(complaint._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </div>
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

            {/* Enhanced Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal} size="lg">
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-2">
                        {actionStatus === 'view' && <><Eye className="h-5 w-5"/>Complaint Details</>}
                        {actionStatus === 'in_progress' && <><Play className="h-5 w-5"/>Process Complaint</>}
                        {actionStatus === 'resolved' && <><CheckCircle className="h-5 w-5"/>Resolve Complaint</>}
                        {actionStatus === 'closed' && <><Archive className="h-5 w-5"/>Close Complaint</>}
                    </ModalTitle>
                    <ModalCloseButton onClick={closeModal}/>
                </ModalHeader>
                <ModalBody>
                    {selectedComplaint && (
                        <div className="space-y-6">
                            {/* Complaint Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Title</label>
                                        <p className="text-sm text-gray-900 font-medium">{selectedComplaint.title}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Category</label>
                                        <p className="text-sm text-gray-900 capitalize">{selectedComplaint.category}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Priority</label>
                                        <div className="mt-1">
                                            <Badge variant={getPriorityBadgeVariant(selectedComplaint.priority)}
                                                   className="flex items-center gap-1 w-fit">
                                                {getPriorityIcon(selectedComplaint.priority)}
                                                <span className="capitalize">{selectedComplaint.priority}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}
                                                   className="flex items-center gap-1 w-fit">
                                                {getStatusIcon(selectedComplaint.status)}
                                                <span
                                                    className="capitalize">{selectedComplaint.status.replace('_', ' ')}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Submitted by</label>
                                        <p className="text-sm text-gray-900">
                                            {selectedComplaint.userId?.fullName} ({selectedComplaint.userId?.wing}-{selectedComplaint.userId?.flatNumber})
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date</label>
                                        <p className="text-sm text-gray-900">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-900">{selectedComplaint.description}</p>
                                </div>
                            </div>

                            {/* Existing Admin Response */}
                            {selectedComplaint.adminResponse && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Previous Admin Response</label>
                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-gray-900">{selectedComplaint.adminResponse}</p>
                                    </div>
                                </div>
                            )}

                            {/* Admin Response Input */}
                            {actionStatus !== 'view' && (
                                <div>
                                    <label htmlFor="adminResponse"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Response to Resident {['in_progress', 'resolved'].includes(actionStatus) &&
                                        <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        id="adminResponse"
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        placeholder="Enter your response to the resident..."
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    {actionStatus !== 'view' && (
                        <Button
                            onClick={handleStatusUpdate}
                            disabled={actionLoading}
                            variant={actionStatus === 'resolved' ? 'default' : 'default'}
                            className="flex items-center gap-2"
                        >
                            {actionLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {actionStatus === 'in_progress' && <Play className="h-4 w-4"/>}
                                    {actionStatus === 'resolved' && <CheckCircle className="h-4 w-4"/>}
                                    {actionStatus === 'closed' && <Archive className="h-4 w-4"/>}
                                    Confirm {actionStatus === 'in_progress' ? 'Process' : actionStatus === 'resolved' ? 'Resolution' : 'Closure'}
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

export default AdminComplaints;