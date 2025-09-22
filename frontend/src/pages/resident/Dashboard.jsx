import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext';
import {residentAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card';
import {Badge} from '../../components/ui/Badge';
import {
    MegaphoneIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    UserCircleIcon
} from '../../components/ui/Icons';

const ResidentDashboard = () => {
    const {user} = useAuth();
    const [notices, setNotices] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [noticesResponse, complaintsResponse] = await Promise.all([
                residentAPI.getNotices({limit: 5}),
                residentAPI.getComplaints({limit: 5})
            ]);

            setNotices(noticesResponse.data.data.notices);
            setComplaints(complaintsResponse.data.data.complaints);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-400"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'resolved':
                return 'success';
            case 'in_progress':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-8 px-4 md:px-8">
            {/* Header */}
            <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 p-6 shadow-lg">
                <h1 className="text-3xl font-bold text-white">Welcome back, {user?.fullName}!</h1>
                <p className="mt-1 text-lg text-purple-100">
                    {user?.wing && user?.flatNumber ? `${user.wing}-${user.flatNumber}` : 'Resident Dashboard'}
                </p>
            </div>

            {/* Account Status Card */}
            <Card className="bg-white shadow-md rounded-xl">
                <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-4 rounded-full bg-purple-50">
                        <UserCircleIcon className="h-8 w-8 text-purple-400"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                        <div className="flex items-center mt-2 space-x-2">
                            <Badge variant={user?.status === 'approved' ? 'success' : 'warning'}>
                                {user?.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                                {user?.status === 'approved' ? 'You can access all features' : 'Waiting for admin approval'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-purple-50 shadow-sm rounded-xl">
                    <CardContent className="flex items-center p-6">
                        <div className="p-4 rounded-full bg-purple-100">
                            <MegaphoneIcon className="h-8 w-8 text-purple-400"/>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Notices</p>
                            <p className="text-2xl font-bold text-gray-800">{notices.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-pink-50 shadow-sm rounded-xl">
                    <CardContent className="flex items-center p-6">
                        <div className="p-4 rounded-full bg-pink-100">
                            <ExclamationTriangleIcon className="h-8 w-8 text-pink-400"/>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">My Complaints</p>
                            <p className="text-2xl font-bold text-gray-800">{complaints.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-red-50 shadow-sm rounded-xl">
                    <CardContent className="flex items-center p-6">
                        <div className="p-4 rounded-full bg-red-100">
                            <CheckCircleIcon className="h-8 w-8 text-red-400"/>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Resolved Issues</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {complaints.filter(c => c.status === 'resolved').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Notices */}
                <Card className="shadow-sm rounded-xl">
                    <CardHeader className="bg-purple-50 text-gray-800 rounded-t-xl p-4">
                        <CardTitle>Recent Notices</CardTitle>
                        <CardDescription>Latest announcements from the society</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {notices.length > 0 ? (
                            notices.map((notice) => (
                                <div key={notice._id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <MegaphoneIcon className="h-6 w-6 text-purple-300"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{notice.title}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{notice.description}</p>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <Badge variant="info">{notice.priority}</Badge>
                                            <span className="text-xs text-gray-500">
                                                {new Date(notice.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No recent notices</p>
                        )}
                    </CardContent>
                </Card>

                {/* My Recent Complaints */}
                <Card className="shadow-sm rounded-xl">
                    <CardHeader className="bg-pink-50 text-gray-800 rounded-t-xl p-4">
                        <CardTitle>My Recent Complaints</CardTitle>
                        <CardDescription>Your latest complaint submissions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <div key={complaint._id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-pink-300"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{complaint.title}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <Badge variant={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                                            <span className="text-xs text-gray-500">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No complaints submitted yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResidentDashboard;
