import {useEffect, useState} from 'react';
import {notificationAPI} from '../../services/notificationService';
import {formatDistanceToNow} from 'date-fns';
import {Check, Trash2} from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    const fetchNotifications = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await notificationAPI.getNotifications({
                page,
                limit: 10
            });

            setNotifications(response.data.data.notifications || []);
            setPagination(response.data.data.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: response.data.data.pagination?.totalItems || 0
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Notifications"
                description="View and manage your notifications"
            />

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        All Notifications ({pagination.totalItems})
                    </h2>
                    <button
                        onClick={handleMarkAllAsRead}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                        <Check className="w-4 h-4"/>
                        Mark All as Read
                    </button>
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
                                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                            <div className="flex space-x-2">
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
                                        <p className="text-gray-700 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                                        </p>
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

                                    {[...Array(pagination.totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded-md ${pagination.currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

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

export default Notifications;