import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast.jsx';
import {residentAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card.jsx';
import {Button} from '../../components/ui/Button.jsx';
import {Input} from '../../components/ui/Input.jsx';
import {Label} from '../../components/ui/Label.jsx';
import {Textarea} from '../../components/ui/Textarea.jsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../components/ui/Select.jsx';
import {Badge} from '../../components/ui/Badge.jsx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../../components/ui/Dialog.jsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '../../components/ui/AlertDialog.jsx';
import {AlertCircle, Edit, Eye, FileText, Loader2, Plus, Search, Trash2} from 'lucide-react';
import {format} from 'date-fns';
import FileUpload from '../../components/ui/FileUpload.jsx';

const ResidentComplaints = () => {
    const {toast} = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Maintenance'
    });
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, [currentPage, searchQuery, statusFilter, categoryFilter]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
                limit: 10,
                search: searchQuery || undefined,
                status: statusFilter || undefined,
                category: categoryFilter || undefined,
            };

            const response = await residentAPI.getComplaints(params);

            if (!response.data?.data) {
                console.warn("Complaints data not found in the response");
                setComplaints([]);
                setTotalPages(1);
                return;
            }

            setComplaints(response.data.data.complaints || []);
            setTotalPages(response.data.pagination?.totalPages || 1);

        } catch (error) {
            console.error("Error fetching complaints:", error);
            toast({
                title: "Error",
                description: "Failed to load complaints",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            title: '',
            description: '',
            category: 'Maintenance'
        });
        setIsModalOpen(true);
    };

    const openEditModal = (complaint) => {
        setModalMode('edit');
        setSelectedComplaint(complaint);
        setFormData({
            title: complaint.title,
            description: complaint.description,
            category: complaint.category
        });
        setIsModalOpen(true);
    };

    const openViewModal = (complaint) => {
        setModalMode('view');
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
        setAttachment(null);
        // Reset form after a short delay to avoid visual glitches
        setTimeout(() => {
            setFormData({
                title: '',
                description: '',
                category: 'Maintenance'
            });
        }, 100);
    };

    const openDeleteDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedComplaint(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            if (modalMode === 'create') {
                if (attachment) {
                    // Create complaint with attachment
                    const formDataWithFile = new FormData();
                    formDataWithFile.append('title', formData.title);
                    formDataWithFile.append('description', formData.description);
                    formDataWithFile.append('category', formData.category);
                    formDataWithFile.append('complaintAttachment', attachment);

                    await residentAPI.createComplaintWithAttachment(formDataWithFile);
                } else {
                    // Create complaint without attachment
                    await residentAPI.createComplaint(formData);
                }

                toast({
                    title: 'Success',
                    description: 'Complaint submitted successfully'
                });
            } else if (modalMode === 'edit') {
                await residentAPI.updateComplaint(selectedComplaint._id, formData);
                toast({
                    title: 'Success',
                    description: 'Complaint updated successfully'
                });
            }

            closeModal();
            fetchComplaints();
        } catch (error) {
            console.error('Error submitting complaint:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to submit complaint',
                variant: 'destructive'
            });
        } finally {
            setSubmitting(false);
            setAttachment(null);
        }
    };

    const handleDelete = async () => {
        try {
            await residentAPI.deleteComplaint(selectedComplaint._id);
            toast({
                title: 'Success',
                description: 'Complaint deleted successfully'
            });
            closeDeleteDialog();
            fetchComplaints();
        } catch (error) {
            console.error('Error deleting complaint:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete complaint',
                variant: 'destructive'
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return 'default';
            case 'In Progress':
                return 'warning';
            case 'Resolved':
                return 'success';
            case 'Closed':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Maintenance':
                return 'blue';
            case 'Security':
                return 'red';
            case 'Cleanliness':
                return 'green';
            case 'Noise':
                return 'orange';
            case 'Parking':
                return 'purple';
            case 'Other':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center mt-6 space-x-2">
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            variant={currentPage === i + 1 ? 'default' : 'outline'}
                            className="w-8 h-8 p-0"
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
                    <p className="text-gray-600">Submit and track your complaints</p>
                </div>
                <Button onClick={openCreateModal} className={'!w-[200px]'}
                        spanClasses={'flex justify-center items-center'}>
                    <Plus className="h-4 w-4 mr-2"/>
                    New Complaint
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Complaints</CardTitle>
                    <CardDescription>View and manage your complaints</CardDescription>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search complaints..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-8"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Statuses</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by category"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Security">Security</SelectItem>
                                <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                                <SelectItem value="Noise">Noise</SelectItem>
                                <SelectItem value="Parking">Parking</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2"/>
                            <h3 className="text-lg font-medium">No complaints found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || statusFilter || categoryFilter
                                    ? 'Try adjusting your filters'
                                    : 'Click the "New Complaint" button to submit a complaint'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map((complaint) => (
                                <div
                                    key={complaint._id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{complaint.title}</h3>
                                            <p className="text-gray-600 line-clamp-2 mt-1">{complaint.description}</p>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Badge variant={getCategoryColor(complaint.category)}>
                                                {complaint.category}
                                            </Badge>
                                            <Badge variant={getStatusColor(complaint.status)}>
                                                {complaint.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-sm text-gray-500">
                                            Submitted: {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openViewModal(complaint)}
                                            >
                                                <Eye className="h-4 w-4 mr-1"/>
                                                View
                                            </Button>

                                            {complaint.status === 'Open' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(complaint)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-1"/>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => openDeleteDialog(complaint)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1"/>
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {renderPagination()}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Complaint Modal (Create/Edit/View) */}
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'create' ? 'Submit New Complaint' :
                                modalMode === 'edit' ? 'Edit Complaint' : 'View Complaint'}
                        </DialogTitle>
                        <DialogDescription>
                            {modalMode === 'create' ? 'Fill in the details to submit a new complaint.' :
                                modalMode === 'edit' ? 'Update the details of your complaint.' :
                                    'Complaint details and status.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-2">
                            {modalMode === 'view' && selectedComplaint && (
                                <div className="flex justify-between items-center">
                                    <Badge variant={getStatusColor(selectedComplaint.status)}>
                                        {selectedComplaint.status}
                                    </Badge>
                                    <Badge variant={getCategoryColor(selectedComplaint.category)}>
                                        {selectedComplaint.category}
                                    </Badge>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={modalMode === 'view' && selectedComplaint ? selectedComplaint.title : formData.title}
                                    onChange={handleInputChange}
                                    required
                                    disabled={modalMode === 'view'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={modalMode === 'view' && selectedComplaint ? selectedComplaint.category : formData.category}
                                    onValueChange={(value) => handleSelectChange('category', value)}
                                    disabled={modalMode === 'view'}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
                                        <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                                        <SelectItem value="Noise">Noise</SelectItem>
                                        <SelectItem value="Parking">Parking</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={modalMode === 'view' && selectedComplaint ? selectedComplaint.description : formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    required
                                    disabled={modalMode === 'view'}
                                />
                            </div>

                            {modalMode !== 'view' && (
                                <div className="space-y-2">
                                    <Label>Attachment (Optional)</Label>
                                    <FileUpload
                                        accept="image/*,.pdf,.doc,.docx"
                                        onChange={setAttachment}
                                        multiple={false}
                                        variant="outlined"
                                        showPreview={true}
                                    />
                                    <p className="text-xs text-gray-500">Upload images or documents related to your
                                        complaint</p>
                                </div>
                            )}

                            {modalMode === 'view' && selectedComplaint?.attachment && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-primary-500"/>
                                        <div>
                                            <p className="text-sm font-medium">Attachment</p>
                                            <a
                                                href={`${import.meta.env.VITE_API_URL}/uploads/complaints/${selectedComplaint.attachment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary-600 hover:underline"
                                            >
                                                View attachment
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalMode === 'view' && selectedComplaint && selectedComplaint.adminResponse && (
                                <div className="space-y-2 border-t pt-4">
                                    <Label>Admin Response</Label>
                                    <div className="p-3 bg-gray-50 rounded-md text-gray-700">
                                        {selectedComplaint.adminResponse}
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-6">
                            {modalMode !== 'view' ? (
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    {modalMode === 'create' ? 'Submit Complaint' : 'Update Complaint'}
                                </Button>
                            ) : (
                                <Button type="button" onClick={closeModal}>Close</Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your complaint.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ResidentComplaints;
