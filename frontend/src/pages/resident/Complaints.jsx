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
import {AlertCircle, Edit, Eye, Loader2, Plus, Trash2, Search} from 'lucide-react';
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
    const [modalMode, setModalMode] = useState('create');
    const [formData, setFormData] = useState({title: '', description: '', category: 'Maintenance'});
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
                category: categoryFilter || undefined
            };
            const response = await residentAPI.getComplaints(params);
            setComplaints(response.data?.data?.complaints || []);
            setTotalPages(response.data?.pagination?.totalPages || 1);
        } catch (error) {
            toast({title: "Error", description: "Failed to load complaints", variant: "destructive"});
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };
    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };
    const handlePageChange = (page) => setCurrentPage(page);

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({title: '', description: '', category: 'Maintenance'});
        setIsModalOpen(true);
    };

    const openEditModal = (complaint) => {
        setModalMode('edit');
        setSelectedComplaint(complaint);
        setFormData({title: complaint.title, description: complaint.description, category: complaint.category});
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
        setTimeout(() => {
            setFormData({title: '', description: '', category: 'Maintenance'});
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
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSelectChange = (name, value) => setFormData(prev => ({...prev, [name]: value}));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (modalMode === 'create') {
                if (attachment) {
                    const formDataWithFile = new FormData();
                    formDataWithFile.append('title', formData.title);
                    formDataWithFile.append('description', formData.description);
                    formDataWithFile.append('category', formData.category);
                    formDataWithFile.append('complaintAttachment', attachment);
                    await residentAPI.createComplaintWithAttachment(formDataWithFile);
                } else {
                    await residentAPI.createComplaint(formData);
                }
                toast({title: 'Success', description: 'Complaint submitted successfully'});
            } else if (modalMode === 'edit') {
                await residentAPI.updateComplaint(selectedComplaint._id, formData);
                toast({title: 'Success', description: 'Complaint updated successfully'});
            }
            closeModal();
            fetchComplaints();
        } catch (error) {
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
            toast({title: 'Success', description: 'Complaint deleted successfully'});
            closeDeleteDialog();
            fetchComplaints();
        } catch (error) {
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
                return 'yellow';
            case 'In Progress':
                return 'orange';
            case 'Resolved':
                return 'green';
            case 'Closed':
                return 'gray';
            default:
                return 'gray';
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
                return 'gray';
            default:
                return 'gray';
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center mt-6 space-x-2">
                <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>Prev</Button>
                {[...Array(totalPages)].map((_, i) => (
                    <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} className="w-8 h-8 p-0"
                            onClick={() => handlePageChange(i + 1)}>{i + 1}</Button>
                ))}
                <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>Next</Button>
            </div>
        );
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
            {/* Header */}
            {/* Header */}
            <div
                className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 shadow-lg flex flex-col md:flex-row justify-between items-center text-white space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold">My Complaints</h1>
                    <p className="text-sm opacity-90">Submit and track your complaints</p>
                </div>
                <div className="ml-auto">
                    <Button
                        onClick={openCreateModal}
                        className="bg-white text-indigo-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 font-medium flex items-center transition-all text-sm"
                    >
                        <Plus className="h-4 w-4 mr-1"/> New Complaint
                    </Button>
                </div>
            </div>


            {/* Filters */}
            <Card className="rounded-2xl shadow-lg overflow-visible mt-4">
                <CardHeader className="bg-white p-4">
                    <CardTitle className="text-gray-800">Complaints</CardTitle>
                    <CardDescription className="text-gray-500">View and manage your complaints</CardDescription>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                            <Input
                                placeholder="Search complaints..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Status Select */}
                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger
                                className="border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700">
                                <SelectValue placeholder="Filter by status"/>
                            </SelectTrigger>
                            <SelectContent className="z-50 shadow-lg bg-white rounded-lg">
                                <SelectItem value="">All Statuses</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Category Select */}
                        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                            <SelectTrigger
                                className="border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700">
                                <SelectValue placeholder="Filter by category"/>
                            </SelectTrigger>
                            <SelectContent className="z-50 shadow-lg bg-white rounded-lg">
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
            </Card>

            <CardContent className="bg-white">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500"/>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600">
                        <AlertCircle className="h-12 w-12 mb-2"/>
                        <h3 className="text-lg font-medium">No complaints found</h3>
                        <p>{searchQuery || statusFilter || categoryFilter ? 'Try adjusting your filters' : 'Click "New Complaint" to submit one'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {complaints.map((c) => (
                            <div key={c._id}
                                 className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border rounded-2xl p-4 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-indigo-700 text-lg">{c.title}</h3>
                                        <p className="text-gray-700 line-clamp-2 mt-1">{c.description}</p>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <Badge variant={getCategoryColor(c.category)}>{c.category}</Badge>
                                        <Badge variant={getStatusColor(c.status)}>{c.status}</Badge>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div
                                        className="text-sm text-gray-500">Submitted: {format(new Date(c.createdAt), 'MMM dd, yyyy')}</div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => openViewModal(c)}><Eye
                                            className="h-4 w-4 mr-1"/>View</Button>
                                        {c.status === 'Open' && (
                                            <>
                                                <Button variant="ghost" size="sm" onClick={() => openEditModal(c)}><Edit
                                                    className="h-4 w-4 mr-1"/>Edit</Button>
                                                <Button variant="ghost" size="sm"
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                        onClick={() => openDeleteDialog(c)}><Trash2
                                                    className="h-4 w-4 mr-1"/>Delete</Button>
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
        </div>
    );
};

export default ResidentComplaints;
