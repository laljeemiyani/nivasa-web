import {useEffect, useState} from 'react';
import {notificationAPI} from '../../services/notificationService';
import {formatDistanceToNow} from 'date-fns';
import {Check, Trash2, User, Users} from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [filter, setFilter] = useState({
        isRead: '',
        type: '',
        relatedModel: ''
    });

    const fetchNotifications = async (page = 1) => {
        try {
            setIsLoading(true);
            const params = {
                page,
                limit: 10,
                ...filter
            };

            // Remove empty filter values
            Object.keys(params).forEach(key => {
                if (params[key] === '') {
                    delete params[key];
                }
            });

            const response = await notificationAPI.getNotifications(params);

            setNotifications(response.data.data.notifications || []);
            setPagination(response.data.data.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(notifications.map(notification =>
                notification._id === id ? {...notification, isRead: true} : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await notificationAPI.deleteNotification(id);
            setNotifications(notifications.filter(notification => notification._id !== id));
            setPagination(prev => ({
                ...prev,
                totalItems: prev.totalItems - 1
            }));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(notification => ({...notification, isRead: true})));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handlePageChange = (page) => {
        fetchNotifications(page);
    };

    const handleFilterChange = (field, value) => {
        setFilter(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <span className="text-green-500 text-xl">✅</span>;
            case 'warning':
                return <span className="text-yellow-500 text-xl">⚠️</span>;
            case 'error':
                return <span className="text-red-500 text-xl">❌</span>;
            default:
                return <span className="text-blue-500 text-xl">ℹ️</span>;
        }
    };

    const getNotificationTypeClass = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    const getRelatedModelIcon = (model) => {
        switch (model) {
            case 'User':
                return <User className="w-4 h-4"/>;
            case 'Vehicle':
            case 'Complaint':
            case 'Notice':
            case 'Payment':
            case 'Maintenance':
                return <Users className="w-4 h-4"/>;
            default:
                return <Users className="w-4 h-4"/>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Notifications"
                description="Manage and view all system notifications"
            />

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        All Notifications ({pagination.totalItems})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                            <Check className="w-4 h-4"/>
                            Mark All as Read
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filter.isRead}
                            onChange={(e) => handleFilterChange('isRead', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All</option>
                            <option value="false">Unread</option>
                            <option value="true">Read</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={filter.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="info">Info</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Related Model</label>
                        <select
                            value={filter.relatedModel}
                            onChange={(e) => handleFilterChange('relatedModel', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Models</option>
                            <option value="User">User</option>
                            <option value="Vehicle">Vehicle</option>
                            <option value="Complaint">Complaint</option>
                            <option value="Notice">Notice</option>
                            <option value="Payment">Payment</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                        <button
                            onClick={() => {
                                setFilter({
                                    isRead: '',
                                    type: '',
                                    relatedModel: ''
                                });
                            }}
                            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-4 border rounded-lg ${!notification.isRead ? getNotificationTypeClass(notification.type) : 'bg-gray-50 border-gray-200'}`}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                                <p className="text-gray-700 mt-1">{notification.message}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        {getRelatedModelIcon(notification.relatedModel)}
                                                        {notification.relatedModel}
                                                    </span>
                                                    <span>
                                                        {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                                                    </span>
                                                    {notification.userId && (
                                                        <span>User: {notification.userId.email}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-5 h-5"/>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteNotification(notification._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = index + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = index + 1;
                                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + index;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + index;
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-1 rounded-md ${pagination.currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className={`px-3 py-1 rounded-md ${pagination.currentPage === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;