import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { noticeAPI, complaintAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { 
  MegaphoneIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  UserCircleIcon
} from '../../components/ui/Icons';

const ResidentDashboard = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [noticesResponse, complaintsResponse] = await Promise.all([
        noticeAPI.getNotices({ limit: 5 }),
        complaintAPI.getUserComplaints({ limit: 5 })
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-600">
          {user?.wing && user?.flatNumber ? `${user.wing}-${user.flatNumber}` : 'Resident Dashboard'}
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary-100">
              <UserCircleIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
              <div className="flex items-center mt-1">
                <Badge variant={user?.status === 'approved' ? 'success' : 'warning'}>
                  {user?.status}
                </Badge>
                <span className="text-sm text-gray-500 ml-2">
                  {user?.status === 'approved' ? 'You can access all features' : 'Waiting for admin approval'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <MegaphoneIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>Latest announcements from the society</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <MegaphoneIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notice.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {notice.description}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant="info">{notice.priority}</Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent notices</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>My Recent Complaints</CardTitle>
            <CardDescription>Your latest complaint submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <div key={complaint._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {complaint.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {complaint.description}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No complaints submitted yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentDashboard;
