import {useState, useEffect} from 'react';
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
            const response = await notificationAPI.getNotifications({page, limit: 10});
            setNotifications(response.data.notifications || []);
            setPagination(response.data.pagination || {currentPage: 1, totalPages: 1, totalItems: 0});
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
            setNotifications(notifications.map(n => n._id === id ? {...n, isRead: true} : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await notificationAPI.deleteNotification(id);
            setNotifications(notifications.filter(n => n._id !== id));
            setPagination(prev => ({...prev, totalItems: prev.totalItems - 1}));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({...n, isRead: true})));
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
                return <span className="text-green-600 text-2xl">✅</span>;
            case 'warning':
                return <span className="text-yellow-500 text-2xl">⚠️</span>;
            case 'error':
                return <span className="text-red-600 text-2xl">❌</span>;
            default:
                return <span className="text-blue-500 text-2xl">ℹ️</span>;
        }
    };

    const getNotificationTypeClass = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-300';
            case 'warning':
                return 'bg-yellow-50 border-yellow-300';
            case 'error':
                return 'bg-red-50 border-red-300';
            default:
                return 'bg-blue-50 border-blue-300';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Gradient Page Header */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md p-6 mb-6">
                <PageHeader
                    title={<span className="text-white">{'Notifications'}</span>}
                    description={<span className="text-white/90">{'View and manage your notifications'}</span>}
                />
            </div>


            <div className="bg-white rounded-2xl shadow-xl mt-6">
                {/* Gradient Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white p-4 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
                        All Notifications ({pagination.totalItems})
                    </h2>
                </div>

                {/* Mark All as Read Button */}
                <div className="flex justify-end px-6 mb-6">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 flex items-center gap-2 transition-all duration-300 shadow-md text-sm"
                    >
                        <Check className="w-4 h-4"/>
                        Mark All as Read
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4 px-6 pb-6">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${!notification.isRead ? getNotificationTypeClass(notification.type) : 'bg-gray-50 border-gray-200'}`}
                            >
                                {/* Gradient Top Line */}
                                <div
                                    className="w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                                <div className="p-5 flex items-start">
                                    <div className="flex-shrink-0 mr-4 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                            <div className="flex space-x-2">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-5 h-5"/>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteNotification(notification._id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mt-2">{notification.message}</p>
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
                                        className={`px-3 py-1 rounded-md ${pagination.currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(pagination.totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded-md ${pagination.currentPage === index + 1 ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className={`px-3 py-1 rounded-md ${pagination.currentPage === pagination.totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
