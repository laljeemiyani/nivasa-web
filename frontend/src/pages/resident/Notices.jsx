import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast.jsx';
import { residentAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/Dialog.jsx';
import { Loader2, Search, Calendar, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

const ResidentNotices = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [notices, setNotices] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, [currentPage, searchQuery, categoryFilter, priorityFilter]);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                search: searchQuery || undefined,
                category: categoryFilter || undefined,
                priority: priorityFilter || undefined,
                isActive: true
            };
            const response = await residentAPI.getNotices(params);
            setNotices(response.data.data.notices);
            setTotalPages(response.data.data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching notices:', error);
            toast({
                title: 'Error',
                description: 'Failed to load notices',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
    const handleCategoryChange = (value) => { setCategoryFilter(value); setCurrentPage(1); };
    const handlePriorityChange = (value) => { setPriorityFilter(value); setCurrentPage(1); };
    const handlePageChange = (page) => setCurrentPage(page);
    const openNoticeModal = (notice) => { setSelectedNotice(notice); setIsModalOpen(true); };
    const closeNoticeModal = () => { setIsModalOpen(false); setSelectedNotice(null); };
    const handleViewAttachment = (attachment) => { if (attachment) window.open(`${import.meta.env.VITE_API_URL}/uploads/notices/${attachment}`, '_blank'); };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'destructive';
            case 'Medium': return 'warning';
            case 'Low': return 'secondary';
            default: return 'secondary';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Maintenance': return 'blue';
            case 'Security': return 'red';
            case 'Community': return 'green';
            case 'Emergency': return 'destructive';
            case 'General': return 'secondary';
            default: return 'secondary';
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center mt-6 space-x-2">
                <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        className="w-10 h-10 p-0 rounded-full"
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
                <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
            </div>
        );
    };

    return (
        <div className="space-y-6 px-4 md:px-8">
            {/* Header */}
            <div className="space-y-6 px-4 md:px-8">
                {/* Gradient Header */}
                <div className="text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-white">Society Notices</h1>
                    <p className="text-white/90 mt-1">Stay updated with the latest society announcements</p>
                </div>
            </div>

            {/* Card */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-visible">
                <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-2xl overflow-visible">
                    <CardTitle className="text-2xl font-bold">Notices</CardTitle>
                    <CardDescription className="text-gray-100 mt-1">View all society notices clearly</CardDescription>

                    {/* Filters */}

                </CardHeader>

                <CardContent className="bg-gray-50">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                            <AlertCircle className="h-12 w-12 mb-2" />
                            <h3 className="text-lg font-medium">No notices found</h3>
                            <p>{searchQuery || categoryFilter || priorityFilter ? 'Try adjusting your filters' : 'No active notices at the moment'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer bg-white"
                                    onClick={() => openNoticeModal(notice)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">{notice.title}</h3>
                                            <p className="text-gray-700 line-clamp-2 mt-1">{notice.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Badge variant={getCategoryColor(notice.category)}>{notice.category}</Badge>
                                            <Badge variant={getPriorityColor(notice.priority)}>{notice.priority}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 mt-3">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{notice.expiryDate ? `Expires: ${format(new Date(notice.expiryDate), 'MMM dd, yyyy')}` : 'No expiry date'}</span>
                                    </div>
                                </div>
                            ))}
                            {renderPagination()}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={closeNoticeModal}>
                {selectedNotice && (
                    <DialogContent className="sm:max-w-lg rounded-2xl shadow-2xl overflow-visible">
                        <DialogHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-2xl">
                            <DialogTitle className="text-xl font-bold">{selectedNotice.title}</DialogTitle>
                            <div className="flex space-x-2 mt-2">
                                <Badge variant={getCategoryColor(selectedNotice.category)}>{selectedNotice.category}</Badge>
                                <Badge variant={getPriorityColor(selectedNotice.priority)}>{selectedNotice.priority}</Badge>
                            </div>
                        </DialogHeader>
                        <DialogDescription className="p-4 text-gray-800">{selectedNotice.description}</DialogDescription>

                        {selectedNotice.attachment && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-300 flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium">Attachment</p>
                                    <button
                                        onClick={() => handleViewAttachment(selectedNotice.attachment)}
                                        className="text-xs text-indigo-700 hover:underline"
                                    >
                                        View attachment
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 text-sm text-gray-700 flex justify-between">
                            <div>
                                <Calendar className="h-4 w-4 inline mr-1" />
                                {selectedNotice.expiryDate ? `Expires: ${format(new Date(selectedNotice.expiryDate), 'MMM dd, yyyy')}` : 'No expiry date'}
                            </div>
                            <div>Posted: {format(new Date(selectedNotice.createdAt), 'MMM dd, yyyy')}</div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default ResidentNotices;
