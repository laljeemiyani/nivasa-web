import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast.jsx';
import {residentAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card.jsx';
import {Input} from '../../components/ui/Input.jsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../components/ui/Select.jsx';
import {Badge} from '../../components/ui/Badge.jsx';
import {Button} from '../../components/ui/Button.jsx';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../../components/ui/Dialog.jsx';
import {AlertCircle, Calendar, FileText, Loader2, Search} from 'lucide-react';
import {format} from 'date-fns';

const ResidentNotices = () => {
    const {toast} = useToast();
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
                category: categoryFilter ? categoryFilter.toLowerCase() : undefined,
                priority: priorityFilter ? priorityFilter.toLowerCase() : undefined,
                isActive: true // Only show active notices
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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePriorityChange = (value) => {
        setPriorityFilter(value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openNoticeModal = (notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    const closeNoticeModal = () => {
        setIsModalOpen(false);
        setSelectedNotice(null);
    };

    const handleViewAttachment = (attachment) => {
        if (attachment) {
            window.open(`${import.meta.env.VITE_API_URL}/uploads/notices/${attachment}`, '_blank');
        }
    };

    const getPriorityColor = (priority) => {
        const normalizedPriority = priority ? priority.toLowerCase() : '';
        switch (normalizedPriority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'warning';
            case 'low':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getCategoryColor = (category) => {
        const normalizedCategory = category ? category.toLowerCase() : '';
        switch (normalizedCategory) {
            case 'maintenance':
                return 'blue';
            case 'security':
                return 'red';
            case 'community':
            case 'event':
                return 'green';
            case 'emergency':
            case 'other':
                return 'destructive';
            case 'general':
            case 'payment':
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
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Society Notices</h1>
                <p className="text-gray-600 content-center">View all society announcements and notices</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Notices</CardTitle>
                    <CardDescription>View all society notices and announcements</CardDescription>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search notices..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-8 h-10"
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="h-10"> {/* Added h-10 */}
                                <SelectValue placeholder="Filter by category">{categoryFilter}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Security">Security</SelectItem>
                                <SelectItem value="Community">Community</SelectItem>
                                <SelectItem value="Emergency">Emergency</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={priorityFilter} onValueChange={handlePriorityChange}>
                            <SelectTrigger className="h-10"> {/* Added h-10 */}
                                <SelectValue placeholder="Filter by priority">{priorityFilter}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Priorities</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2"/>
                            <h3 className="text-lg font-medium">No notices found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || categoryFilter || priorityFilter
                                    ? 'Try adjusting your filters'
                                    : 'There are no active notices at this time'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => openNoticeModal(notice)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-lg">{notice.title}</h3>
                                            <p className="text-gray-600 line-clamp-2 mt-1">{notice.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Badge variant={getCategoryColor(notice.category)}>
                                                {notice.category}
                                            </Badge>
                                            <Badge variant={getPriorityColor(notice.priority)}>
                                                {notice.priority}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mt-3">
                                        <Calendar className="h-4 w-4 mr-1"/>
                                        <span>
                      {notice.expiryDate
                          ? `Expires: ${format(new Date(notice.expiryDate), 'MMM dd, yyyy')}`
                          : 'No expiry date'}
                    </span>
                                    </div>
                                </div>
                            ))}

                            {renderPagination()}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notice Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={closeNoticeModal}>
                {selectedNotice && (
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{selectedNotice.title}</DialogTitle>
                            <div className="flex space-x-2 mt-2">
                                <Badge variant={getCategoryColor(selectedNotice.category)}>
                                    {selectedNotice.category}
                                </Badge>
                                <Badge variant={getPriorityColor(selectedNotice.priority)}>
                                    {selectedNotice.priority}
                                </Badge>
                            </div>
                            <DialogDescription className="pt-4">
                                {selectedNotice.description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {selectedNotice.attachment && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-primary-500"/>
                                        <div>
                                            <p className="text-sm font-medium">Attachment</p>
                                            <button
                                                onClick={() => handleViewAttachment(selectedNotice.attachment)}
                                                className="text-xs text-primary-600 hover:underline"
                                            >
                                                View attachment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1"/>
                                <span>
                  {selectedNotice.expiryDate
                      ? `Expires: ${format(new Date(selectedNotice.expiryDate), 'MMM dd, yyyy')}`
                      : 'No expiry date'}
                </span>
                            </div>

                            <div className="text-sm text-gray-500">
                                Posted: {format(new Date(selectedNotice.createdAt), 'MMM dd, yyyy')}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default ResidentNotices;
